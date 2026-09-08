# CLAUDE.md

Canonical operating contract: [`docs/OPERATING_CONTRACT.md`](docs/OPERATING_CONTRACT.md) — read it
first, every session. This file only adds Claude-Code-specific wiring.

## Fresh-session bootstrap

1. Read `docs/OPERATING_CONTRACT.md`, then `docs/STATUS.md`.
2. Re-check `docs/COMPETITOR_AUDIT.md` freshness (date-stamped) before touching Harness code —
   re-run `gh pr list --repo hedera-dev/hedera-harness --state open` if it's more than a
   couple of days stale.
3. Continue the next task in `docs/EXECUTION_PLAN.md`. Don't ask what to do next if it's
   already there; do ask (once, narrowly) if genuinely blocked or about to do something
   irreversible/public.

## Project-local configuration installed here

- **Skills** (`.claude/skills/*/SKILL.md`, auto-discovered by name):
  `policyprobe-harness`, `policyprobe-onchain-validation`, `policyprobe-upstream-review`,
  `policyprobe-submission`. Invoke explicitly with `Skill` when the trigger in each
  SKILL.md's description matches the task, or let normal skill matching pick them up.
- **Subagents** (`.claude/agents/*.md`, read-only, use via `Agent` with the matching
  `subagent_type`): `harness-researcher`, `upstream-reviewer`, `security-validator`,
  `demo-auditor`. Each is read-only by design — they report, they don't edit. Only spawn
  one when its specific review/research angle is actually needed, not by default.
- No project-level MCP servers are configured. See `docs/DECISIONS.md` ADR-0003 for why
  (Harness already owns Playwright for its own SMOKE/EVALUATE stages — a competing
  project-level Playwright MCP would be redundant and could conflict).

## Two working directories

- `/Users/manobendramandal/Desktop/code/policy-probe` — this repo, the submission.
- `/Users/manobendramandal/Desktop/code/hedera-harness` — sibling clone of the Harness fork
  (`origin` = `manovHacksaw/hedera-harness`, `upstream` = `hedera-dev/hedera-harness`),
  branch `policyprobe/deterministic-onchain-postconditions`. Harness-side implementation,
  tests, and the eventual PR live there. Do not vendor it into this repo.

## Attribution

Commits from Claude Code sessions in **this** repo carry no co-author trailer per explicit
user instruction for this project — do not add `Co-Authored-By` lines here. (This overrides
the general Claude Code default; it applies to `policy-probe` and to the `hedera-harness`
fork, both maintained under this same instruction.)
