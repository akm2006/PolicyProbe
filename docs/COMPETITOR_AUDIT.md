# Competitor / Collision Audit

**Last checked: 2026-09-10** (previously 2026-09-08), against `hedera-dev/hedera-harness` open
PRs/issues — re-run `gh pr list --repo hedera-dev/hedera-harness --state open` and
`gh issue list --repo hedera-dev/hedera-harness --state open` before every Harness milestone;
this repo is gaining several new PRs per day during the event, nearly all from different
independent contributors.

## 2026-09-10 re-check: 5 new PRs since last audit, several close to our territory — verdict below

New since 2026-09-08: **#47, #48, #49, #50, #54, #51, #52, #53, #55**. Of these, three land close
enough to warrant a full read (title, body, files touched), not just the title:

- **#50 "verify on-chain effects against the mirror node"** — adds `validation/mirrorNode.ts`;
  after `runChainDeploy`'s commands exit 0, queries the ephemeral signer's *own recent
  transaction history* on Mirror Node and fails the attempt if none reached consensus with
  success. Single signer, single implicit expectation ("something succeeded"), no per-action
  declared policy, no expected-*failure* case, no actor identities, no balance/state check.
  This closes the exact gap PR #39 (still open) also targets — a maintainer-side scheduling
  question, not ours.
- **#49 "native CHAIN support for SDK app servers and Mirror Node verify"** — adds
  `chainValidation.verify.transactionTypes` (poll for successful payer-bound transactions,
  filtered by type) and `expose.appEnv` (inject the signer into a native-SDK app server's
  process, not just the browser). Its Mirror Node evidence is explicitly **attached to
  EVALUATE** ("attach proofs to EVALUATE") — enriching what the LLM evaluator sees, not
  replacing its judgment with an independent deterministic verdict. No expected-revert case, no
  actor identities, no balance delta. **Touches the same files our diff touches**
  (`attemptStages.ts`, `chainSigner.ts`, `specLoader.ts`, `types.ts`) — a real *file-level* merge
  consideration once one of us rebases onto a `dev` that has the other, but not a *feature*
  duplication.
- **#54 "Tier 3.5 x402Settlement mirror-node verification"** — narrowly scoped to the x402
  micropayment protocol's settlement flow, verified through the EVALUATE validator prompt
  (LLM-driven). Unrelated to our general assertion mechanism.

**Verdict unchanged, restated precisely against these three:** none of them let a recipe author
declare *"this specific action must succeed, or must be rejected, as adversarial actor X"* and
get a typed, LLM-independent finding back. All three either (a) generically confirm "the
deploy's signer did *something* successful" (a coarser, single-outcome, single-identity check),
or (b) feed richer evidence to the probabilistic EVALUATE step. Our differentiator — expected
**failure** as a first-class outcome, multiple named adversarial/authorized actor identities in
one assertion set, and balance/state postconditions, all deterministic and independent of any
LLM — is still unaddressed by any open PR as of this check.

**Action taken:** none required beyond this audit entry — no rescoping. Re-verify file-level
conflict risk with #49 specifically before opening our own PR, since it touches the identical
files.

---

## Audit as of 2026-09-08 (superseded above, kept for history)

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
