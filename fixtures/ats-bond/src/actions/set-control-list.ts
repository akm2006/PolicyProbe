import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const add = requireEnv("ADD") === "true"; // true = whitelist (allow), false = remove
const { controlList } = connectAsset();
await sendAndReport(
  add
    ? controlList.addToControlList(targetAddress, TX_OVERRIDES)
    : controlList.removeFromControlList(targetAddress, TX_OVERRIDES),
);
