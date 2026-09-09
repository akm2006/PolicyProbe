import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const amount = requireEnv("AMOUNT");

const { asset } = connectAsset();
await sendAndReport(asset.issue(targetAddress, amount, "0x", TX_OVERRIDES));
