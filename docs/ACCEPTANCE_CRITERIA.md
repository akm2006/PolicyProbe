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

- [ ] At least one of KYC/freeze/pause implemented as a thin adapter over the general
      primitives (not new core logic).
- [ ] Demonstrated against the real ATS bond fixture on testnet, not a mock.

## Repair finding integration

- [x] Mechanism proven: a mismatched outcome produces a real `ValidationFinding` with real
      testnet evidence (tx id, expected, observed) — confirmed by the live end-to-end test and
      unit tests. Not yet demonstrated as a full **deliberately-broken-app** scenario against a
      real deployed application — that's the Phase 6 killer-demo milestone, still pending.
- [x] That finding enters the existing repair prompt path unmodified in shape from the agent's
      point of view — `classifyRepairScope`/`formatFindingsList` handle it generically, no
      PolicyProbe-specific prompt fork; repair templates name the category explicitly.
- [ ] After a real code fix, the exact same assertion reruns and passes — finding id resolves to
      `status: "fixed"`, not a new unrelated finding. Mechanism exists (`findingsLifecycle.ts`
      diffs by stable `id`, unchanged by this work) but not yet demonstrated end-to-end with a
      real broken→fixed application (Phase 6).

## Real testnet proof

- [ ] All demo transactions are real Hedera testnet transactions with recorded transaction IDs.
- [ ] No simulated/mocked result is ever presented as testnet evidence anywhere in demo
      artifacts, docs, or the judge console (`policyprobe-submission` / `demo-auditor` enforce
      this).

## ATS fixture

- [ ] Bond issued on testnet via ATS, at least one lifecycle operation performed for real.
- [ ] KYC/freeze/pause exercised for real (not just documented as theoretically supported).
- [ ] HashScan links recorded for the key transactions in `docs/STATUS.md` / the proof page.

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
