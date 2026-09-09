#!/usr/bin/env node
/**
 * The killer demo: the exact same deterministic chain assertion, run first against a
 * deliberately misconfigured bond (compliance gating left off -- a realistic issuer mistake),
 * then against the correctly configured one. Same assertion id, same policy, same actors --
 * only the deployed app differs. This is PolicyProbe's central "broken policy caught, then
 * fixed, same finding id resolves" narrative, using real Hedera testnet transactions both times.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HARNESS_DIST = path.resolve(import.meta.dirname, "../../../hedera-harness/dist");
const { runChainAssertions } = await import(
  pathToFileURL(path.join(HARNESS_DIST, "validation/chainAssertions.js")).href
);

const actors = JSON.parse(await readFile(new URL("./.actors.json", import.meta.url), "utf8"));
const workspacePath = path.resolve(import.meta.dirname);

const primarySigner = {
  accountId: process.env.HEDERA_OPERATOR_ID,
  privateKeyHex: process.env.HEDERA_OPERATOR_KEY,
  evmAddress: "0x5eDBC5E7e9100276E4c4F0D6C405fE4AD3B2b668",
  network: "testnet",
};

function toChainSigner(actor) {
  return { accountId: actor.accountId, privateKeyHex: actor.privateKeyHex, evmAddress: actor.evmAddress, network: "testnet" };
}

function reassertionSuite(bondAddress) {
  return [
    {
      id: "reject-unverified-transfer", // SAME id both runs -- this is what lets the repair loop
      description: "Unverified investor must not receive the bond",
      actor: "alice",
      action: {
        name: "attempt-transfer-to-attacker",
        command: `BOND_DIAMOND_ADDRESS=${bondAddress} TARGET_ADDRESS=${actors.attacker.evmAddress} AMOUNT=1 npx tsx src/actions/transfer.ts`,
        timeoutMs: 30_000,
      },
      expect: { outcome: "mustRevert" },
    },
  ];
}

async function run(label, bondAddress) {
  console.log(`\n=== ${label} (${bondAddress}) ===`);
  const findings = await runChainAssertions({
    workspacePath,
    chainValidation: {
      enabled: true,
      network: "testnet",
      operator: { accountIdEnv: "HEDERA_OPERATOR_ID", privateKeyEnv: "HEDERA_OPERATOR_KEY" },
      fundingHbar: 10,
      sweepBack: false,
      expose: { browserLocalStorageKey: "burnerWallet.pk", envVars: [] },
      assertions: reassertionSuite(bondAddress),
    },
    primarySigner,
    actorSigners: { alice: toChainSigner(actors.alice) },
  });

  if (findings.length === 0) {
    console.log("1 / 1 PASS");
    console.log("PASS  reject-unverified-transfer");
  } else {
    console.log("0 / 1 PASS");
    for (const finding of findings) {
      console.log(`FAIL  ${finding.id}`);
      console.log(`      ${finding.message}`);
      console.log(`      evidence: ${JSON.stringify(finding.evidence)}`);
    }
  }
  return findings;
}

const BROKEN_BOND = "0xeff72A209498C890e3583702bD7818570a5c9E03"; // isWhiteList: false -- no compliance gate at all
const FIXED_BOND = "0x19CD7866076758E3AF6C79aD7Ce725331A5606B8"; // isWhiteList: true -- the corrected config

console.log("PolicyProbe killer demo: same assertion, same policy, real Hedera testnet both times.");
const before = await run("BEFORE (misconfigured bond -- compliance gating left off)", BROKEN_BOND);
const after = await run("AFTER (fixed: compliance gating enabled)", FIXED_BOND);

console.log(`\n${before.length > 0 && after.length === 0 ? "DEMO CONFIRMED: caught, then fixed." : "unexpected result -- check manually."}`);
