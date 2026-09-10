# Decisions (ADR log)

Chronological. Never silently change core architecture — a material change gets an entry here
before or with the commit that makes it.

---

## ADR-0001 — Adopt PolicyProbe thesis as validated, with corrected terminology

**Date:** 2026-09-08
**Decision:** Proceed with the deterministic on-chain behavioral postcondition thesis from
`Hedera_PolicyProbe_ETHOnline_2026_Winning_Package.md`, with the gap re-stated precisely
against real source (see `docs/HARNESS_ARCHITECTURE.md`) rather than the doc's paraphrase.
**Alternatives considered:** abandon if #39/#40/#43 already covered it (they don't — see
`docs/COMPETITOR_AUDIT.md`); pivot to a pure Mirror Node reliability contribution (rejected,
that's #39's territory) or a pure static scanner (rejected, that's #40's territory).
**Evidence:** read `src/attemptStages.ts`, `src/types.ts`, `src/validation/chainSigner.ts`,
`src/validation/index.ts`, `src/promptBuilder.ts`, `src/findingsLifecycle.ts` at
`dev@587a2f335c29835e9505d9f13e230b8d677c0674`; ran `npm test` (195/195 pass); read PR
#39/#40/#43/#44/#45/#46 titles, bodies, and touched-file lists via `gh`.
**Reason:** the `ValidationFinding.category` union has no slot for "executed action's outcome
vs. declared expectation," and no code path executes-then-asserts deterministically; #39/#43
are read-only entity/metadata/reliability work, not outcome assertions.
**Consequences:** the winning-package doc's literal "Tier 0–1/2/3/3.5" naming is *not* used as
an API/doc claim (corrected in `docs/RESEARCH_SOURCES.md`); real stage names (`GENERATE
/ASSERT/SMOKE/EVALUATE`) are used everywhere in our own docs and code.

---

## ADR-0002 — Two-repository topology (Option B)

**Date:** 2026-09-08
**Decision:** `policy-probe` (this repo, → GitHub `PolicyProbe`) is the ETHGlobal submission
(docs, fixtures, ATS demo glue, judge console). `../hedera-harness` is a separate local clone,
forked to `manovHacksaw/hedera-harness` (`origin`), tracking `hedera-dev/hedera-harness`
(`upstream`), on branch `policyprobe/deterministic-onchain-postconditions` off `dev`. All
Harness-side implementation and the eventual PR live only there.
**Alternatives considered:**
- *Option A (Harness fork as primary repo, demo as an example/fixture inside it)* — rejected:
  would force ATS/demo/branding content into the same tree as an upstream-quality PR, hurting
  PR cleanliness and reviewability.
- *Vendoring the Harness fork into this repo* — rejected: bloats submission repo, obscures
  which commits are "ours" vs. upstream history, complicates `npm test` isolation.
**Reason:** cleanest PR diff for maintainers, clearest submission repo for judges, each repo's
git history stays meaningful and reproducible independently.
**Consequences:** contributors must open two directories; `docs/STATUS.md` tracks both repos'
state; any shared instruction content lives once in `docs/OPERATING_CONTRACT.md` and is
pointed to, not duplicated, by both repos' root instruction files (this repo's `CLAUDE.md`/
`AGENTS.md`; the Harness fork gets its own thin pointer once implementation starts there).

---

## ADR-0003 — No project-level MCP servers

**Date:** 2026-09-08
**Decision:** Do not add project-level MCP servers (Playwright, blockchain, or otherwise) to
either repo for now.
**Alternatives considered:** a project Playwright MCP for our own judge-console testing.
**Reason:** Harness already owns Playwright/browser tooling for its own SMOKE/EVALUATE stages
(ships `@playwright/mcp` itself, launches its own pinned version, warns against copying a
project `.mcp.json`) — a competing project-level config could conflict with a real Harness
run inside `../hedera-harness`. No other recurring task yet justifies an MCP's context/schema
cost. Native Bash/WebFetch/`gh`/browser-in-CI tooling covers current needs.
**Consequences:** revisit only if a specific, named recurring task can't be done with existing
tools — record that task here before adding anything.

---

## ADR-0004 — Fork hedera-harness now; do not open a PR or publish PolicyProbe yet

**Date:** 2026-09-08
**Decision:** Created `manovHacksaw/hedera-harness` fork and a local working branch now (needed
to have anywhere to commit Harness-side implementation). GitHub repo `PolicyProbe` created per
explicit user instruction this session. Neither repo's content is to be made public, pushed to
a shared branch for review, or turned into an open PR without a further explicit go-ahead for
that specific action.
**Reason:** forking/repo-creation is reversible infrastructure setup; opening a PR or otherwise
publishing project content is the irreversible/public action the operating contract gates.
**Consequences:** `docs/MANUAL_ACTIONS.md` tracks the "approve opening the upstream PR" and
"approve making PolicyProbe public" steps as pending human decisions near submission time.

---

## ADR-0005 — Commit identity: `manovHacksaw` GitHub noreply email, both repos

**Date:** 2026-09-08
**Decision:** All commits in `policy-probe` and the `hedera-harness` fork's working branch use
`GIT_AUTHOR/COMMITTER_NAME=manovHacksaw`,
`EMAIL=108396191+manovHacksaw@users.noreply.github.com` (GitHub's own private-email format for
account id `108396191`), set as **repo-local** `user.name`/`user.email` in both working trees
— not global.
**Alternatives considered:** the real email backing `manovHacksaw` (not retrievable — `gh api
user` returns no public email and the `user` email-list endpoint needs a broader token scope
than this session has); the session's default global git identity, which had drifted between
two different personal emails across the two repos.
**Reason:** the noreply format reliably links commits to the `manovHacksaw` GitHub profile
(avatar, profile link) on both repos without depending on account email visibility settings,
and keeps authorship consistent between the submission repo and the upstream-facing fork.
**Consequences:** `policy-probe`'s initial 10 commits were rewritten in place with
`git filter-branch --env-filter` (single-owner private repo, no collaborators to disrupt) and
force-pushed; the fork's one local commit was amended. Any commit made in either repo going
forward must keep using this identity — verify with `git log -1 --format='%an <%ae>'` if in
doubt, don't rely on the global default.

---

## ADR-0006 — Chain-assertion recipe schema locked: extend `chainValidation`, don't add a new top-level key

**Date:** 2026-09-08
**Decision:** The deterministic on-chain postcondition assertion schema is
`chainValidation.actors` (named additional ephemeral signers) +
`chainValidation.assertions` (`{id, description?, actor?, action, expect}`), documented in full
in `docs/HARNESS_ARCHITECTURE.md`. `action` reuses the existing `ChainValidationDeployCommand`
type rather than a new near-duplicate interface.
**Alternatives considered:**
- A new top-level `spec.chainAssertions` key — rejected: assertions inherently depend on
  `chainValidation`'s signer infrastructure, so nesting avoids a second top-level surface and
  keeps `KNOWN_SPEC_KEYS` (`specDefaults.ts`) untouched.
- A dedicated `ChainAssertionActionConfig` type — rejected after self-review: field-for-field
  identical to `ChainValidationDeployCommand`; reusing it is a smaller, more consistent diff.
**Evidence:** implemented in `../hedera-harness` (`src/types.ts`, `src/specLoader.ts`,
`test/chain-assertions-schema.test.mjs`, `docs/authoring-a-recipe.md`), full suite green at
**206/206** (`npm test`), `npm run typecheck` clean. Reviewed via the `policyprobe-upstream-review`
skill (self-review — the `upstream-reviewer` subagent was not registered by the harness at
review time despite matching frontmatter to `harness-researcher`, which was; filed as product
feedback rather than blocking on it).
**Reason:** smallest diff that supports all three MVP assertion primitives (transaction
outcome, balance delta, actor-authorization boundary as two assertions with different `actor`
values) without a speculative DSL.
**Consequences:** Execution/evaluation logic (Phase 4) and finding-category wiring (Phase 5)
are still unimplemented — the schema currently validates and is inert. The doc explicitly
labels this "recipe schema only" so no one mistakes it for a working feature.

---

## ADR-0007 — Execution engine: infra-vs-violation classification, and one deferred fix

**Date:** 2026-09-08
**Decision:** Implemented `chainAssertions.ts` (execute action → capture real transaction id →
query real Mirror Node result → compare to `expect`) and wired it into the pipeline
(`runChainAssertionsStage`, after `runChainDeploy`). Reviewed via an independent `general-purpose`
agent standing in for the still-unregistered `upstream-reviewer` subagent. Applied 4 real fixes
before committing:
1. **Action-command failure (non-zero exit / timeout) is now `chain-assertion-infra`, not a
   policy-violation claim.** Originally, any action that produced no parseable transaction id —
   whether because it exited 0 and just forgot to print one, or because it failed/timed out for
   possibly-infra reasons — was treated identically as an actionable `chain-assertion` finding.
   Fixed: only a script that exits 0 but prints nothing is a config/script problem; a script that
   didn't even complete is evidence-unavailable, never a violation claim, per the "fail closed on
   ambiguity" rule.
2. **`balanceDelta.equals` validated as a signed-integer string at load time** — previously an
   unguarded runtime `BigInt(equals)` could crash the whole run on a plausible recipe typo
   (`"5.5e8"`, `"500,000,000"`).
3. **`docs/authoring-a-recipe.md` updated** — it still said "schema only, not yet executed,"
   which became false the moment this commit landed.
4. **A private-repo-path reference removed** from `chainAssertionEvidence.ts`'s module comment
   (`policy-probe/docs/COMPETITOR_AUDIT.md`) — folded into that already-committed, unpushed
   commit via `git commit --amend` rather than left as a separate fixup, since it was still the
   branch tip and nothing was stacked on it yet.

Also added: repair-prompt template updates (`prompts/repair-runtime.md`,
`prompts/repair-broad.md` now name `[chain-assertion]`/`[chain-assertion-infra]` explicitly,
matching the review's finding that the LLM-facing artifacts were silently missing the new
category) and `promptBuilder.ts` classification tests that didn't exist before (a
`chain-assertion`-only batch → `runtime` scope; a `chain-assertion-infra`-only batch → falls
back to `broad` with the infra finding itself never appearing in the rendered prompt; a mixed
batch → `runtime` scope with only the real violation shown).

**Deliberately not fixed, and documented as such** (in-code comment in `chainAssertions.ts` and
here): `executeCommand` can reject outright (child-process spawn error) rather than resolve with
a failure result, uncaught anywhere in this call chain — a crash instead of a graceful finding.
This is a pre-existing pattern shared by `runChainDeploy`, not a new regression. Fixing it here
would mean either leaving the identical gap in `runChainDeploy` (inconsistent) or expanding this
diff to fix unrelated pre-existing code (scope creep). Tracked as a follow-up, not blocking.

**Evidence:** `npm run typecheck` clean; `npm test` **246/246 pass** with real testnet
credentials sourced, including the full live end-to-end test (real transaction → real Mirror
Node → correct verdict). Two new negative tests specifically reproduce the fixed action-failure
misclassification (non-zero exit and timeout, both now `chain-assertion-infra`). Post-review
branding re-check (`grep -rn "policyprobe" src/ docs/authoring-a-recipe.md prompts/`) is empty.
**Reason:** integrity of the infra-vs-violation distinction is the project's core correctness
property — worth fixing immediately rather than deferring, even mid-implementation.
**Consequences:** `../hedera-harness` now has 6 local, unpushed commits
(`fea4974`…`ec927f3`) implementing the full assertion pipeline: schema, actor provisioning,
evidence reading, and execution/evaluation. Phase 4 and Phase 5 (finding-category wiring) are
both complete — they turned out inseparable in practice, since a finding is meaningless without
something to consume it, and vice versa.

---

## ADR-0008 — ATS integration: direct contract calls, existing factory, whitelist not internal KYC

**Date:** 2026-09-09
**Decision:** The ATS bond fixture (`fixtures/ats-bond/`) calls `@hashgraph/asset-tokenization-contracts`'s
published typechain factories directly with a plain `ethers.Wallet` signer, rather than the
higher-level `@hashgraph/asset-tokenization-sdk`. It issues its bond through ATS's own existing
Hedera testnet factory deployment (`0.0.9213391`) rather than deploying a new BLR/factory
system. It uses the whitelist/control-list compliance mechanism (`isWhiteList: true`,
`addToControlList`/`removeFromControlList`) rather than ATS's internal-KYC facet.
**Alternatives considered:**
- *`@hashgraph/asset-tokenization-sdk`'s documented `Network.connect` flow* — rejected: its
  README states "Wallet: only metamask is compatible right now," and the underlying
  `RPCTransactionAdapter` is coupled to a `MetamaskService`/`tsyringe` DI container with no
  published headless entry point. Confirmed by reading the adapter's actual source, not just
  assuming from the README wording.
- *Deploying our own BLR/factory system* (`npm run deploy:newBlr:hedera:testnet` from the ATS
  repo) — rejected as unnecessary: issuing a bond *through* an existing factory is the intended
  integration pattern (this is what any real integrator building on ATS would do), and
  redeploying the whole diamond system is a much heavier, riskier operation for no added proof
  value.
- *ATS's internal-KYC facet* (`grantKyc`/`activateInternalKyc`) — explored and abandoned after
  hitting its verifiable-credential-issuer subsystem (`SSI_MANAGEMENT`): `grantKyc`'s `_issuer`
  parameter is validated against something not resolvable with a plain address (own address and
  `ZeroAddress` both rejected, selector `0xcd324f53`), and that registry wasn't worth reverse-
  engineering for a demo fixture when whitelist/control-list demonstrates the identical policy
  shape ("must be a verified investor to hold this asset") with a well-documented, two-function
  API.
**Evidence:** Real bond issued and independently verified on Hedera testnet
(`fixtures/ats-bond/EVIDENCE.md`): 3 bonds deployed, 6/6 real policy-suite assertions pass
against the correctly configured one, and the killer demo (same assertion id, same policy) FAILs
with real evidence against a deliberately misconfigured one and PASSes against the fixed one.
**Reason:** minimize integration risk and time against an unfamiliar enterprise SDK while still
using ATS "for real" (real factory, real facets, real testnet) rather than a mock.
**Consequences:** the fixture does not demonstrate ATS's internal-KYC/VC-issuer flow or its
coupon/dividend corporate-action facets (both stretch/bonus per the ATS track's own bonus
criteria, not requirements) — `docs/ACCEPTANCE_CRITERIA.md` reflects this as a deliberate scope
line, not an oversight. Two real Harness-fork bugs were found and fixed as a direct result of
this integration attempt (EVM transaction hash support, `mustRevert` gas-limit requirement) —
recorded in the Harness fork's own commit `810f0c7` and `fixtures/ats-bond/EVIDENCE.md`.

---

## ADR-0009 — Adversarial review round 2: critical redaction gap, revert-reason limits, fixture idempotency

**Date:** 2026-09-10
**Decision:** Ran two independent review passes (`security-validator`, `demo-auditor`) against
the finished engine and fixture, fixed every well-evidenced finding, and honestly documented
the one that can't be fully closed without violating the project's own genericity rule.
**What was found and fixed** (full detail: Harness fork commit `99f01f7`, fixture commit
`e3a5cc8`, `fixtures/ats-bond/EVIDENCE.md` §"Independent review"):
1. **Critical**: the repair/generate-loop prompt writer had zero secret redaction — a real gap
   distinct from, and more severe than, the source-level redaction added in ADR-0007's review
   round, since this is the sink that reaches a third-party LLM API call. Fixed at both the
   sink (`attemptReporting.ts`, now redacts every signer) and confirmed the source-level
   redaction (`chainAssertions.ts`, `runChainDeploy`) covers the pre-existing deploy path too,
   not just the new chain-assertion path.
2. **High**: `reasonContains` couldn't distinguish *why* an EVM transaction reverted — Mirror
   Node's coarse status string is identical for every reason. Partially fixed (standard
   `Error(string)` reverts now decode); honestly **not** fully closed — ATS's own contracts use
   custom errors, which can't be decoded without that contract's ABI, and carrying ATS-specific
   ABIs in the generic engine would violate "no ATS branding in generic Harness code." Confirmed
   the real fixture never actually used `reasonContains`, so no prior claim was false; corrected
   the recipe-authoring doc's example to state the limitation rather than imply universal support.
3. **Medium, reproduced live**: the ATS fixture's own policy suite wasn't rerunnable — a pause
   step with no unpause meant a second run failed for reasons unrelated to the policy under
   test. Hit this exact failure while fixing it (the bond was still paused from earlier manual
   testing), then fixed and reran twice consecutively for real confirmation.
4. **Medium**: the fixture's setup sequence (whitelist/issue/freeze/role-grant) existed only as
   ad hoc commands during development, not a reusable script — a real reproducibility gap for
   anyone following the README from scratch. Added `02-setup-policy-fixtures.ts`.
5. **Medium**: a thrown Mirror Node fetch got zero retries while a 404 got the full budget —
   fixed for consistency; documented the resulting latency tradeoff rather than hiding it.
**Process note**: one of the two `security-validator` agent spawns overrode an unrelated
literal instruction in favor of self-directed review matching its role definition — filed as
model-behavior feedback, not treated as a project defect, but worth knowing about if reusing
this subagent for narrow non-review tasks in future sessions.
**Evidence:** Harness fork `npm test` **267/267 pass**; fixture policy suite reran twice
consecutively post-fix, **6/6 PASS both times** (the second run is the actual proof of the
idempotency fix, not just a code inspection).
**Reason:** a security-critical secret-handling gap and a reproducibility claim that didn't
hold under a literal rerun are exactly the class of finding this project's review discipline
exists to catch before submission, not after a judge finds them.
**Consequences:** `docs/AI_USAGE.md`'s existing disclosure already covers this work. No further
scope change — the ATS bond fixture and Harness engine are now both in a materially more
trustworthy state, with the two remaining honest limitations (custom-error revert reasons,
no on-chain role verification for actors) documented rather than silently accepted.

## ADR-0010 — `fetchTokenBalance` fixed: not-yet-indexed token association was misread as a confirmed zero

**Context:** the whole suite's earlier balance coverage tested `fetchTokenBalance` only against
mocks and the operator's own pre-existing HBAR balance; the ATS bond fixture never exercised
this code path at all (it's an EVM contract token, not native HTS — that's `ADR-0008`'s finding,
handled by the separate `fetchContractTokenBalance`). No test had ever pointed this function at
a genuine, freshly-created HTS token — the one asset shape it actually exists to read.

**What was found:** adding exactly that test (create a real `TokenCreateTransaction`, read the
treasury's balance immediately after the receipt) failed for real: `0n` instead of the minted
`12345n`. A manual Mirror Node poll loop against the same account, run separately, found the
correct balance present within ~3s — so this was not a case of the assertion being wrong, or of
genuine multi-block propagation lag exceeding the 20s poll budget. It was a real bug:
`entry?.balance ?? 0` made the extractor return a *defined* `0n` the moment the token's entry
was merely absent from `/accounts/{id}`'s `balance.tokens[]`, which is indistinguishable, to the
shared `pollForEvidence` retry loop, from "confirmed, no need to retry." Because the account
endpoint itself answers 200 immediately (the account already existed), a brand-new token's
not-yet-indexed entry was accepted as final on literally the very first poll, with zero retries
ever attempted.

**Fix:** the extractor now returns `undefined` (the existing "not there yet, keep polling"
signal) while the entry is absent, exactly like a 404 already does. `pollForEvidence` gained an
optional `fallbackOnHealthyTimeout` value — the real final answer to use only if *every* poll
for the whole budget was healthy (200, just missing the shape); it is never used after any
404/non-200/fetch failure, so genuine infra trouble still reports `infra-error`, never a silent
zero. This keeps the pre-existing, honestly-documented ambiguity ("no association" vs "spent to
exactly zero" both read as `0n` — HTS has no other representation of that distinction via this
endpoint) but removes the *new* ambiguity this bug introduced ("not indexed yet" vs "confirmed
zero"), which was strictly worse: it could cost a real balance-delta assertion its evidence
window entirely, on the very first poll, for any workflow that creates a token and checks a
balance against it soon after — a plausible real deploy-then-assert shape, not a contrived one.

**New coverage:** a deterministic mock regression test (entry absent for two polls, present
with a real non-zero balance on the third — reproducing the exact bug shape without depending
on real testnet timing) plus the real-testnet test that surfaced the bug in the first place,
now passing for real.

**Evidence:** Harness fork commit `427a36f`. Full suite **277/277 pass** on real testnet (was
275/275 before this fix; the 2 new tests are the mock regression test and the real-HTS-token
test above).

**Reason:** exactly the kind of gap this project's "never fabricate, never paper over a real
failure" discipline exists to catch — the fix came from actually running the primitive against
the real asset type it claims to support, not from code inspection alone.

**Consequences:** `fetchTokenBalance` is now the third Mirror Node evidence reader (after
`fetchTransactionResult`/`fetchContractCallResult` and `fetchContractTokenBalance`) confirmed
against real testnet state for the specific asset shape it targets, not just mocks. No schema
or recipe-authoring change — the existing `authoring-a-recipe.md` balance-delta documentation
made no claim this bug contradicted.
