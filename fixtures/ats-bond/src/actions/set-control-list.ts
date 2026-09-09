import { IControlList__factory } from "@hashgraph/asset-tokenization-contracts";
import { requireEnv, sendAndReport, getSigner, TX_OVERRIDES } from "../asset.js";

const targetAddress = requireEnv("TARGET_ADDRESS");
const add = requireEnv("ADD") === "true"; // true = whitelist (allow), false = remove
const diamond = requireEnv("BOND_DIAMOND_ADDRESS");

const controlList = IControlList__factory.connect(diamond, getSigner());
await sendAndReport(
  add
    ? controlList.addToControlList(targetAddress, TX_OVERRIDES)
    : controlList.removeFromControlList(targetAddress, TX_OVERRIDES),
);
