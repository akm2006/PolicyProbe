# Status

**Last updated:** 2026-09-08 (bootstrap session)
**Phase:** 1 (audit) and 2 (executable reproduction) complete → entering Phase 3 (lock the
assertion schema draft)

## Repos

- **`policy-probe`** (this repo) — git initialized, pushed to `manovHacksaw/PolicyProbe`
  (private) this session.
- **`../hedera-harness`** — cloned `hedera-dev/hedera-harness`, forked to
  `manovHacksaw/hedera-harness` (`origin`, **not yet pushed to** — see below), `upstream` =
  `hedera-dev/hedera-harness`. Working branch:
  `policyprobe/deterministic-onchain-postconditions`, based on `dev` @
  **`587a2f335c29835e9505d9f13e230b8d677c0674`**. One commit so far, **local only**:
  `10364e5 test: reproduce the missing deterministic chain-postcondition capability`. Not
  pushed to the fork (`origin`) — forks of a public repo are themselves public, so pushing is
  a publish action gated by the operating contract; treat as covered by
  `docs/MANUAL_ACTIONS.md` #2/#3.

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

## Unresolved

- ATS repo/docs not yet fetched — `docs/RESEARCH_SOURCES.md` flags this explicitly. Must happen
  before any ATS fixture design (Phase 8/11), not before Phase 3–7.
- Recipe schema for the new assertion primitive is a design draft only
  (`docs/HARNESS_ARCHITECTURE.md` §"Where PolicyProbe's assertion mechanism plugs in") — not
  yet reviewed via `policyprobe-upstream-review`, not yet implemented.
- No implementation code written yet in `../hedera-harness`, only the reproduction test.

## Blockers

None currently blocking Phase 3 (schema design is offline work). Real testnet execution
(Phase 4+ live runs, not the type-level/unit tests) is blocked on `docs/MANUAL_ACTIONS.md` #1
(operator credentials) until supplied.

## Next 3 tasks

1. Lock the recipe schema draft (`docs/HARNESS_ARCHITECTURE.md` §"Where PolicyProbe's assertion
   mechanism plugs in") into a real TS interface + JSON shape; run it through
   `policyprobe-upstream-review` before implementing (Phase 3).
2. Implement `mustSucceed`/`mustRevert` transaction-outcome assertion with unit tests, still
   network-independent where possible (mock signer/receipt shapes), real testnet only once
   Manual Action #1 is supplied (Phase 4).
3. Wire assertion failures into a new `ValidationFinding` category + `*-infra` sibling, through
   `promptBuilder.ts`'s structural/actionable split (Phase 5).

## Active manual actions

See `docs/MANUAL_ACTIONS.md` — none are currently blocking (#1 operator credentials will block
Phase 4; #2/#3/#4 are submission-time items).
