import { connectAsset, requireEnv, sendAndReport, TX_OVERRIDES } from "../asset.js";
import { ROLES } from "../constants.js";

const roleName = requireEnv("ROLE_NAME") as keyof typeof ROLES;
const targetAddress = requireEnv("TARGET_ADDRESS");

const role = ROLES[roleName];
if (!role) {
  throw new Error(`Unknown ROLE_NAME "${roleName}". Known roles: ${Object.keys(ROLES).join(", ")}`);
}

const { accessControl } = connectAsset();
await sendAndReport(accessControl.grantRole(role, targetAddress, TX_OVERRIDES));
