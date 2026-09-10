# ATS Bond Fixture

A real bond, "Atlas Infrastructure Note 2027", issued on Hedera testnet through the existing
Asset Tokenization Studio factory (`0.0.9213391`), used to exercise PolicyProbe's deterministic
on-chain assertion engine (from `../../../hedera-harness`) against a contract implementing
ATS's regulated-security token pattern. See [`EVIDENCE.md`](EVIDENCE.md) for every real
transaction hash.

## What this is

- `src/deployBond.ts` — issues a bond via the ATS `Factory.deployBond` call, ported (with
  attribution) from ATS's own `packages/ats/contracts/scripts/domain/factory/deployBondToken.ts`.
- `src/actions/*.ts` — one script per policy-relevant on-chain action (grant a role, whitelist an
  investor, issue tokens, transfer, freeze, pause) — this is exactly the shape a
  `chainValidation.assertions[].action.command` in a real Harness recipe would call.
- `src/asset.ts` — shared facet-connection helper and `sendAndReport`, which makes sure a
  transaction that reverts on-chain still gets reported (not swallowed by ethers throwing on
  `tx.wait()`) so the chain-assertion engine has real evidence to check.
- `02-setup-policy-fixtures.ts` — provisions a freshly-deployed bond into the state the policy
  suite assumes (roles granted, Alice/Bob/Carol whitelisted, Alice/Carol issued tokens, Carol
  frozen). Safe to rerun — see the file's own comment for exactly which steps are genuinely
  idempotent on-chain and which (issuance) isn't.
- `run-policy-suite.mjs` — runs the full policy suite through the real
  `runChainAssertions` export from the Harness fork's build output. **6/6 PASS** against the
  correctly configured bond, confirmed rerunnable (it unpauses the bond as its own last step).
- `run-killer-demo.mjs` — the centerpiece: the *same* assertion id, run first against a
  deliberately misconfigured bond (FAIL, with real evidence) and then against the fixed one
  (PASS).

## Prerequisites

- `../../../hedera-harness` built (`npm run build` there) — this fixture calls its `dist/` output.
- `~/.hedera-testnet.env` sourced (a funded ECDSA Hedera testnet operator).
- `npm install` in this directory.

## Reproducing

```bash
source ~/.hedera-testnet.env

# One-time: create the 4 demo actor accounts (writes .actors.json, gitignored)
npx tsx src/setup-actors.ts

# Deploy a bond (edit isin/isWhiteList in src/01-deploy-bond.ts as needed -- isWhiteList: true
# for the "correctly configured" bond, false to reproduce the killer demo's broken one)
npx tsx src/01-deploy-bond.ts

# Required before run-policy-suite.mjs will pass against a FRESH deployment: grant roles,
# whitelist Alice/Bob/Carol, issue tokens, freeze Carol. Not needed if you're pointing at the
# already-provisioned bonds listed in EVIDENCE.md -- they're already in this state.
BOND_DIAMOND_ADDRESS=<diamond address from the deploy step above> npx tsx 02-setup-policy-fixtures.ts

# Run the full policy suite (edit the BOND constant in run-policy-suite.mjs to point at your
# deployment) -- rerunnable, it unpauses the bond as its own last step
node run-policy-suite.mjs

# The killer demo (edit BROKEN_BOND / FIXED_BOND in run-killer-demo.mjs -- FIXED_BOND needs
# 02-setup-policy-fixtures.ts run against it first; BROKEN_BOND only needs Alice issued tokens,
# since its whole point is that nothing else is checked)
node run-killer-demo.mjs
```

## What this fixture is not

This does not redeploy ATS's core diamond/BLR/factory system — it issues a bond *through* the
existing testnet factory, which is the intended way to use ATS (see `docs/DECISIONS.md`).
It does not implement ATS's internal-KYC / verifiable-credential-issuer subsystem (deep enough
to be its own project) — it uses the whitelist/control-list compliance mechanism instead, which
demonstrates the identical policy shape ("must be a verified investor to hold this asset").

Nothing here claims legal or regulatory compliance — this verifies **technical behavior** only.
