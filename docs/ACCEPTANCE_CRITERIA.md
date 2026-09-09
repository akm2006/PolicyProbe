# Acceptance Criteria

Objective, checkable requirements per deliverable. A milestone is not "done" until its row is
checkable true.

## Core assertion framework

- [x] Recipe schema documented in `docs/authoring-a-recipe.md`-equivalent, with a worked
      example, in the Harness fork.
- [x] At least the 3 MVP primitives implemented: transaction outcome, balance/state delta,
      actor-authorization boundary (as a composition of the first two).
- [x] Every assertion produces a stable `id` deterministic across repair attempts (see
      `docs/HARNESS_ARCHITECTURE.md` repair-loop section).
- [x] Infra failure (mirror lag, RPC timeout, signer provisioning error, action-command
      failure) is never reported as a policy violation — has its own `*-infra` category,
      filtered from the repair prompt like `eval-infra`.

## Transaction outcome assertion

- [x] `mustSucceed` and `mustRevert` both implemented and unit-tested.
- [x] A revert is distinguished from an infra/RPC failure (different category/finding).
- [x] False positive test: an unrelated transient network error (Mirror Node infra-error,
      not-found, or the action command itself failing) must NOT produce a `mustRevert` pass or
      a `mustSucceed` fail — produces `chain-assertion-infra` instead, tested explicitly.
- [x] False negative test: a genuinely wrong outcome is always caught, deterministically
      (injectable evidence deps in unit tests; confirmed non-flaky against real testnet in the
      live end-to-end test too).

## State/balance postcondition

- [x] Before/after balance sampled deterministically via Mirror Node (no LLM involved).
- [x] Delta direction and unit/decimals correctness covered by unit tests with known-bad cases
      (wrong delta, unset `accountEnv`, non-integer `equals` rejected at load).
- [x] Duplicate/retried transaction events do not double-count a delta — by construction: the
      design samples absolute balance before/after rather than summing individual transfer
      events, so there is nothing to double-count.

## Authorization assertion

- [x] At least two distinct signer identities exercised in one assertion set (authorized vs.
      unauthorized actor) — `chainValidation.actors` + per-assertion `actor`, tested.
- [x] Unauthorized actor's attempt is asserted to fail via the transaction-outcome primitive
      (`mustRevert`), not a bespoke code path — actor resolution is just signer selection
      feeding the same `mustSucceed`/`mustRevert` evaluation.

## HTS/ATS compliance assertion

- [x] Freeze and pause implemented as thin adapters over the general primitives (the assertion
      schema/engine needed zero new core logic — `action` + `expect: mustRevert/mustSucceed`
      already covers them; whitelist/control-list likewise). Internal KYC (verifiable-credential
      style) explicitly out of scope — see `docs/DECISIONS.md` ADR-0008.
- [x] Demonstrated against the real ATS bond fixture on testnet, not a mock —
      `fixtures/ats-bond/EVIDENCE.md`, 6/6 real assertions pass with real transaction evidence.

## Repair finding integration

- [x] A deliberately broken policy produces a real FAIL with real testnet evidence (tx id) —
      `fixtures/ats-bond/run-killer-demo.mjs`: a bond deployed with compliance gating left off,
      an unverified investor's transfer genuinely succeeds on-chain, the assertion catches it
      with the real violating transaction hash as evidence.
- [x] That finding enters the existing repair prompt path unmodified in shape from the agent's
      point of view — `classifyRepairScope`/`formatFindingsList` handle it generically, no
      PolicyProbe-specific prompt fork; repair templates name the category explicitly.
- [x] The exact same assertion id (`reject-unverified-transfer`), run against the corrected
      configuration, PASSes — `fixtures/ats-bond/EVIDENCE.md` "Killer demo" section. This
      demonstrates the id-stability contract the repair loop depends on
      (`findingsLifecycle.ts` diffs by id) using two real deployments rather than a literal
      Harness repair-attempt rerun on one workspace — see `docs/EXECUTION_PLAN.md` for why a
      literal agent-driven repair pass on this fixture is optional stretch, not required: the
      mechanism the repair loop depends on (stable id, deterministic re-evaluation) is what
      needed proving, not the coding-agent's ability to fix a smart-contract config, which is
      outside PolicyProbe's own scope.

## Real testnet proof

- [ ] All demo transactions are real Hedera testnet transactions with recorded transaction IDs.
- [ ] No simulated/mocked result is ever presented as testnet evidence anywhere in demo
      artifacts, docs, or the judge console (`policyprobe-submission` / `demo-auditor` enforce
      this).

## ATS fixture

- [x] Bond issued on testnet via ATS (through the existing factory, `fixtures/ats-bond/`),
      at least one lifecycle operation performed for real (issue, transfer, freeze, pause —
      all real transactions).
- [x] Freeze/pause/whitelist exercised for real, not just documented — `EVIDENCE.md` lists
      every transaction hash. (Internal KYC deliberately out of scope, ADR-0008.)
- [ ] HashScan links formatted into the judge-facing proof page (Phase 14, not built yet) —
      raw transaction hashes already recorded in `fixtures/ats-bond/EVIDENCE.md` and resolve
      directly at `https://hashscan.io/testnet/transaction/<hash>`.

## Upstream PR

- [ ] Rebased cleanly on current `dev` at time of opening.
- [ ] `npm test` passes in full (not just new tests) before and after.
- [ ] No PolicyProbe branding inside generic `src/`/`prompts/` files.
- [ ] PR description states the maintainer-facing problem, not the hackathon pitch.
- [ ] Example recipe included.

## Demo

- [ ] Real broken-policy scenario, real repair, real rerun, all real testnet.
- [ ] Video 2–4 min (Harness track) / ≤5 min (ATS track), ≥720p, human voice, no speed-up.

## Docs

- [ ] `docs/STATUS.md` current as of the last meaningful commit in both repos.
- [ ] `docs/AI_USAGE.md` written before submission with honest, specific disclosure.
- [ ] No document anywhere claims legal/regulatory compliance.
