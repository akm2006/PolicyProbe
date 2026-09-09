import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";

const paused = requireEnv("PAUSED") === "true";

const { pause } = connectAsset();
await sendAndReport(paused ? pause.pause(TX_OVERRIDES) : pause.unpause(TX_OVERRIDES));
