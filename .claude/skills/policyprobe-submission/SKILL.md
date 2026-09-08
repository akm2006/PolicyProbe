---
name: policyprobe-submission
description: Use for README, demo script, judge console copy, technical note, or ETHGlobal submission-field work.
---

# PolicyProbe: submission-facing work

1. **Judge-first clarity** — a judge should get the one-line thesis in ~10 seconds and the
   before/after gap in ~30 (see winning-package §22 for the target pacing; verify it still
   matches what's actually built before reusing its exact numbers/claims).
2. **Every claim traceable** — a code path, a passing test, or a real testnet transaction id.
   No claim that isn't backed by something in `docs/STATUS.md` or the repo itself.
3. **Distinguish the Harness contribution from the ATS demonstration** explicitly — the PR is
   the product; ATS is the strongest proof case, not the invention (`docs/PROJECT_CHARTER.md`).
4. **Map explicitly to both tracks** using the verified requirements in
   `docs/HACKATHON_REQUIREMENTS.md`, not the winning-package draft numbers if they've since
   diverged.
5. **No empty marketing.** Cut any sentence that isn't a claim you could point at evidence for.
6. **Demo narrative is failure → repair → pass**, with real transaction evidence at the failure
   step, not just at the end.
7. **PR link + evidence up front** — a judge should find the upstream PR/fork link and the
   testnet evidence within the first screen of the README.
8. Never write "legally compliant," "regulator-approved," or "certified" anywhere in submission
   copy — see `docs/OPERATING_CONTRACT.md`.
