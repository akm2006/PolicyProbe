# Status

**Last updated:** 2026-09-10
**Phase:** 1–9, 11, and 12 complete (full assertion engine, ATS killer demo, adversarial review
with fixes, before/after benchmark) → entering Phase 13 (upstream PR polish) and Phase 14
(judge UI), with README/docs polish (15) and the demo video (16+) still ahead

**Note on timeline framing:** earlier status updates in this file were paced against the
verified Sept 13 deadline. Per explicit direction from the user (2026-09-09), further work is
paced for production-grade correctness and completeness first, not deadline-driven scope
cuts — the deadline in `docs/HACKATHON_REQUIREMENTS.md` remains a real fact to re-verify before
submission, just not the thing driving what gets built or skipped right now.

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

## Phase 6 + 8 + 11 — ATS bond fixture, real testnet, killer demo (2026-09-09)

`fixtures/ats-bond/` in this repo (committed `006a2a7`), full detail and every transaction hash
in `fixtures/ats-bond/EVIDENCE.md`:

- A real bond, "Atlas Infrastructure Note 2027," issued on Hedera testnet **through ATS's own
  existing factory** (`0.0.9213391`) — calling `@hashgraph/asset-tokenization-contracts`'s
  published typechain factories directly with a plain ethers signer, not the higher-level SDK
  (its documented connect flow is wallet-only, unusable headlessly — see ADR-0008).
- **Full policy suite, 6/6 PASS**, run through the real `runChainAssertions` export (not a
  reimplementation): unverified investor blocked, same transfer succeeds once whitelisted,
  unauthorized freeze blocked, authorized freeze succeeds, frozen holder blocked, paused-asset
  blocks transfer — every check backed by a real, independently-verified testnet transaction.
- **The killer demo, for real**: the exact same assertion id (`reject-unverified-transfer`), run
  against a deliberately misconfigured bond (compliance gating left off) → FAIL, with the real
  violating transaction's evidence (transfer that should have reverted actually succeeded
  on-chain); run against the corrected configuration → PASS. This is the winning-package's
  central demo narrative, now real rather than planned.
- **Two real Harness-fork bugs found and fixed** as a direct result of this integration attempt
  (not planned upfront): EVM transaction hashes weren't recognized as evidence (fork commit
  `810f0c7`), and a `mustRevert` action needs an explicit gas limit or ethers never broadcasts
  the transaction at all (fixed in the fixture's own `sendAndReport` helper).
- Internal-KYC (ATS's verifiable-credential-issuer subsystem) explored and deliberately not
  used — whitelist/control-list demonstrates the identical policy shape more simply. ADR-0008.

## Phase 9 — adversarial review (2026-09-10): critical fix, honest limitation, fixture repro fix

`security-validator` and `demo-auditor` subagents are now registering correctly (previously
they weren't — see below for the one anomaly). Two full passes run, findings triaged and mostly
fixed — full detail in `docs/DECISIONS.md` ADR-0009, `fixtures/ats-bond/EVIDENCE.md`:

- **Critical, fixed**: the repair/generate-loop prompt writer had zero secret redaction — a
  live signer key had a real path to a third-party LLM API call and a plaintext file. Fixed at
  both the sink (`attemptReporting.ts`) and confirmed at the source (`chainAssertions.ts`,
  `runChainDeploy`).
- **High, partially fixed, honestly documented**: `reasonContains` couldn't distinguish *why*
  an EVM transaction reverted. Standard `Error(string)` reverts now decode; ATS's own custom
  errors still can't be, without violating the "no ATS branding in generic Harness code" rule —
  the real fixture never used `reasonContains` regardless, so no prior claim was false.
- **Medium, reproduced live then fixed**: the policy suite's own pause step had no unpause,
  breaking reruns — hit this exact failure mid-fix, then fixed and confirmed with two clean
  consecutive reruns (6/6 PASS both times).
- **Medium, fixed**: the fixture's setup sequence existed only as ad hoc commands during
  development — added `02-setup-policy-fixtures.ts` so a fresh deployment is actually
  reproducible, not just describable.
- Full harness suite: **267/267 pass**.

## Unresolved

- One deliberately deferred, documented limitation: `executeCommand` can reject (child-process
  spawn error) uncaught anywhere in the chain-assertion call path — pre-existing gap shared
  with `runChainDeploy`, not fixed here to avoid scope creep into unrelated existing code.
- `reasonContains` cannot decode a custom-error revert reason (ADR-0009) — documented, not
  fixed, deliberately, to avoid coupling the generic engine to ATS-specific error ABIs.
- No on-chain check that an `actor` genuinely holds/lacks the role a policy claims to test —
  the assertion trusts the recipe author's setup, same as any fixture trusts its own state.
- The killer demo uses two separate bond deployments (broken vs. fixed), not a single Harness
  repair-attempt rerun on one workspace — this proves the id-stability contract the repair loop
  depends on, but not a literal coding-agent repair pass on a smart-contract config (out of
  PolicyProbe's own scope — see `docs/ACCEPTANCE_CRITERIA.md`).
- One subagent spawn (a `security-validator` sent a trivial, unrelated instruction) overrode it
  in favor of self-directed review matching its role definition — filed as model-behavior
  feedback, not a project defect, but worth knowing if reusing subagents for narrow tasks.
- `upstream-reviewer` subagent still hasn't been separately confirmed registering (only
  `security-validator`/`demo-auditor`/`harness-researcher` confirmed so far) — check before
  relying on it for the pre-PR pass.

## Blockers

None. Manual Action #1 (testnet operator credentials) resolved 2026-09-08 — account
`0.0.10418936`, verified live with 1000 ℏ, stored at `~/.hedera-testnet.env` (outside both
repos, mode `600`). Real testnet execution (Phase 4+) is now unblocked.

## Next 3 tasks

1. Upstream PR polish (Phase 13): rebase the Harness fork branch onto current `dev` (re-check
   `docs/COMPETITOR_AUDIT.md` first — last checked 2026-09-10), confirm no new collision from
   the several PRs that landed since, then prepare the PR description per
   `.claude/skills/policyprobe-upstream-review`.
2. Judge UI (Phase 14) — minimal evidence console now that there's real data to render:
   overview, run detail, proof page per `docs/PROJECT_CHARTER.md`'s original sketch.
3. README/docs pass (Phase 15) for the submission repo itself — the fixture and Harness fork
   each have their own docs; the top-level `policy-probe` README judges will land on first
   still needs writing.

## Superseded tasks (kept for history)

1. ~~Fetch and pin `hashgraph/asset-tokenization-studio` repo/docs~~ — done, see Phase 6/8/11.
2. ~~Design and build the ATS bond fixture with a deliberately broken rule~~ — done, real
   testnet evidence in `fixtures/ats-bond/EVIDENCE.md`.
3. ~~Run the fixture through the real repair loop~~ — done via two real deployments (see
   "Unresolved" above for the honest caveat: this proves id-stability, not a literal
   coding-agent repair pass on a smart-contract config).

## Active manual actions

See `docs/MANUAL_ACTIONS.md` — #1 (credentials) resolved. #2/#3/#4 remain submission-time items,
none currently blocking.
