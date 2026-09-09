import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const amount = requireEnv("AMOUNT");

const { transfer } = connectAsset();
await sendAndReport(transfer.transfer(targetAddress, amount, TX_OVERRIDES));
