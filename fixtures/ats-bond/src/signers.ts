import { ethers } from "ethers";
import { ATS_TESTNET } from "./constants.js";

/**
 * Shared JSON-RPC provider for the fixture -- one per process, reused by every script.
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(ATS_TESTNET.jsonRpcRelay);
}

/**
 * Builds a signer from the env vars Harness's chainValidation injects for whichever signer is
 * executing this action -- HARNESS_SIGNER_PRIVATE_KEY for the primary/actor signer. Falls back
 * to HEDERA_OPERATOR_KEY so scripts are also runnable standalone against the real operator
 * account (outside a Harness run) for local development/testing.
 */
export function getSigner(): ethers.Wallet {
  const rawKey = process.env.HARNESS_SIGNER_PRIVATE_KEY ?? process.env.HEDERA_OPERATOR_KEY;
  if (!rawKey) {
    throw new Error(
      "Neither HARNESS_SIGNER_PRIVATE_KEY nor HEDERA_OPERATOR_KEY is set -- this script needs a " +
        "private key to sign with.",
    );
  }
  const key = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  return new ethers.Wallet(key, getProvider());
}

/** Reads a required env var, throwing a clear error naming which one is missing. */
export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set.`);
  }
  return value;
}
