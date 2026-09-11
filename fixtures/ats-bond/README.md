# ATS bond fixture

This fixture issues an "Atlas Infrastructure Note 2027" bond through the existing Asset
Tokenization Studio factory on Hedera testnet and evaluates deterministic behavioral assertions
with the sibling Hedera Harness build.

It verifies:

- an unverified recipient cannot receive the bond;
- a verified transfer succeeds;
- an unauthorized actor cannot freeze a holder;
- a frozen holder cannot transfer;
- the authorized compliance actor can pause the asset; and
- transfers revert while the asset is paused.

The [recorded evidence](EVIDENCE.md) includes the deployed contracts, transaction hashes, and
observed outcomes.

## Files

- `src/deployBond.ts` adapts the ATS bond deployment flow with attribution.
- `src/actions/` contains one-purpose transaction commands.
- `02-setup-policy-fixtures.ts` configures actors and policy state idempotently.
- `run-policy-suite.mjs` runs all six assertions.
- `run-before-after-demo.mjs` applies the same assertion to misconfigured and corrected bonds.

Generated `.actors.json` and local environment files are intentionally ignored.

## Requirements

- Node.js 20 or newer
- The sibling `../../../hedera-harness` checkout built from the feature branch
- A funded ECDSA Hedera testnet operator exposed as `HEDERA_OPERATOR_ID` and
  `HEDERA_OPERATOR_KEY`

Never commit or paste operator or actor private keys. Live commands spend testnet HBAR.

## Build and prepare

```bash
cd ../../../hedera-harness
npm ci
npm run build

cd ../Policy-Probe/fixtures/ats-bond
npm ci
npm run build

# Run once to create four local actor accounts.
npx tsx src/setup-actors.ts

# Deploy a whitelist-enabled bond and copy the printed address.
BOND_WHITELIST=true npx tsx src/01-deploy-bond.ts

BOND_DIAMOND_ADDRESS=0x... npx tsx 02-setup-policy-fixtures.ts
```

The fixture scripts read credentials from the current environment. A local environment file is
fine if it remains outside the repository or matches the ignored `.env.*` patterns.

## Run

Set `BOND_DIAMOND_ADDRESS` to the prepared whitelist-enabled bond, then run:

```bash
node run-policy-suite.mjs
```

The recorded comparison uses the two disclosed contract addresses already present in
`run-before-after-demo.mjs`:

```bash
node run-before-after-demo.mjs
```

Testnet state and Mirror Node propagation can change. A fresh deployment is the strongest
reproduction; the committed evidence remains independently inspectable by transaction hash.
