---
name: policyprobe-harness
description: Use when modifying or analyzing Hedera Harness source (../hedera-harness) — implementing the deterministic on-chain postcondition mechanism, touching validation stages, findings, or the repair loop.
---

# PolicyProbe: Harness work

1. Read the pinned upstream source at the current base SHA (`docs/HARNESS_ARCHITECTURE.md`
   names it) before writing anything — don't assume the winning-package doc's shape is current.
2. Read the nearest existing tests for the file you're touching first; match their style
   (`node:test` + `node:assert`, no external framework).
3. Preserve existing architecture style: stage pipeline in `attemptStages.ts`, deterministic
   validators as `validate*` functions in `src/validation/index.ts`, findings as
   `ValidationFinding` with a stable `id`, category-based branching in `promptBuilder.ts`.
4. Re-check `docs/COMPETITOR_AUDIT.md` is fresh (re-run `gh pr list --repo
   hedera-dev/hedera-harness --state open`) before starting — this repo moves fast during the
   event. Stop and update the audit if a new PR looks like it duplicates the work.
5. Make behavior deterministic where practical. Do not replace or route around the existing
   EVALUATE/semantic validator unless there's a real reason — it stays for what it's good at.
6. Every finding category you add needs an `*-infra` sibling (mirror `eval`/`eval-infra`) so
   network/infra flakiness never becomes a false app-policy finding.
7. Keep the diff minimal and upstreamable: no PolicyProbe branding inside `src/`/`prompts/`,
   no unrelated refactors, no new dependencies without a stated reason.
8. Tests + docs are required with the change, not deferred. Run the **full** suite (`npm test`
   in `../hedera-harness`), not just new tests, before calling anything done.
9. Preserve backward compatibility unless you have evidence (a failing test, a maintainer
   comment) that justifies a breaking change — log that evidence in `docs/DECISIONS.md`.
