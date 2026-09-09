import { ethers } from "ethers";
import { connectAsset, requireEnv, sendAndReport, getSigner, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const signer = getSigner();

const { kyc } = connectAsset(signer);
const now = Math.floor(Date.now() / 1000);
const tenYears = now + 10 * 365 * 24 * 60 * 60;

await sendAndReport(
  kyc.grantKyc(targetAddress, "policyprobe-demo-kyc", now, tenYears, ethers.ZeroAddress, TX_OVERRIDES),
);
