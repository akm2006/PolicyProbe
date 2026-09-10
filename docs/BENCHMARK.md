# Before/After Benchmark

Real, measured numbers from this repository's own history — nothing here is a projected or
hypothetical figure. Where a metric would require an experiment not yet run, it's marked as
such rather than estimated. See `docs/PROJECT_CHARTER.md` for the thesis this is measuring.

## 1. What existed before, measured against `dev` @ `587a2f335c29835e9505d9f13e230b8d677c0674`

Confirmed by reading source directly (`docs/HARNESS_ARCHITECTURE.md`), not by assumption:

- **Zero lines of deterministic on-chain postcondition code existed.** `ValidationFinding.category`
  had no slot for "an executed action's outcome vs. a declared expectation." The only path that
  touched real chain state after a transaction was EVALUATE — an LLM reading a checklist,
  probabilistic by construction, not reproducible run-to-run in the way a `mustRevert`/`mustSucceed`
  comparison against a Mirror Node record is.
- A recipe author wanting "unverified investor must not receive this asset" checked
  deterministically had exactly two options: (a) ask the EVALUATE agent to judge it from the UI
  (no guaranteed determinism, no independent chain evidence attached to the verdict), or (b) fork
  Harness itself and add the capability from scratch — which is what this project did.

## 2. What the new capability costs, once (written to the shared engine, not per-recipe)

Measured via `git diff dev --stat` on the Harness fork's working branch:

| | Lines |
|---|---|
| Core engine (`chainAssertionEvidence.ts` + `chainAssertions.ts`) | 522 |
| Schema/wiring touch points (`types.ts`, `specLoader.ts`, `attemptStages.ts`, `promptBuilder.ts`, `chainSigner.ts`) | 332 |
| **Total implementation** | **854** |
| Tests (5 new/changed test files) | 1,107 |
| **Total diff vs. `dev`** (18 files) | **2,163 insertions, 22 deletions** |

Test code outweighs implementation code roughly **1.3:1** — a deliberate ratio, not a side
effect: every new code path (found/not-found/infra-error × 2 evidence sources, actor
resolution, exit-code/timeout classification, balance-delta direction) has a dedicated negative
test, per `docs/OPERATING_CONTRACT.md`'s testing discipline.

**59 new tests**, full suite **195 → 254**, all passing with real testnet credentials.

## 3. What one recipe author now pays, per assertion

From the real ATS fixture (`fixtures/ats-bond/run-policy-suite.mjs`), one complete assertion:

```js
{
  id: "reject-unverified-transfer",
  description: "Unverified investor must not receive the bond",
  actor: "alice",
  action: { name: "attempt-transfer-to-attacker", command: "..." },
  expect: { outcome: "mustRevert" },
}
```

**~6 lines of declarative configuration** per policy, reusing a shared engine — no HTTP polling,
no Mirror Node response parsing, no evidence classification, no finding construction. The
`action.command` line is the one piece every approach needs regardless (something has to
perform the real on-chain action); the verification logic above it — the part that used to not
exist at all — is the `expect: {...}` line and the wiring that reads it.

## 4. Assertion primitives available (before: 0; after: 3 composable families)

1. Transaction outcome (`mustSucceed` / `mustRevert`, with optional `reasonContains` narrowing).
2. State/balance delta (HBAR or HTS token, exact signed integer, before/after sampled via
   independent Mirror Node reads).
3. Actor-authorization boundary — not a fourth primitive, a composition of (1) over distinct
   named signers (`chainValidation.actors`).

Demonstrated exercising all three against the real ATS bond: 6 assertions, 6 distinct policies,
zero bespoke per-policy code beyond the declaration shown in §3 — see
`fixtures/ats-bond/EVIDENCE.md`.

## 5. False PASS / false FAIL rate in controlled scenarios

Every found/not-found/infra-error branch of the evidence reader, and every
misclassification-risk path the independent review surfaced (action exit code, EVM vs. native
transaction id, balance-delta config errors), has a dedicated test asserting the *correct*
category — see `docs/DECISIONS.md` ADR-0007 for the specific defect class (infra misclassified
as violation) this discipline caught and fixed **before** it could produce a wrong verdict in
the wild. Measured result: **0 false positives, 0 false negatives** across 59 new tests, 0
flaky failures across every full-suite run this session (multiple runs, `npm test`, both with
and without live credentials).

## 6. Time to catch an intentionally injected defect (the killer demo)

- Defect: a bond deployed with compliance gating left off (`isWhiteList: false`) — a realistic
  issuer misconfiguration, not a contrived bug.
- Detection: **one assertion run**, one real testnet transaction, real Mirror Node confirmation
  — caught with the exact violating transaction hash as evidence
  (`0x829ffc215b7fb043912de052c0bb43da9a2152df6797a075fdeb9254a3c4adc7`, `SUCCESS` when policy
  required a revert). Wall-clock: single-digit seconds of consensus/mirror latency, not a
  multi-minute EVALUATE agent session.
- Same assertion id, corrected configuration, rerun: **PASS**, `0/1` finding.

**Not yet run, marked honestly as a gap rather than assumed:** a controlled comparison of
whether the *existing* EVALUATE semantic validator, pointed at the same broken bond and asked
to check compliance rules generally, would catch this defect at all, and how reliably across
repeated runs. This is the single most informative experiment left for the benchmark and is
next on the list precisely because a plausible-sounding claim without it would violate this
project's own "no fabricated evidence" rule.

## Method notes

- All line counts from `wc -l` and `git diff --stat` on real files, reproduced in
  `docs/STATUS.md`'s session history.
- No workload was shaped to flatter these numbers — the assertion count, test count, and diff
  size are simply what the finished feature and its tests are.
