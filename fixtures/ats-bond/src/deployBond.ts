/**
 * Adapted from hashgraph/asset-tokenization-studio
 * (packages/ats/contracts/scripts/domain/factory/deployBondToken.ts), commit pinned in
 * docs/RESEARCH_SOURCES.md. SPDX-License-Identifier: Apache-2.0.
 *
 * Ported (not imported) because `scripts/domain` is not part of the published
 * @hashgraph/asset-tokenization-contracts package -- only contracts/artifacts/typechain-types
 * are. Adapted to take a plain ethers.Signer (this fixture's headless model) instead of a
 * hardhat fixture-injected factory contract instance.
 */
import { ethers, type EventLog } from "ethers";
import {
  IFactory__factory,
  ResolverProxy__factory,
  type IFactory,
  type ResolverProxy,
} from "@hashgraph/asset-tokenization-contracts";
import { ATS_TESTNET, BOND_CONFIG_ID, ROLES } from "./constants.js";

export interface DeployBondParams {
  signer: ethers.Signer;
  name: string;
  symbol: string;
  isin: string;
  maxSupply: number;
  currency: string;
  nominalValue: number;
  maturityYears: number;
  /** Whitelist-based control list gating ("investor must be verified to hold this asset"). */
  isWhiteList: boolean;
}

export interface DeployedBond {
  diamondEvmAddress: string;
  transactionId: string;
  bond: ResolverProxy;
}

/** Deploys a bond via the existing ATS testnet factory. Returns the new diamond's address. */
export async function deployBond(params: DeployBondParams): Promise<DeployedBond> {
  const factory: IFactory = IFactory__factory.connect(ATS_TESTNET.factory.evmAddress, params.signer);
  const deployerAddress = await params.signer.getAddress();

  const now = Math.floor(Date.now() / 1000);
  const maturityDate = now + params.maturityYears * 365 * 24 * 60 * 60;

  const rbacs: IFactory.RbacStruct[] = [{ role: ROLES.DEFAULT_ADMIN_ROLE, members: [deployerAddress] }];

  const securityData: IFactory.SecurityDataStruct = {
    resolver: ATS_TESTNET.businessLogicResolver.evmAddress,
    maxSupply: params.maxSupply,
    resolverProxyConfiguration: { key: BOND_CONFIG_ID, version: 1 },
    erc20MetadataInfo: { name: params.name, symbol: params.symbol, isin: params.isin, decimals: 0 },
    rbacs,
    externalPauses: [],
    externalControlLists: [],
    externalKycLists: [],
    compliance: ethers.ZeroAddress,
    identityRegistry: ethers.ZeroAddress,
    arePartitionsProtected: false,
    isMultiPartition: false,
    isControllable: true,
    // Whitelist-based control list -- gates "must be a verified investor to hold this asset"
    // without ATS's separate verifiable-credential-issuer subsystem (internal KYC), which
    // models a heavier real-world compliance workflow this demo fixture doesn't need.
    isWhiteList: params.isWhiteList,
    clearingActive: false,
    internalKycActivated: false,
    erc20VotesActivated: false,
  };

  const bondDetails: IFactory.BondDetailsDataStruct = {
    currency: params.currency,
    nominalValue: params.nominalValue,
    nominalValueDecimals: 0,
    startingDate: now,
    maturityDate,
  };

  const bondData: IFactory.BondDataStruct = {
    security: securityData,
    bondDetails,
    proceedRecipients: [],
    proceedRecipientsData: [],
  };

  const factoryRegulationData = {
    regulationType: 1, // REG_S
    regulationSubType: 0, // NONE (required pairing for REG_S)
    additionalSecurityData: {
      countriesControlListType: true,
      listOfCountries: "",
      info: "PolicyProbe demonstration fixture -- technical behavioral conformance testing only, not a real securities offering.",
    },
  };

  const tx = await factory.deployBond(bondData, factoryRegulationData, { gasLimit: 15_000_000 });
  const receipt = await tx.wait();
  if (!receipt) throw new Error("deployBond transaction produced no receipt.");

  const event = receipt.logs.find(
    log => "eventName" in log && (log as EventLog).eventName === "BondDeployed",
  ) as EventLog | undefined;
  if (!event || !event.args) {
    throw new Error(
      `BondDeployed event not found. Logs seen: ${JSON.stringify(
        receipt.logs.filter(log => "eventName" in log).map(log => (log as EventLog).eventName),
      )}`,
    );
  }

  const diamondEvmAddress: string = event.args.bondAddress ?? event.args[1];
  if (!diamondEvmAddress || diamondEvmAddress === ethers.ZeroAddress) {
    throw new Error(`Invalid diamond address from BondDeployed event args: ${JSON.stringify(event.args)}`);
  }

  return {
    diamondEvmAddress,
    transactionId: tx.hash,
    bond: ResolverProxy__factory.connect(diamondEvmAddress, params.signer),
  };
}
