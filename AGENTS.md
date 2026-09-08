# AGENTS.md

Canonical operating contract: [`docs/OPERATING_CONTRACT.md`](docs/OPERATING_CONTRACT.md) — read it
first, every session. This file only adds Codex-specific wiring.

## Fresh-session bootstrap

1. Read `docs/OPERATING_CONTRACT.md`, then `docs/STATUS.md`.
2. Re-check `docs/COMPETITOR_AUDIT.md` freshness before touching Harness code (`gh pr list
   --repo hedera-dev/hedera-harness --state open`).
3. Continue the next task in `docs/EXECUTION_PLAN.md` autonomously; only stop for items in
   `docs/MANUAL_ACTIONS.md` or a genuinely irreversible/public action.

## Project-local configuration

This session's Codex CLI build has no confirmed project-local "skill" or "subagent"
directory convention distinct from `AGENTS.md` — do not invent one. The equivalent guidance
Claude Code loads as `.claude/skills/*/SKILL.md` is written in plain form under `docs/` and
is readable/followable directly:

- Harness work → follow `.claude/skills/policyprobe-harness/SKILL.md` as a checklist.
- On-chain assertion/testnet work → `.claude/skills/policyprobe-onchain-validation/SKILL.md`.
- Pre-PR review → `.claude/skills/policyprobe-upstream-review/SKILL.md`.
- README/demo/submission work → `.claude/skills/policyprobe-submission/SKILL.md`.

Treat those files as reference checklists, not auto-invoked tooling, in this environment.
For research/review passes that Claude Code would hand to a read-only subagent
(`.claude/agents/*.md`), do the same pass yourself sequentially and record findings the
same way (a short written report, not code edits) before proceeding.

## Two working directories

- `/Users/manobendramandal/Desktop/code/policy-probe` — this repo, the submission.
- `/Users/manobendramandal/Desktop/code/hedera-harness` — sibling clone of the Harness fork
  (`origin` = `manovHacksaw/hedera-harness`, `upstream` = `hedera-dev/hedera-harness`),
  branch `policyprobe/deterministic-onchain-postconditions`. Harness-side implementation,
  tests, and the eventual PR live there.

## Attribution

Do not add any AI co-author trailer to commits in this repo or in the `hedera-harness` fork.
