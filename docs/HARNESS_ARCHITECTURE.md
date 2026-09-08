# Hedera Harness Architecture (as of `dev` @ `587a2f335c29835e9505d9f13e230b8d677c0674`)

Read directly from source at the pinned SHA (`../hedera-harness`, branch
`policyprobe/deterministic-onchain-postconditions`, based on `dev`). Re-sync this doc if that
branch is rebased onto a newer `dev`. `npm run build` and `npm test` both pass clean at this
SHA (195/195 tests) — see `docs/STATUS.md` for the run log.

## Stage pipeline (`src/attemptStages.ts`)

One attempt: **GENERATE → ASSERT → SMOKE → EVALUATE**, each able to short-circuit the rest.

```
GENERATE  (src/attemptStages.ts runGenerateStage)
  coding agent (Cursor/Claude) edits the workspace. Non-zero exit -> ValidationFinding
  {category:"agent"} but does NOT block ASSERT (Cursor "hangs after done" precedent).

ASSERT    (runAssertStage -> src/validation/index.ts runDeterministicValidation)
  Fully synchronous, no chainSigner. Pushes findings of category:
  files | static | secret | commands. Extension point: add another
  `validate*` function here for anything that needs NO live signer/network.

SMOKE     (runSmokeStage, + runChainDeploy)
  Gate: isReadyForPlaywrightSmoke() — only "agent" findings are tolerated, everything
  else from ASSERT blocks SMOKE outright.
  runChainDeploy() runs BEFORE the dev server boots, IF spec.chainValidation is enabled:
  provisions/reuses the ephemeral funded ECDSA signer (chainSigner.ts), runs configured
  `deploy.commands` with HARNESS_SIGNER_* env vars injected. Failures ->
  {category:"commands", id:"chain-deploy:<name>"}.
  Then boots a dev server and runs Playwright routes -> {category:"playwright"} findings.

EVALUATE  (runEvaluateStage -> src/evaluation.ts runEvaluation)
  Only runs if a Playwright path + eval checklist + validator.enabled are all present.
  An adversarial LLM agent drives the LIVE app via Playwright MCP against the evaluate
  checklist. The chainSigner (if configured) is exposed to the BROWSER as
  `localStorage[expose.browserLocalStorageKey]` (default "burnerWallet.pk") so the agent
  can act as a funded testnet wallet through the app's own burner-wallet connector.
  Findings: {category:"eval", assertion:"<checklist id>"} on failure, or
  {category:"eval-infra"} when the agent can't reach the browser/MCP (never scored as an
  app defect — see design note "fail on uncertainty" in README).
```

**Key finding: there is no fifth "CHAIN" stage.** `chainValidation` is a cross-cutting
capability consumed by SMOKE (deploy) and EVALUATE (browser wallet exposure), not an
independent validation surface. Any deterministic postcondition mechanism that needs to run
after a real transaction and *before or alongside* EVALUATE has no existing home — it is new
plumbing, not a plug into an existing "Tier 3.5" module.

## Finding model (`src/types.ts`)

```ts
interface ValidationFinding {
  id: string;
  category: "files" | "static" | "secret" | "commands" | "agent" | "playwright" | "eval" | "eval-infra";
  message: string;
  details?: string;
  status?: "open" | "fixed";      // stamped by findingsLifecycle.ts across attempts
  assertion?: string;             // eval-checklist id, when category is "eval"
  route?: string;
}
```

`category` is a **closed union** — adding a new deterministic on-chain postcondition category
means extending this union (small, mechanical diff) plus handling it in the two places that
branch on category:

- `src/validation/index.ts::isReadyForPlaywrightSmoke` — decides which categories block SMOKE.
- `src/promptBuilder.ts` — decides "structural" (`files|static|secret|agent`, blocks earliest)
  vs. app-level-actionable (`commands|playwright|eval`) framing for the repair prompt, and
  unconditionally strips `eval-infra` as non-actionable before building the prompt.

**This second point is the load-bearing precedent for infra-vs-app-failure handling** — a new
category for e.g. "on-chain postcondition mismatch" should get its own `*-infra` sibling
(mirror-node lag, RPC timeout, etc.) filtered out the same way `eval-infra` is, so a flaky
network never becomes a false policy-violation finding fed to the repair prompt. This directly
satisfies the "fail closed on ambiguity, never misclassify infra as app failure" rule in
`docs/OPERATING_CONTRACT.md`.

## Repair loop (`src/findingsLifecycle.ts`, `src/promptBuilder.ts`, `src/attemptLoop.ts`)

Findings are **not** re-derived from scratch each attempt — `computeFindingDelta` diffs
finding `id`s against the previous attempt's open set to report `open / fixed / introduced`,
and `applyFindingStatus` stamps status for the report. **Implication for our design:** every
assertion needs a **stable, deterministic `id`** across repair attempts (e.g.
`chain-assertion:<recipe-declared-name>`) so a fix is recognized as "fixed" rather than
read as an unrelated new finding each rerun. This is what makes the "12 FAIL → repair → 12/12
PASS, same attack, same finding id disappears" demo narrative actually true in the artifacts,
not just true in the terminal output.

The repair prompt (`promptBuilder.ts`) is generic over `category` + `message` + `details` — no
change needed there beyond the structural/actionable classification above.

## Signer / chain evidence (`src/validation/chainSigner.ts`)

- Ephemeral **ECDSA** testnet account, one per run directory, persisted to
  `<run>/chain-signer.json` (`0600`), reused across repair/continue attempts, best-effort swept
  back to the operator at run end (`sweepBack`).
- Provisioning distinguishes **infrastructure failure** (`INVALID_SIGNATURE`,
  `PAYER_ACCOUNT_NOT_FOUND`, insufficient balance — all explicitly "NOT an app defect... `run
  --continue` cannot repair it") from ordinary flow — the exact distinction our postcondition
  evaluator must also make for the actions it runs.
- No code currently reads back transaction receipts/mirror-node state to compare against a
  declared expectation — `chainSigner.ts` only creates/tops-up/sweeps the account. Any receipt
  or mirror-node evidence collection for postcondition checking is new code.

## Where PolicyProbe's assertion mechanism plugs in — recipe schema LOCKED (2026-09-08)

**Schema implemented and merged into the working branch** (not yet upstream — see
`docs/DECISIONS.md` ADR-0006). Execution/evaluation is **not** implemented yet (Phase 4).

1. **Recipe surface**: extends `chainValidation` (not a new top-level key — smaller diff, and
   assertions inherently need the signer infrastructure `chainValidation` already owns):
   - `chainValidation.actors: Record<string, { fundingHbar?: number }>` — additional named
     ephemeral signers, provisioned the same way as the primary `chainSigner`, needed for
     actor-authorization-boundary assertions (an unauthorized actor's identity must differ from
     the primary signer's).
   - `chainValidation.assertions: ChainAssertionConfig[]` — `{ id, description?, actor?, action,
     expect }`. `action` reuses the existing `ChainValidationDeployCommand` shape (`{name,
     command, timeoutMs?}`) rather than duplicating it — same "one named shell step, signer env
     vars injected" concept as `deploy.commands`. `expect` is `{ outcome: "mustSucceed" |
     "mustRevert", reasonContains?, balanceDelta? }`; `balanceDelta` is `{ account | accountEnv,
     asset: "hbar" | {tokenId}, equals: string }` (string, not number — avoids float precision
     loss on tinybar/smallest-unit amounts).
   - Full worked example + field-by-field notes: `../hedera-harness/docs/authoring-a-recipe.md`
     §"chainValidation.assertions".
2. **`id` stability**: enforced at load (uniqueness) and documented as the contract the repair
   loop depends on (`findingsLifecycle.ts` diffs by id) — do not rename an id to "fix" a finding.
3. **Execution point** (Phase 4, not yet built): after `runChainDeploy`, before/alongside
   EVALUATE — needs the signer(s), needs the app already deployed, must NOT require the
   browser/Playwright/LLM.
4. **Evaluation** (Phase 4): pure code — execute the declared action with the resolved actor's
   signer, read back the result via SDK receipt + (once #39 lands) the hardened mirror-node
   reader, compare against `expect` deterministically.
5. **Findings** (Phase 5): new `category` (avoid colliding with `#43`'s `"mirror-node"` if it
   has merged by then) + matching `*-infra` sibling category, per the `eval`/`eval-infra`
   precedent above.
6. **Naming**: upstream-facing name stays generic ("deterministic on-chain postcondition
   assertions"); confirmed zero `PolicyProbe`/`policyprobe` strings in `src/`/`docs/` of the
   fork (`grep -rn "policyprobe" src/ docs/authoring-a-recipe.md` — empty).

**Review pass (schema)**: `policyprobe-upstream-review` self-review caught one real defect —
`ChainAssertionActionConfig` duplicated `ChainValidationDeployCommand` field-for-field — fixed
by reusing the existing type.

## Execution engine — IMPLEMENTED and reviewed (2026-09-08)

`src/validation/chainAssertionEvidence.ts` + `src/validation/chainAssertions.ts`, wired into
`attemptStages.ts` as `runChainAssertionsStage`, called right after `runChainDeploy` succeeds
and before the dev server boots for SMOKE (needs the app deployed and the signer(s), not the
browser).

**Evidence reader** (`chainAssertionEvidence.ts`): `fetchTransactionResult` /
`fetchHbarBalanceTinybars` / `fetchTokenBalance`, each against the real testnet Mirror Node
REST API, each returning a strict `found | not-found | infra-error` trichotomy — propagation
lag and genuine outages are never conflated with each other or with a policy result.
Deliberately scoped to exactly these two questions, not a general Mirror Node client (see
`docs/COMPETITOR_AUDIT.md` re: #39/#43).

**Execution/evaluation** (`chainAssertions.ts`): for each `chainValidation.assertions[]` entry
— resolve the actor's signer (primary or a named `chainValidation.actors` entry) → run
`action.command` with that signer's env vars injected (same convention as `deploy.commands`) →
require the command to print the real transaction id it submitted (`0.0.x@seconds.nanos`) in
its output → independently query that transaction's real consensus result from Mirror Node →
compare to `expect` (`mustSucceed`/`mustRevert`/`reasonContains`/`balanceDelta`) → emit exactly
one `ValidationFinding` on mismatch, silent on match. The action command's own exit code is
**never** the verdict — only used to distinguish "ran to completion" (exit 0) from "did not"
(non-zero/timeout → `chain-assertion-infra`, not a violation claim, since that's ambiguous
between a script bug and a transient infra failure).

**Findings**: `ValidationFinding.category` extended with `"chain-assertion"` (confirmed
violation, or a fixable config/script problem — fed to repair) and `"chain-assertion-infra"`
(evidence unobtainable — never fed to repair as an app defect, mirrors `eval`/`eval-infra`
exactly). A batch that is *entirely* infra aborts the attempt via the existing
`evaluation.infrastructureFailure` mechanism (reused deliberately — traced every downstream
reader, all only check the boolean + reason string, none assume "EVALUATE ran") instead of
spending a repair attempt on something no agent could fix. `promptBuilder.ts`'s
`classifyRepairScope` routes a `chain-assertion`-only or mixed batch to `"runtime"` scope; both
repair prompt templates (`prompts/repair-runtime.md`, `prompts/repair-broad.md`) now name the
category explicitly.

**Review pass (execution engine)**: independent `general-purpose` agent (the `upstream-reviewer`
subagent still wasn't registered — second occurrence, filed as feedback). Found and all fixed
before commit: (1) action-failure evidence was being misclassified as a policy violation instead
of infra, (2) unguarded `BigInt()` on `balanceDelta.equals` could crash on a recipe typo, (3) the
authoring doc was stale, (4) a private-repo-path branding leak in the evidence reader's comment.
One item deliberately deferred and documented rather than fixed: `executeCommand` can reject
(not just resolve with a failure) uncaught — a pre-existing gap shared with `runChainDeploy`, out
of scope for this diff. Full detail: `docs/DECISIONS.md` ADR-0007.

**Verified**: `npm run typecheck` clean; `npm test` **246/246 pass** with real testnet
credentials, including a full live end-to-end test — a real transaction, submitted by a real
script the engine executed, resolved through the real Mirror Node to a correct verdict. Post-fix
branding re-check across the whole diff is empty.

Still open before an upstream PR: get maintainer sanity-check on architecture placement
(`docs/MANUAL_ACTIONS.md` #5) — not blocking, proceed on our own judgment if no timely response;
and the deferred `executeCommand` robustness item above.

## Test suite conventions worth matching

- `test/*.test.mjs`, Node's built-in `node:test` + `node:assert`, no external test framework.
- PR #43's own description of its test style is a good template: hit the real testnet mirror,
  `t.skip()` gracefully when unreachable rather than failing on infra.
- Baseline run at this SHA: **195 passed, 0 failed** (`npm test`, 2026-09-08).
