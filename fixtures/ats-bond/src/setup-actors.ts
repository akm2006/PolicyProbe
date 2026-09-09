/**
 * One-time setup: creates 4 funded testnet accounts for the bond demo's actors (verified
 * investor, unverified investor, frozen investor, attacker) and writes their credentials to a
 * local, gitignored file. Run once; re-run only to replace/refund them.
 */
import { writeFile } from "node:fs/promises";
import * as sdk from "@hiero-ledger/sdk";
import { requireEnv } from "./signers.js";

const operatorId = requireEnv("HEDERA_OPERATOR_ID");
const operatorKeyRaw = requireEnv("HEDERA_OPERATOR_KEY").replace(/^0x/i, "");
const operatorKey = sdk.PrivateKey.fromStringECDSA(operatorKeyRaw);

const client = sdk.Client.forTestnet();
client.setOperator(sdk.AccountId.fromString(operatorId), operatorKey);

async function createActor(fundingHbar: number) {
  const key = sdk.PrivateKey.generateECDSA();
  const receipt = await (
    await new sdk.AccountCreateTransaction()
      .setECDSAKeyWithAlias(key)
      .setInitialBalance(new sdk.Hbar(fundingHbar))
      .execute(client)
  ).getReceipt(client);
  const accountId = receipt.accountId!.toString();
  return {
    accountId,
    evmAddress: `0x${key.publicKey.toEvmAddress()}`.replace("0x0x", "0x"),
    privateKeyHex: `0x${key.toStringRaw()}`,
  };
}

const actors = {
  alice: await createActor(5), // verified investor
  bob: await createActor(5), // unverified investor
  carol: await createActor(5), // verified, later frozen
  attacker: await createActor(5), // no roles granted
};

for (const [name, actor] of Object.entries(actors)) {
  console.log(`${name}: ${actor.accountId} (${actor.evmAddress})`);
}

await writeFile(
  new URL("../.actors.json", import.meta.url),
  `${JSON.stringify(actors, null, 2)}\n`,
  { mode: 0o600 },
);
console.log("Wrote .actors.json (gitignored)");

client.close();
