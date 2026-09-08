# Status

**Last updated:** 2026-09-08 (bootstrap session)
**Phase:** 1–5 complete (schema, actor provisioning, evidence reader, execution engine,
finding-category/repair-loop wiring — reviewed, fixed, tested against real testnet) → entering
Phase 6 (the killer-demo sequence: deliberately broken policy → real FAIL → repair → real fix
→ rerun passes) and, in parallel, Phase 8 (fetch ATS repo/docs, not yet touched)

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

## Phase 4 + 5 — execution engine implemented, reviewed, fixed, proven on real testnet

Committed in `../hedera-harness` (6 commits, `fea4974`…`ec927f3`, all **local only** — see
ADR-0004, pushing the fork is a publish action pending approval):
- `src/validation/chainAssertionEvidence.ts` — Mirror Node evidence reader, strict
  found/not-found/infra-error trichotomy.
- `src/validation/chainAssertions.ts` — executes one assertion's action with the resolved
  signer, requires it to print the real transaction id, queries its real consensus result,
  compares to `expect`, emits a `ValidationFinding` (`chain-assertion` /
  `chain-assertion-infra`) on mismatch/unresolvable evidence.
- Wired into `attemptStages.ts` (`runChainAssertionsStage`, after `runChainDeploy`, before the
  dev server boots). A pure-infra batch aborts via the existing
  `evaluation.infrastructureFailure` mechanism instead of burning a repair attempt on nothing
  an agent could fix.
- `src/promptBuilder.ts` + both repair prompt templates updated for the new category.
- **Independent review pass** (`general-purpose` agent, `upstream-reviewer` subagent still not
  registered — filed as feedback, 2nd occurrence) found 4 real defects, all fixed before commit
  — see `docs/DECISIONS.md` ADR-0007 for the full list. Most notable: action-command failure
  (non-zero exit/timeout) was being misclassified as a policy violation instead of infra;
  fixed and covered by 2 new negative tests.
- **Full suite: 246/246 pass** with real testnet credentials, including a full live
  end-to-end test (real transaction → real Mirror Node → correct verdict, no mocks).
- Post-review branding re-check across the whole diff: empty.

## Unresolved

- ATS repo/docs not yet fetched — `docs/RESEARCH_SOURCES.md` flags this explicitly. Must happen
  before any ATS fixture design (Phase 8/11) — next major piece of work.
- `upstream-reviewer`/`security-validator`/`demo-auditor` subagents defined
  (`.claude/agents/`) but still not registered by the harness after two attempts — only
  `harness-researcher` is live. Working around it with a `general-purpose` agent given the same
  review instructions inline; this has worked well both times. Filed as feedback; not blocking.
- One deliberately deferred, documented limitation: `executeCommand` can reject (child-process
  spawn error) uncaught anywhere in the chain-assertion call path — pre-existing gap shared
  with `runChainDeploy`, not fixed here to avoid scope creep into unrelated existing code.
- No integrated "deliberately broken app" demo yet — the mechanism is proven standalone, but
  the Phase 6 killer-demo narrative (broken policy → FAIL → repair → fix → PASS against a real
  app) hasn't been built.

## Blockers

None. Manual Action #1 (testnet operator credentials) resolved 2026-09-08 — account
`0.0.10418936`, verified live with 1000 ℏ, stored at `~/.hedera-testnet.env` (outside both
repos, mode `600`). Real testnet execution (Phase 4+) is now unblocked.

## Next 3 tasks

1. Fetch and pin `hashgraph/asset-tokenization-studio` repo/docs (never done this session) —
   establish the exact bond-issuance/KYC/freeze/pause/coupon API before designing the fixture.
2. Design and build the ATS bond fixture with a deliberately broken rule (Phase 6/11) — the
   killer-demo scenario: unverified investor can wrongly receive the bond, caught by a
   `chain-assertion` with real testnet evidence.
3. Run the fixture through the real repair loop: broken policy → FAIL → repair prompt → real
   code fix → rerun → PASS, same finding id resolves to `status: "fixed"` (closes the last open
   row in `docs/ACCEPTANCE_CRITERIA.md`'s "Repair finding integration" section).

## Active manual actions

See `docs/MANUAL_ACTIONS.md` — none are currently blocking (#1 operator credentials will block
Phase 4; #2/#3/#4 are submission-time items).
