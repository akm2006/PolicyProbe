# Status

**Last updated:** 2026-09-08 (bootstrap session)
**Phase:** 1 complete (audit) → entering Phase 2 (smallest executable reproduction of the gap)

## Repos

- **`policy-probe`** (this repo) — git initialized, GitHub repo `manovHacksaw/PolicyProbe`
  created this session. Not yet public.
- **`../hedera-harness`** — cloned `hedera-dev/hedera-harness`, forked to
  `manovHacksaw/hedera-harness` (`origin`), `upstream` = `hedera-dev/hedera-harness`. Working
  branch: `policyprobe/deterministic-onchain-postconditions`, based on `dev` @
  **`587a2f335c29835e9505d9f13e230b8d677c0674`**. No commits on the branch yet (clean checkout).

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

## Unresolved

- ATS repo/docs not yet fetched — `docs/RESEARCH_SOURCES.md` flags this explicitly. Must happen
  before any ATS fixture design (Phase 8/11), not before Phase 2–7.
- Recipe schema for the new assertion primitive is a design draft only
  (`docs/HARNESS_ARCHITECTURE.md` §"Where PolicyProbe's assertion mechanism plugs in") — not
  yet reviewed via `policyprobe-upstream-review`, not yet implemented.
- No code written yet in `../hedera-harness` beyond checking out the working branch.

## Blockers

None currently blocking Phase 2 (reproduction can be written without testnet credentials — it
demonstrates the *architectural* gap, not a live run). Real testnet execution (Phase 4+) is
blocked on `docs/MANUAL_ACTIONS.md` #1 (operator credentials) until supplied.

## Next 3 tasks

1. Write the smallest executable reproduction in `../hedera-harness` demonstrating the gap
   (Phase 2, `docs/EXECUTION_PLAN.md`) — a test/script showing EVALUATE-only chain checks are
   LLM-judged and no finding category exists for outcome-vs-expectation.
2. Lock the recipe schema draft into a real TS interface + JSON shape, run it through
   `policyprobe-upstream-review` before implementing.
3. Implement `mustSucceed`/`mustRevert` transaction-outcome assertion with unit tests (Phase 4).

## Active manual actions

See `docs/MANUAL_ACTIONS.md` — none are currently blocking (#1 operator credentials will block
Phase 4; #2/#3/#4 are submission-time items).
