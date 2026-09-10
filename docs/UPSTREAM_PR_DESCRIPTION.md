# PR: feat(chain): deterministic on-chain behavioral postcondition assertions

**Target branch:** `dev`  
**Base commit:** `587a2f335c29835e9505d9f13e230b8d677c0674`  
**Working branch:** `policyprobe/deterministic-onchain-postconditions`  

---

## What this adds

This PR introduces **deterministic on-chain behavioral postcondition assertions** to Hedera Harness's `CHAIN` validation stage.

Recipe authors can now declare postconditions over on-chain operations—specifying whether an action must succeed or revert, asserting exact balance/state deltas, and enforcing actor-authorization boundaries across multiple ephemeral signer identities—all evaluated directly in code via Mirror Node records rather than delegated to an LLM evaluator.

Failed assertions are emitted as structured, typed `ValidationFinding`s (`category: "chain-assertion"`), feeding seamlessly into Harness's existing autonomous repair loop.

---

## Problem & Motivation

In current `dev`, Harness can provision a funded testnet signer (`chainSigner`) and execute deploy commands during SMOKE/CHAIN stages. However:
1. **Exit code 0 is treated as success:** If a deploy command exits 0, Harness assumes all went well, even if the underlying contract call secretly failed or violated application rules.
2. **Behavioral policy checking relies on probabilistic LLMs:** Verifying that an unauthorized actor was blocked, that a freeze/pause rule was respected, or that a balance moved by an exact amount is judged, if at all, only by an LLM in the `EVALUATE` stage reading a prompt checklist (`category: "eval"`). LLM evaluation is non-deterministic and carries no cryptographic chain receipt.
3. **Single identity:** The ephemeral signer is a single account. Testing authorization boundaries (e.g., "Alice can transfer, but Bob is unauthorized and must be rejected") requires distinct identities that can be isolated and swept back cleanly.

---

## Changes by Component

### 1. Recipe Schema (`src/types.ts`, `src/specLoader.ts`)
- Added `chainValidation.actors`: Map of named additional ephemeral accounts to provision on-chain.
- Added `chainValidation.assertions`: Array of declarative postcondition assertions:
  ```yaml
  chainValidation:
    enabled: true
    network: testnet
    actors:
      attacker: { fundingHbar: 5 }
    assertions:
      - id: reject-unauthorized-transfer
        description: "Unverified sender must not transfer restricted asset"
        actor: attacker
        action:
          name: attempt-transfer
          command: "npx tsx scripts/transfer.ts"
          timeoutMs: 30000
        expect:
          outcome: mustRevert
          reasonContains: "Unauthorized"
  ```
- Extended `ValidationFindingCategory` to include `chain-assertion` (policy violation) and `chain-assertion-infra` (RPC/network failure).

### 2. Ephemeral Multi-Actor Provisioning (`src/validation/chainSigner.ts`, `src/attemptStages.ts`)
- Named actors defined in `chainValidation.actors` are provisioned alongside the primary signer with their own funded ECDSA keypairs and aliases.
- Swept back cleanly at the end of the attempt, preserving operator funds.

### 3. Mirror Node Evidence Reader (`src/validation/chainAssertionEvidence.ts`)
- Queries Mirror Node REST API with robust backoff and propagation-lag handling:
  - `fetchTransactionResult`: Hedera SDK transaction IDs (`0.0.x@seconds.nanos`).
  - `fetchContractCallResult`: EVM transaction hashes (`0x...`), with standard `Error(string)` revert reason decoding (`revertReason`).
  - `fetchHbarBalanceTinybars`: Exact HBAR balance sampling.
  - `fetchTokenBalance`: Native HTS token balance with retry handling for unindexed associations.
  - `fetchContractTokenBalance`: ERC20 `balanceOf(holder)` contract call simulation.
- Strict trichotomy: `found`, `not-found`, or `infra-error`.

### 4. Assertion Execution & Finding Construction (`src/validation/chainAssertions.ts`)
- Runs after `runChainDeploy` before dev server spin-up.
- Injects actor-specific environment variables (`HARNESS_SIGNER_PRIVATE_KEY`, `HARNESS_SIGNER_ACCOUNT_ID`, `HARNESS_SIGNER_EVM_ADDRESS`).
- Extracts transaction ID / EVM hash from action output.
- Compares observed Mirror Node state against declared expectation (`mustSucceed`, `mustRevert`, `balanceDelta`).
- Emits structured `ValidationFinding`:
  - Mismatch: `category: "chain-assertion"` with structured `evidence: { transactionId, expected, observed }`.
  - Network timeout / unspawnable command / RPC crash: `category: "chain-assertion-infra"` (does not burn an agent repair attempt on transient infra issues).

### 5. Repair Loop Integration (`src/promptBuilder.ts`, `prompts/repair-runtime.md`)
- `chain-assertion` findings are routed into runtime repair prompts with full on-chain evidence details.
- Keys and sensitive credentials across primary and named actors are redacted at both source and sink (`attemptReporting.ts`).

### 6. Documentation (`docs/authoring-a-recipe.md`)
- Complete reference and working examples for `chainValidation.actors` and `chainValidation.assertions`.

---

## Verification & Test Suite

- **59 new tests** added to the Harness test suite across 5 test files:
  - `test/chain-assertions-schema.test.mjs` (13 tests): parsing, schema validation, error boundaries.
  - `test/chain-assertion-evidence.test.mjs` (36 tests): polling logic, 404 recovery, 500 error classification, EVM revert decoding, HBAR and token balance reads.
  - `test/chain-assertions-runner.test.mjs` (24 tests): end-to-end execution, balance deltas, actor resolution.
  - `test/chain-actor-provisioning.test.mjs` (4 tests): multi-actor setup and sweep.
  - `test/policyprobe-postcondition-gap.test.mjs` (2 tests): characterization of the unasserted deploy gap.
  - `test/attempt-reporting-redaction.test.mjs` (3 tests): multi-actor key redaction.
- **Zero test regressions:** Full suite passes cleanly.
- **Live testnet verification:** Tested with real testnet transactions and deployed contracts (including Hedera's Asset Tokenization Studio diamond contracts).

---

## Maintainer Considerations

- **Zero branding:** Code and prompts use purely generic terms ("deterministic on-chain postconditions", "chain assertions").
- **Backward compatible:** Existing recipes without `assertions` or `actors` behave identically to current `dev`.
- **No new external production dependencies:** Uses existing `@hiero-ledger/sdk` and `ethers` peer dependencies.
