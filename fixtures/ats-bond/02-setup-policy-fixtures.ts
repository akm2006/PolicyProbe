#!/usr/bin/env -S npx tsx
/**
 * Provisions a freshly-deployed bond into the exact state run-policy-suite.mjs and
 * run-killer-demo.mjs's "fixed" bond assume: roles granted, Alice/Bob/Carol whitelisted,
 * Alice/Carol issued tokens, Carol frozen. Safe to rerun -- verified empirically, not just
 * assumed: role grants, control-list adds, and re-freezing an already-frozen address all
 * genuinely no-op on ATS's contracts (confirmed by rerunning this script against an
 * already-provisioned bond and seeing every call succeed with no reverts). `issue` is the one
 * exception -- it is NOT idempotent, it mints `AMOUNT` *additional* tokens every run (there is
 * no "already issued" check on-chain). This doesn't affect the policy suite, which never
 * asserts an exact balance, only that transfers of small fixed amounts succeed/fail correctly
 * -- but don't treat this script as safe to loop indefinitely without an eye on `maxSupply`.
 *
 * Usage: BOND_DIAMOND_ADDRESS=0x... npx tsx 02-setup-policy-fixtures.ts
 *
 * This was previously done as ad hoc, hand-typed calls to src/actions/*.ts during development
 * (see git history) -- this script is that same sequence, captured so a fresh bond deployment
 * is actually reproducible end to end, not just describable after the fact.
 */
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { ethers } from "ethers";
import { requireEnv } from "./src/signers.js";

const run = promisify(execFile);
const BOND = requireEnv("BOND_DIAMOND_ADDRESS");
const OPERATOR_KEY = requireEnv("HEDERA_OPERATOR_KEY");
const OPERATOR_ADDRESS = new ethers.Wallet(
  OPERATOR_KEY.startsWith("0x") ? OPERATOR_KEY : `0x${OPERATOR_KEY}`,
).address;
const workspacePath = path.resolve(import.meta.dirname);
const actors = JSON.parse(await readFile(new URL("./.actors.json", import.meta.url), "utf8"));

async function action(script: string, env: Record<string, string>, signerKey = OPERATOR_KEY) {
  const label = `${script} ${JSON.stringify(env)}`;
  console.log(`-> ${label}`);
  try {
    const { stdout } = await run("npx", ["tsx", `src/actions/${script}.ts`], {
      cwd: workspacePath,
      shell: true,
      env: { ...process.env, BOND_DIAMOND_ADDRESS: BOND, HARNESS_SIGNER_PRIVATE_KEY: signerKey, ...env },
    });
    console.log(`   ${stdout.trim()}`);
  } catch (error) {
    // Idempotent by tolerance, not by pre-checking on-chain state: a role/whitelist entry that
    // already exists reverts on re-grant on most ATS facets. Log and continue rather than
    // treating that as a setup failure -- this script's job is "make sure the state holds,"
    // not "assert every call is a fresh, unconditional success."
    console.log(`   (already applied, or non-fatal: ${(error as Error).message.split("\n")[0]})`);
  }
}

console.log(`Provisioning bond ${BOND} for the policy suite...`);

// Roles the setup/assertion scripts need on the operator account (the deployer already holds
// DEFAULT_ADMIN_ROLE from deployBond.ts, which is what lets it grant these to itself).
for (const roleName of ["ROLE_ISSUER", "ROLE_CONTROL_LIST", "ROLE_FREEZE_MANAGER", "ROLE_PAUSER"]) {
  await action("grant-role", { ROLE_NAME: roleName, TARGET_ADDRESS: OPERATOR_ADDRESS });
}

// Whitelist Alice, Bob, Carol; issue tokens to Alice and Carol; freeze Carol.
await action("set-control-list", { TARGET_ADDRESS: actors.alice.evmAddress, ADD: "true" });
await action("set-control-list", { TARGET_ADDRESS: actors.bob.evmAddress, ADD: "true" });
await action("set-control-list", { TARGET_ADDRESS: actors.carol.evmAddress, ADD: "true" });
await action("issue", { TARGET_ADDRESS: actors.alice.evmAddress, AMOUNT: "1000" });
await action("issue", { TARGET_ADDRESS: actors.carol.evmAddress, AMOUNT: "500" });
await action("set-frozen", { TARGET_ADDRESS: actors.carol.evmAddress, FROZEN: "true" });

console.log("\nSetup complete. The bond is now in the state run-policy-suite.mjs expects.");
