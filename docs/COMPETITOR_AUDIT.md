# Competitor / Collision Audit

**Last checked: 2026-09-08**, against `hedera-dev/hedera-harness` open PRs/issues (all states
current at check time — re-run `gh pr list --repo hedera-dev/hedera-harness --state open` and
`gh issue list --repo hedera-dev/hedera-harness --state open` before every Harness milestone;
this repo moves multiple PRs/day during the event).

## Open PRs at check time

| # | Title | Touches | Overlap w/ PolicyProbe |
|---|---|---|---|
| 46 | fix: treat timed-out commands as failures even when exitCode is 0 | GENERATE/command exec | None |
| 45 | Tier 0-1 check for unrounded native-value forwards (tinybar precision) | ASSERT, static | None |
| 44 | doctor: verify the x402 facilitator before a run | `doctor` | None |
| **43** | **feat(validation): Tier 2.5 Mirror Node validator** | `src/validation/mirrorNode.ts`, `types.ts` (`category: "mirror-node"`) | **Adjacent.** 5 fixed assertion kinds — `contract-exists`, `token-exists`, `account-exists`, `topic-exists`, `recent-contract-call`. Read-only, no signer, no action execution, no expected-outcome vs. actual-outcome comparison, no per-actor adversarial identity. Checks *entities exist / have expected static metadata*, not *an executed action produced the policy-correct effect*. |
| 42 | feat: doctor checks the chain operator can fund the run | `doctor` | None |
| **40** | **feat: opt-in contract-security validator in the ASSERT stage** | `src/validation/contractSecurity.ts` (Slither) | **Unrelated surface.** Static Solidity analysis pre-execution; no on-chain behavior involved. |
| **39** | **feat: a mirror node reader for CHAIN, and classify mirror outages as infrastructure** | `src/validation/mirrorNode.ts`, `chainSigner.ts`, `evalInfra.ts`, `runner.ts`, `sessionRunner.ts`, `prompts/validator.md` | **Adjacent, complementary.** Makes the *existing* EVALUATE-stage mirror-node reads (used by the LLM evaluator) reliable — polling for lag, classifying outages as infra not app failures. It is a **reliability primitive we would want to depend on**, not a competing assertion mechanism: it does not add a way to *declare an expected outcome and evaluate it deterministically*. |
| 16 | feat: doctor verifies the chain operator on-chain before a run | `doctor` | None |
| 15 | fix: let the ephemeral chain signer receive HTS tokens and still sweep | `chainSigner.ts` | Low — a signer bugfix we should watch for merge before relying on `chainSigner` for HTS transfers in our fixture. |
| 12 | "Dev" (stale, opened 2026-08-26 against `dev`) | unclear, inactive | Watch, likely stale/abandoned. |

Note: **#39 and #43 both add `src/validation/mirrorNode.ts`** — they will conflict with each
other on merge; that's a maintainer-side scheduling problem, not ours, but it means whichever
lands first changes the exact reliability primitive available to build on. Re-check before
depending on either.

## Open issues at check time

| # | Title | Relevance |
|---|---|---|
| 41 | ASSERT accepts clean-exit timeouts and caches unfinished installs | Unrelated bug (being fixed by PR #46). |
| 8 | Add an optional HOL Guard validator to the deterministic ASSERT stage | Unrelated (governance/HOL-specific). |

## Verdict

**No active PR or issue implements: execute a real on-chain action, then evaluate its outcome
in code against a declared expectation (success/revert/balance-delta/actor-boundary), across
distinct signer identities, feeding a typed finding into the repair loop.** The closest
adjacent work (#39, #43) is read-only entity/metadata verification and mirror-node reliability
plumbing — genuinely useful as a dependency, not a substitute. `docs/HARNESS_ARCHITECTURE.md`
records exactly where the gap sits in the current stage pipeline and finding model.

**Action if this changes:** if a new PR appears that executes an action and asserts its
outcome deterministically with typed findings, stop, re-read it in full, update this file with
the evidence, and reassess scope in `docs/DECISIONS.md` before continuing — don't build the
duplicate.
