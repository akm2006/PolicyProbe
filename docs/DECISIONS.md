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
