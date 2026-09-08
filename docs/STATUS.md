# Status

**Last updated:** 2026-09-08 (bootstrap session)
**Phase:** 1–4 (execution engine implemented, proven on real testnet) complete, review in
progress → entering Phase 5 (already substantially done as part of Phase 4's finding wiring;
confirming after review)

## Repos

- **`policy-probe`** (this repo) — git initialized, pushed to `manovHacksaw/PolicyProbe`
  (private) this session.
- **`../hedera-harness`** — cloned `hedera-dev/hedera-harness`, forked to
  `manovHacksaw/hedera-harness` (`origin`, **not yet pushed to** — see below), `upstream` =
  `hedera-dev/hedera-harness`. Working branch:
  `policyprobe/deterministic-onchain-postconditions`, based on `dev` @
  **`587a2f335c29835e9505d9f13e230b8d677c0674`** (re-verified same-day, no drift). Two commits
  so far, **local only, not pushed** (see ADR-0004 — pushing to the public fork is a publish
  action):
  - `fea4974` test: reproduce the missing deterministic chain-postcondition capability
  - `fadb800` feat: recipe schema for deterministic on-chain postcondition assertions

## Phase 3 addition — recipe schema locked

`chainValidation.actors` / `chainValidation.assertions` implemented in `../hedera-harness`:
`src/types.ts`, `src/specLoader.ts` (parsing + validation), `test/chain-assertions-schema.test.mjs`
(9 new tests), `docs/authoring-a-recipe.md` (new documented section, explicitly marked
"schema only — not yet executed"). Full detail and the ADR: `docs/HARNESS_ARCHITECTURE.md`,
`docs/DECISIONS.md` ADR-0006. Self-reviewed via `policyprobe-upstream-review` (caught and fixed
one real duplication defect). `npm run typecheck` clean, `npm test` **206/206 pass**.

## What works (verified this session)

- `npm install && npm run build` — clean, no errors, in `../hedera-harness`.
- `npm test` in `../hedera-harness` — **195 passed, 0 failed**, 2026-09-08.
- `gh` authenticated as `manovHacksaw`, full repo/workflow scopes.
- Foundry (`forge 1.7.1`), Docker, Node v26, npm 11, pnpm 11 all available locally. No global
  Hardhat (use `npx` per-project). No global `~/.claude/CLAUDE.md` or `~/AGENTS.md` present —
  no conflicting global instructions to reconcile.

## Technical thesis status

**Survived source-level validation, with corrected terminology.** See
`docs/DECISIONS.md` ADR-0001 and `docs/HARNESS_ARCHITECTURE.md`. The real gap: no code path in
current `dev` executes an on-chain action and evaluates its outcome against a declared
expectation deterministically (independent of the EVALUATE LLM), across distinct actor
identities, as a typed `ValidationFinding`. PRs #39 (mirror-node reliability) and #43
("Tier 2.5" entity/metadata existence checks) are adjacent, not competing — confirmed via
`gh pr view` bodies/file lists, not just titles.

## What works (Phase 2 addition)

- `test/policyprobe-postcondition-gap.test.mjs` added to the Harness fork — two
  characterization tests, run against the **real** exported `runChainDeploy`, proving:
  (a) a deploy command that exits 0 produces zero findings regardless of what it actually did
  on-chain; (b) the one finding it *can* produce (`category: "commands"`) carries no
  expect/observed evidence shape. Full upstream suite: **197/197 pass** (195 baseline + 2 new)
  after this addition, `npm run build` clean.

## Phase 4 — execution engine implemented and proven on real testnet

Uncommitted in `../hedera-harness` (review in progress, see below):
- `src/validation/chainAssertionEvidence.ts` — Mirror Node evidence reader
  (`fetchTransactionResult`/`fetchHbarBalanceTinybars`/`fetchTokenBalance`), each returning a
  strict found/not-found/infra-error trichotomy.
- `src/validation/chainAssertions.ts` — executes one assertion's action with the resolved
  signer, captures the real transaction id from output, queries its real consensus result,
  compares to the declared expectation (`mustSucceed`/`mustRevert`/`reasonContains`/
  `balanceDelta`), emits a `ValidationFinding` on mismatch or on unresolvable evidence
  (`chain-assertion` vs `chain-assertion-infra`).
- Wired into `attemptStages.ts` (`runChainAssertionsStage`, runs after `runChainDeploy`,
  before the dev server boots). A pure-infra batch reuses the existing
  `evaluation.infrastructureFailure` abort mechanism instead of burning a repair attempt on
  something the agent can't fix — found and fixed as a real gap during implementation, not
  planned upfront.
- `src/promptBuilder.ts` — new categories classified into repair scope; infra category
  stripped from the repair prompt the same way `eval-infra` is.
- **32 new tests** across 4 files (13 evidence-reader unit tests against a mock HTTP server, 2
  live evidence tests, 17 execution-engine unit tests with injectable deps, 1 full live
  end-to-end test, plus the earlier actor-provisioning and schema tests). **Full suite:
  241/241 pass** with real testnet credentials sourced.
- **Real testnet proof obtained**: a real self-transfer transaction, submitted by a real
  script the engine executed, resolved through the real Mirror Node to `mustSucceed` — the
  full execute → capture tx id → query evidence → compare → PASS loop, no mocks, no
  simulation.

Independent review in progress (`general-purpose` agent standing in for `upstream-reviewer`,
since that subagent still isn't registered by the harness — see below). Will update this
section and `docs/DECISIONS.md` with the outcome.

## Unresolved

- ATS repo/docs not yet fetched — `docs/RESEARCH_SOURCES.md` flags this explicitly. Must happen
  before any ATS fixture design (Phase 8/11).
- `upstream-reviewer`/`security-validator`/`demo-auditor` subagents are defined
  (`.claude/agents/`) but still not registered by the harness after a second attempt — only
  `harness-researcher` is live. Working around it with a `general-purpose` agent given the
  same review instructions inline. Filed as feedback; not blocking.
- Findings from the current review pass not yet triaged (in progress).

## Blockers

None. Manual Action #1 (testnet operator credentials) resolved 2026-09-08 — account
`0.0.10418936`, verified live with 1000 ℏ, stored at `~/.hedera-testnet.env` (outside both
repos, mode `600`). Real testnet execution (Phase 4+) is now unblocked.

## Next 3 tasks

1. Implement the execution engine: run a `chainValidation.assertions[]` entry's `action` with
   the resolved actor's signer, capture a transaction id from the command's output, query its
   real outcome (SDK receipt now; the hardened mirror-node reader once #39 lands) — network
   credentials are available (`~/.hedera-testnet.env`), so this can be tested against real
   testnet, not just mocks (Phase 4).
2. Implement `mustSucceed`/`mustRevert` comparison against that real outcome, with unit tests
   covering the false-positive/false-negative/infra-failure distinctions in
   `docs/ACCEPTANCE_CRITERIA.md`.
3. Wire assertion failures into a new `ValidationFinding` category + `*-infra` sibling, through
   `promptBuilder.ts`'s structural/actionable split (Phase 5).

## Active manual actions

See `docs/MANUAL_ACTIONS.md` — none are currently blocking (#1 operator credentials will block
Phase 4; #2/#3/#4 are submission-time items).
