# Execution Plan

Deadline: **2026-09-13, 12:00 PM EDT** (see `docs/HACKATHON_REQUIREMENTS.md`). Today: 2026-09-08.
~5 days. Priority order below is the critical path — do not reverse it for branding/frontend.

## Phases

1. **Audit Harness + active PRs** — DONE this session. Outputs: `docs/HARNESS_ARCHITECTURE.md`,
   `docs/COMPETITOR_AUDIT.md`, base SHA pinned, baseline `npm test` green (195/195).
2. **Reproduce/characterize the gap executably** — smallest possible script/test against the
   real Harness fork demonstrating: (a) EVALUATE-only chain checks are LLM-judged, not code-
   judged; (b) no finding category exists for "action outcome vs. declared expectation." This
   is the "smallest executable reproduction" milestone referenced in the bootstrap brief —
   next concrete task.
3. **Define smallest generic postcondition primitive** — lock the recipe schema draft in
   `docs/HARNESS_ARCHITECTURE.md` into a real TypeScript interface + JSON schema, reviewed via
   `policyprobe-upstream-review` before writing implementation.
4. **Implement transaction-outcome assertion** (`mustSucceed`/`mustRevert`) end-to-end against
   real testnet, with unit + integration tests, in the Harness fork.
5. **Integrate assertion failures into structured findings**, new category + infra sibling,
   wired through `promptBuilder.ts`'s existing structural/actionable split.
6. **Prove repair-loop compatibility** — a deliberately-broken fixture, real FAIL, real repair
   prompt, real fix, real rerun, finding id resolves to fixed.
7. **Add balance/state assertion.**
8. **Add HTS/ATS convenience adapter** (kyc/freeze/pause sugar) — first point ATS repo/docs get
   fetched for real (not yet done this session — see `docs/RESEARCH_SOURCES.md`).
9. **Adversarial/security review** — `security-validator` subagent pass.
10. **Real Hedera testnet proof** — full assertion suite against deployed fixture.
11. **ATS bond fixture** — issue on testnet, wire the compliance adapters, deliberately break
    one rule for the demo.
12. **Before/after benchmark** — see `docs/PROJECT_CHARTER.md`/winning-package §24 metrics;
    keep raw results, no cherry-picking.
13. **Upstream PR polish** — `policyprobe-upstream-review` pass, rebase, docs, example recipe.
14. **Judge UI** — minimal evidence console only after 1–13 work for real.
15. **README/docs** — `policyprobe-submission` pass.
16. **Technical note** (only if time remains after 1–15).
17. **Demo video(s).**
18. **ETHGlobal submission package.**
19. **Public promotion** (only after core package stable, and only with explicit approval).

## Milestone gate (every phase)

A phase is complete only when: implementation exists; relevant tests pass (positive *and*
negative cases); the full upstream Harness suite still passes; `docs/STATUS.md` is updated;
any material architecture choice is logged in `docs/DECISIONS.md`; there is a coherent, scoped
commit (not a mega-commit).

## Immediate next task (see `docs/STATUS.md`)

Phase 2: build the smallest executable reproduction of the gap in the Harness fork —
before writing any new assertion code.
