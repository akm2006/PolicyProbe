---
name: policyprobe-upstream-review
description: Use before any commit intended for the upstream Hedera Harness PR — a pre-flight review pass for PR-readiness.
---

# PolicyProbe: pre-upstream review

Defect-first review, in this order:

1. **Scope size** — is this the smallest coherent diff, or did unrelated cleanup creep in?
2. **Collision** — re-check `docs/COMPETITOR_AUDIT.md` freshness and the current `dev` HEAD;
   flag anything that now overlaps a merged or newly-opened PR.
3. **API/naming** — does it match existing Harness conventions (`ValidationFinding` shape,
   `category` values, `validate*` function naming, recipe schema style in
   `docs/authoring-a-recipe.md`)?
4. **Tests** — positive and negative cases present; full suite (`npm test`) passes, not just
   the new tests.
5. **Docs** — recipe doc updated, example included, before/after behavior stated plainly.
6. **Dependencies** — no new dependency without a one-line justification.
7. **Branding** — zero PolicyProbe-specific naming/marketing inside `src/`/`prompts/`; the
   upstream-facing name is generic ("deterministic on-chain postcondition assertions").
8. **Maintainability** — would a hedera-dev maintainer understand this diff without the
   hackathon context? Read the PR description as if you're them.

Report findings the same way `ReportFindings`/code-review would: most severe first, each with
a concrete failure scenario, not vague style comments.
