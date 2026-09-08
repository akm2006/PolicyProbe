# PolicyProbe — Operating Contract

Canonical instructions for any agent (Claude Code or Codex) resuming work on this
repository. `CLAUDE.md` and `AGENTS.md` are thin pointers to this file plus
environment-specific notes — don't fork this content, edit it here.

## Mission

**PolicyProbe extends Hedera Harness with deterministic on-chain behavioral
postcondition assertions**, so an AI-built Hedera app can prove its critical
rules actually held on testnet — not merely that a transaction happened.

- **Primary bounty:** Hedera — Open Source: Improve the Hedera Harness ($2,000, up to 2×$1,000).
- **Secondary bounty:** Hedera — Tokenization of Anything / Asset Tokenization Studio ($6,000, up to 3×$2,000).
- ATS bond is the **flagship demo fixture**, not the invention. The invention is the
  generic assertion/evidence/finding mechanism in Harness.

Full detail: [`docs/PROJECT_CHARTER.md`](PROJECT_CHARTER.md).

## Source-of-truth hierarchy (highest wins on conflict)

1. Current official ETHOnline 2026 rules / Hedera bounty pages.
2. Current `hedera-dev/hedera-harness` source, docs, issues, PRs (branch: **`dev`**, not `master` — see below).
3. Current official Hedera/Hiero developer docs.
4. Current `hashgraph/asset-tokenization-studio` source/docs.
5. Executable test/testnet behavior.
6. PolicyProbe decisions recorded in [`docs/DECISIONS.md`](DECISIONS.md) after validation.
7. `Hedera_PolicyProbe_ETHOnline_2026_Winning_Package.md` — a strategy brief, **not** guaranteed
   technical truth. It is off the true wire architecture in places (see
   [`docs/HARNESS_ARCHITECTURE.md`](HARNESS_ARCHITECTURE.md) for what was corrected).

Never keep an assumption from the winning-package doc just because it reads well.

## Non-negotiable rules

- **Upstream-first quality.** Every Harness-side change must look like something a
  hedera-dev maintainer would merge: minimal scope, tests, docs, no PolicyProbe
  branding inside generic internals, compatible with `dev`.
- **Competitor-collision rule.** Before writing Harness code, re-check open PRs/issues
  (`gh pr list --repo hedera-dev/hedera-harness`). Do not duplicate active work. Current
  audit: [`docs/COMPETITOR_AUDIT.md`](COMPETITOR_AUDIT.md) — re-run before every Harness milestone.
- **Deterministic behavioral-postcondition thesis.** The gap we fill: Harness can prove a
  real signed transaction landed (chainSigner + EVALUATE), and upcoming PRs will prove
  entities/metadata exist on Mirror Node (#39, #43). Nothing in current `dev` lets a
  recipe author declare "execute this action, then a **non-LLM-judged** check must hold
  (mustSucceed/mustRevert, balance delta, actor X forbidden)" and get that back as a typed,
  repair-loop-compatible finding. Re-validate this before every milestone; if it stops being
  true, log the evidence in DECISIONS.md and pivot — don't build the obsolete version.
- **Strict testing.** Every feature ships with unit + negative/false-positive tests. Run the
  full upstream suite (`npm test` in the harness fork) before and after every change.
- **No fabricated evidence.** A PASS must mean the asserted behavior actually happened. Never
  turn ambiguous/infra-failure evidence into a PASS or into a false app-policy FAIL — see the
  ASSERT/`eval-infra` precedent in `promptBuilder.ts`.
- **No silent weakening of assertions.** Never loosen an assertion or edit a test to make it
  pass without logging the reasoning in DECISIONS.md.
- **Frontend is secondary** until the core deterministic-assertion capability works end-to-end
  against real testnet. See priority order in [`docs/EXECUTION_PLAN.md`](EXECUTION_PLAN.md).
- **Git discipline.** Small, meaningful commits throughout, not one giant dump. No secrets,
  keys, mnemonics, `.env`, or run artifacts ever committed — see `.gitignore`.
- **Never claim legal/regulatory compliance.** Say "behavioral conformance" / "policy
  postcondition" / "deterministic assertion." Never "compliant," "certified," "regulator-approved."
- **Never expose secrets** in output, commits, or docs. If a credential is found, report only
  that it exists/is missing.
- **Autonomy.** Continue unblocked work without asking "what next" when
  [`docs/EXECUTION_PLAN.md`](EXECUTION_PLAN.md) already defines the next step. Put anything
  that genuinely needs a human in [`docs/MANUAL_ACTIONS.md`](MANUAL_ACTIONS.md) and keep moving.
  Never publish repos, open upstream PRs, deploy beyond testnet, or post publicly without
  explicit approval for that specific action.

## Repository topology

Two repositories, deliberately:

- **This repo (`policy-probe`, GitHub: `PolicyProbe`)** — the ETHGlobal submission: docs,
  fixtures, ATS demo glue, judge console, evidence, technical note.
- **`../hedera-harness`** — a local clone of `hedera-dev/hedera-harness`, forked to
  `manovHacksaw/hedera-harness` (`origin`; `upstream` = `hedera-dev/hedera-harness`),
  checked out on branch `policyprobe/deterministic-onchain-postconditions` off `dev` at
  base SHA `587a2f335c29835e9505d9f13e230b8d677c0674`. All upstream-quality code changes
  happen there, kept clean of demo/branding content. Rationale and alternatives considered:
  [`docs/DECISIONS.md`](DECISIONS.md) ADR-0002.

## Status and handoff

Always read [`docs/STATUS.md`](STATUS.md) first in a new session — phase, base SHA, what
passes, blockers, next 3 tasks. Update it after every milestone.
