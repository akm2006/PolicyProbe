/**
 * Adapted from hashgraph/asset-tokenization-studio
 * (packages/ats/contracts/scripts/domain/constants.ts and atsRoles.generated.ts),
 * release v.8.0.0-ats at be4f860e408ec5b1a24d12feb6f872aabff69319.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * Only the subset this fixture actually uses is ported here, not the full registry --
 * see policy-probe/docs/DECISIONS.md for why (avoid vendoring the whole monorepo for a
 * handful of constants).
 */

/** BusinessLogicResolver config key for the (variable-rate) Bond facet set. bytes32(uint256(2)). */
export const BOND_CONFIG_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000002";

/** Role hashes, from atsRoles.generated.ts -- keccak256("<ROLE_NAME>") per the ATS AccessControl facet. */
export const ROLES = {
  DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000",
  ROLE_AGENT: "0x9830aa071a741c08855dd42130bdb0ff50f7bdf5a4b72f12181eefded0c6542b",
  ROLE_ISSUER: "0x5eeaf5602c75bf26e73b5206d0bd6ee82f621166255e5fd73cc06bc7bd84a95f",
  ROLE_KYC: "0x754f499f9fdfbb089d12bdec817a6863d593d8a3ea7f546c00a5cafd20957bfc",
  ROLE_KYC_MANAGER: "0xec811504e835acf29535b5b62307b08000468f0c61ca6163ed6f17a03629b91e",
  ROLE_CONTROL_LIST: "0x6ed9a91e996c6475ecdc28ecbdbe9bd1122fc62b30cdbe6da8271884b51ec74d",
  ROLE_CONTROL_LIST_MANAGER: "0xccf29bda8369877bcc921e38f30df86156a571ca5c5b8e777bf7ff75270313ea",
  ROLE_FREEZE_MANAGER: "0x71ae38482e1ab1c28e767d64766d686215b490c8c1bd7dfe6b101525187c2155",
  ROLE_PAUSER: "0x3cb8b459fdb6e7dc3d2a2aa529e530f885d45e03584adb438423209c86a2731f",
  ROLE_PAUSE_MANAGER: "0x03e7c996eea5565d823330975718325a2eccfaf55d5ec99de9a1d9d7253c318e",
  ROLE_CORPORATE_ACTION: "0xa1acfc499025c99f55059195e6276f639d34a18aad7b8121b9192b7f438c55cd",
} as const;

/** Matches contracts/layer_3/constants/regulation.sol. */
export enum RegulationType {
  NONE = 0,
  REG_S = 1,
  REG_D = 2,
}

export enum RegulationSubType {
  NONE = 0,
  REG_D_506_B = 1,
  REG_D_506_C = 2,
}

/** ASCII-encoded ISO 4217 currency codes, as bytes3. */
export const CURRENCIES = {
  USD: "0x555344",
} as const;

/**
 * Existing Hedera testnet deployment from the upstream repo
 * (packages/ats/contracts/deployments/hedera-testnet/newBlr-2026-06-12T11-19-42-198.json),
 * pinned to match the @hashgraph/asset-tokenization-contracts@8.0.0 facet ABIs this fixture
 * depends on. Reused rather than deploying our own BLR/factory system -- issuing our own bond
 * *through* this factory is the intended way to use ATS; redeploying the whole diamond system
 * is not expected of every integrator. See docs/DECISIONS.md.
 */
export const ATS_TESTNET = {
  network: "hedera-testnet",
  jsonRpcRelay: "https://testnet.hashio.io/api",
  mirrorNode: "https://testnet.mirrornode.hedera.com/api/v1",
  businessLogicResolver: {
    evmAddress: "0xBA2D5FC2083A0b8f164c50e65d782087fBA18E0a",
    contractId: "0.0.9212226",
  },
  factory: {
    evmAddress: "0xd1F118A40f3b02883D35909eF2517e7EDd78379d",
    contractId: "0.0.9213391",
  },
} as const;
