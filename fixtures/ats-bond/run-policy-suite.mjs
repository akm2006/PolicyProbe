#!/usr/bin/env node
/**
 * Runs PolicyProbe's real chain-assertion engine (from the Harness fork's build output)
 * against the real, already-deployed ATS bond on Hedera testnet. This is the actual
 * mechanism a Harness recipe's `chainValidation.assertions` would invoke -- not a
 * reimplementation, the same `runChainAssertions` export.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ethers } from "ethers";

const HARNESS_DIST = path.resolve(import.meta.dirname, "../../../hedera-harness/dist");
const { runChainAssertions } = await import(
  pathToFileURL(path.join(HARNESS_DIST, "validation/chainAssertions.js")).href
);

const actors = JSON.parse(await readFile(new URL("./.actors.json", import.meta.url), "utf8"));
const BOND = "0x19CD7866076758E3AF6C79aD7Ce725331A5606B8";
const workspacePath = path.resolve(import.meta.dirname);

function toChainSigner(actor) {
  return { accountId: actor.accountId, privateKeyHex: actor.privateKeyHex, evmAddress: actor.evmAddress, network: "testnet" };
}

const operatorKey = process.env.HEDERA_OPERATOR_KEY;
const primarySigner = {
  accountId: process.env.HEDERA_OPERATOR_ID,
  privateKeyHex: operatorKey,
  // Derived, not hardcoded -- this script must work for whoever's operator credentials are
  // sourced, not just the specific account used the first time it was run.
  evmAddress: new ethers.Wallet(operatorKey.startsWith("0x") ? operatorKey : `0x${operatorKey}`).address,
  network: "testnet",
};

const action = (name, script, env = {}) => ({
  name,
  command: `BOND_DIAMOND_ADDRESS=${BOND} ${Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")} npx tsx src/actions/${script}.ts`,
  timeoutMs: 30_000,
});

const assertions = [
  {
    id: "reject-unverified-transfer",
    description: "Unverified investor must not receive the bond",
    actor: "alice",
    action: action("attempt-transfer-to-fresh-unverified", "transfer", {
      TARGET_ADDRESS: actors.attacker.evmAddress, // never whitelisted in this run
      AMOUNT: 1,
    }),
    expect: { outcome: "mustRevert" },
  },
  {
    id: "verified-transfer-succeeds",
    description: "Already-verified investor can receive the bond",
    actor: "alice",
    action: action("transfer-to-verified-bob", "transfer", { TARGET_ADDRESS: actors.bob.evmAddress, AMOUNT: 1 }),
    expect: { outcome: "mustSucceed" },
  },
  {
    id: "attacker-cannot-freeze",
    description: "An account without the Pauser/Freeze role must not freeze a holder",
    actor: "attacker",
    action: action("attacker-attempts-freeze", "set-frozen", { TARGET_ADDRESS: actors.bob.evmAddress, FROZEN: true }),
    expect: { outcome: "mustRevert" },
  },
  {
    id: "frozen-holder-cannot-transfer",
    description: "A frozen holder must not be able to transfer",
    actor: "carol",
    action: action("frozen-carol-attempts-transfer", "transfer", { TARGET_ADDRESS: actors.bob.evmAddress, AMOUNT: 1 }),
    expect: { outcome: "mustRevert" },
  },
  {
    id: "compliance-can-pause",
    description: "The compliance/pauser role may pause the whole asset",
    action: action("pause-the-asset", "set-pause", { PAUSED: true }),
    expect: { outcome: "mustSucceed" },
  },
  {
    id: "paused-asset-blocks-transfer",
    description: "While the asset is paused, no transfer may succeed -- even between two verified investors",
    actor: "alice",
    action: action("transfer-while-paused", "transfer", { TARGET_ADDRESS: actors.bob.evmAddress, AMOUNT: 1 }),
    expect: { outcome: "mustRevert" },
  },
];

const findings = await runChainAssertions({
  workspacePath,
  chainValidation: {
    enabled: true,
    network: "testnet",
    operator: { accountIdEnv: "HEDERA_OPERATOR_ID", privateKeyEnv: "HEDERA_OPERATOR_KEY" },
    fundingHbar: 10,
    sweepBack: false,
    expose: { browserLocalStorageKey: "burnerWallet.pk", envVars: [] },
    assertions,
  },
  primarySigner,
  actorSigners: {
    alice: toChainSigner(actors.alice),
    bob: toChainSigner(actors.bob),
    carol: toChainSigner(actors.carol),
    attacker: toChainSigner(actors.attacker),
  },
});

console.log(`\n${assertions.length - findings.length} / ${assertions.length} PASS\n`);
for (const assertion of assertions) {
  const finding = findings.find(f => f.id === `chain-assertion:${assertion.id}`);
  console.log(`${finding ? "FAIL" : "PASS"}  ${assertion.id} -- ${assertion.description}`);
  if (finding) {
    console.log(`      ${finding.message}`);
    if (finding.evidence) console.log(`      evidence: ${JSON.stringify(finding.evidence)}`);
    if (finding.details) console.log(`      details: ${finding.details}`);
  }
}

// The suite's own "compliance-can-pause" assertion pauses the bond -- without undoing that,
// a second run would fail every mustSucceed assertion (and PASS every mustRevert one for the
// wrong reason: contract-wide pause, not the policy under test) purely from leftover state.
// Restore the bond to its pre-suite (unpaused) state so this script is actually rerunnable.
console.log("\ncleanup: unpausing the bond so this suite is rerunnable...");
{
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);
  await run("npx", ["tsx", "src/actions/set-pause.ts"], {
    cwd: workspacePath,
    env: { ...process.env, BOND_DIAMOND_ADDRESS: BOND, PAUSED: "false", HARNESS_SIGNER_PRIVATE_KEY: operatorKey },
  });
  console.log("cleanup: done.");
}
