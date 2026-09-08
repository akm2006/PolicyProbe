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
