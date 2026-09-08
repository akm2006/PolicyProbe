# Acceptance Criteria

Objective, checkable requirements per deliverable. A milestone is not "done" until its row is
checkable true.

## Core assertion framework

- [ ] Recipe schema documented in `docs/authoring-a-recipe.md`-equivalent, with a worked
      example, in the Harness fork.
- [ ] At least the 3 MVP primitives implemented: transaction outcome, balance/state delta,
      actor-authorization boundary (as a composition of the first two).
- [ ] Every assertion produces a stable `id` deterministic across repair attempts (see
      `docs/HARNESS_ARCHITECTURE.md` repair-loop section).
- [ ] Infra failure (mirror lag, RPC timeout, signer provisioning error) is never reported as a
      policy violation — has its own `*-infra` category, filtered from the repair prompt like
      `eval-infra`.

## Transaction outcome assertion

- [ ] `mustSucceed` and `mustRevert` both implemented and unit-tested.
- [ ] A revert is distinguished from an infra/RPC failure (different category/finding).
- [ ] False positive test: an unrelated transient network error must NOT produce a `mustRevert`
      pass or a `mustSucceed` fail.
- [ ] False negative test: a genuinely wrong outcome must always be caught, no flakiness in CI.

## State/balance postcondition

- [ ] Before/after balance sampled deterministically (no reliance on LLM reading a screenshot).
- [ ] Delta direction and unit/decimals correctness covered by a unit test with a known-bad case.
- [ ] Duplicate/retried transaction events do not double-count a delta.

## Authorization assertion

- [ ] At least two distinct signer identities exercised in one assertion set (authorized vs.
      unauthorized actor).
- [ ] Unauthorized actor's attempt is asserted to fail via the transaction-outcome primitive,
      not a bespoke code path.

## HTS/ATS compliance assertion

- [ ] At least one of KYC/freeze/pause implemented as a thin adapter over the general
      primitives (not new core logic).
- [ ] Demonstrated against the real ATS bond fixture on testnet, not a mock.

## Repair finding integration

- [ ] A deliberately broken policy produces a real FAIL with real testnet evidence (tx id).
- [ ] That finding enters the existing repair prompt path unmodified in shape from the agent's
      point of view (no PolicyProbe-specific prompt fork).
- [ ] After a real code fix, the exact same assertion reruns and passes — finding id resolves to
      `status: "fixed"`, not a new unrelated finding.

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
