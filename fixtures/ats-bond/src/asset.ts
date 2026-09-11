import { ethers } from "ethers";
import {
  IAsset__factory,
  IKyc__factory,
  IFreeze__factory,
  IPause__factory,
  IAccessControl__factory,
  ITransfer__factory,
  IControlList__factory,
} from "@hashgraph/asset-tokenization-contracts";
import { getSigner } from "./signers.js";
import { requireEnv } from "./signers.js";

/** All facets share one diamond address -- connect whichever facet interface a script needs. */
export function connectAsset(signer = getSigner()) {
  const diamond = requireEnv("BOND_DIAMOND_ADDRESS");
  // The ATS package publishes CommonJS-generated ethers types. At runtime this is the same
  // ethers v6 ContractRunner; the cast contains the module-format type split at this boundary.
  const runner = signer as unknown as Parameters<typeof IAsset__factory.connect>[1];
  return {
    asset: IAsset__factory.connect(diamond, runner),
    kyc: IKyc__factory.connect(diamond, runner),
    freeze: IFreeze__factory.connect(diamond, runner),
    pause: IPause__factory.connect(diamond, runner),
    accessControl: IAccessControl__factory.connect(diamond, runner),
    transfer: ITransfer__factory.connect(diamond, runner),
    controlList: IControlList__factory.connect(diamond, runner),
  };
}

/**
 * Explicit gas limit for every write call in this fixture. Without it, ethers pre-flights a
 * transaction with `eth_estimateGas` and throws client-side on a would-be revert *without ever
 * broadcasting it* -- meaning no transaction id/receipt would exist for the chain-assertion
 * engine to independently verify. A mustRevert assertion needs the revert to actually happen
 * on-chain, not just be predicted locally.
 *
 * 700,000, not 1,000,000: the Hedera JSON-RPC relay's "insufficient funds for intrinsic
 * transaction cost" check reserves `gasLimit * gasPrice` up front, regardless of gas actually
 * used -- confirmed against a real transfer's Mirror Node receipt (`gas_used: 438652` against
 * the relay's observed ~2340 gwei gas price), a 1,000,000 limit demanded ~2.34 HBAR just to
 * *attempt* a call, well above what any of this fixture's actions actually spend. A signer
 * whose balance had drifted below that reservation threshold (but was still well above what a
 * transfer actually costs) failed with INSUFFICIENT_FUNDS on every subsequent run -- confirmed
 * live. 700,000 keeps ~60% headroom over the highest real usage measured while roughly halving
 * the effective minimum balance every actor needs to carry.
 */
export const TX_OVERRIDES = { gasLimit: 700_000 };

/**
 * Sends a contract write and reports its outcome the way the chain-assertion engine needs:
 * print "submitted <hash>" and exit 0 whenever a real transaction hash exists to check on
 * Mirror Node -- whether it succeeded OR reverted. `tx.wait()` throws on a mined-but-reverted
 * transaction (ethers' CALL_EXCEPTION), which would otherwise crash this script with a
 * non-zero exit -- and the engine correctly treats *that* as "couldn't obtain evidence," never
 * even checking the real on-chain result. The action script's job is only to report what
 * happened, never to decide pass/fail; that determination belongs entirely to the engine's
 * independent Mirror Node check. Only a genuine failure to submit at all (bad nonce, no funds,
 * network down -- no transaction hash exists anywhere) exits non-zero here.
 */
export async function sendAndReport(txPromise: Promise<{ hash: string; wait: () => Promise<unknown> }>): Promise<void> {
  const tx = await txPromise;
  try {
    await tx.wait();
  } catch (error) {
    const hash = (error as { receipt?: { hash?: string }; transaction?: { hash?: string } })?.receipt?.hash
      ?? (error as { transaction?: { hash?: string } })?.transaction?.hash
      ?? tx.hash;
    if (!hash) throw error; // no transaction hash anywhere -- a genuine submission failure.
    console.log(`submitted ${hash}`);
    return;
  }
  console.log(`submitted ${tx.hash}`);
}

export { requireEnv, getSigner };
export { ethers };
