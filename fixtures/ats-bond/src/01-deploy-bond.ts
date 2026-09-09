import { deployBond } from "./deployBond.js";
import { getSigner } from "./signers.js";

const signer = getSigner();
console.log(`deploying as ${await signer.getAddress()}`);

const result = await deployBond({
  signer,
  name: "Atlas Infrastructure Note 2027",
  symbol: "AINX27",
  isin: "USPLCYPROB37",
  maxSupply: 1_000_000,
  currency: "0x555344", // USD
  nominalValue: 1000,
  maturityYears: 1,
  isWhiteList: false,
});

console.log(`submitted ${result.transactionId}`);
console.log(`diamond ${result.diamondEvmAddress}`);
