import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const frozen = requireEnv("FROZEN") === "true";

const { freeze } = connectAsset();
await sendAndReport(freeze.setAddressFrozen(targetAddress, frozen, TX_OVERRIDES));
