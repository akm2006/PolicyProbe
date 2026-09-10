# Manual Actions

Only items that genuinely need the human. Everything else proceeds autonomously per
`docs/EXECUTION_PLAN.md`. Each item: why needed, when it blocks, exact steps, expected result.

## 1. Hedera testnet operator account + funding — ✅ DONE (2026-09-08)

**Why:** `chainValidation` (and any real assertion run) requires
`HEDERA_OPERATOR_ID` / `HEDERA_OPERATOR_KEY` (ECDSA) in the shell environment — an existing,
funded testnet account. Never generated or funded by the agent.
**Status:** Supplied by the user this session, verified read-only against real testnet
(`AccountBalanceQuery`): account `0.0.10418936` is live, balance 1000 ℏ, EVM address derived
from the key matches the one provided (`0x5edbc5e7e9100276e4c4f0d6c405fe4ad3b2b668`) —
account/key/address are consistent.
**Where it lives:** `~/.hedera-testnet.env` (mode `600`, home directory — outside both git
repos, cannot be accidentally committed; not inside `policy-probe` or `hedera-harness`). Any
session needing real testnet execution should `source ~/.hedera-testnet.env` first, never
re-request or re-paste the key. The raw key is never written into either repo, never logged
in a git-tracked file, and is not repeated in docs beyond this pointer.
**Unblocks:** Phase 4 onward (real testnet execution) in `docs/EXECUTION_PLAN.md`.

## 2. Approve opening the upstream Hedera Harness PR

**Why:** Publishing to `hedera-dev/hedera-harness` is an outward-facing, hard-to-reverse
action gated by `docs/OPERATING_CONTRACT.md`.
**Blocks:** Phase 13 (upstream PR polish) completion / submission.
**Steps:** review the branch `policyprobe/deterministic-onchain-postconditions` in
`manovHacksaw/hedera-harness` when it's ready, say "open the PR."
**Expected result:** PR opened from the fork against `hedera-dev/hedera-harness:dev`.

## 3. Approve making `PolicyProbe` (and the Harness fork) public

**Why:** repos were created without a stated visibility decision beyond "create it" — currently
private/default; ETHGlobal requires a public repo by submission.
**Blocks:** final submission.
**Steps:** confirm visibility (public) before the deadline; agent can flip it via `gh repo
edit --visibility public` once approved.
**Expected result:** both repos public, reachable from the ETHGlobal submission form.

## 4. ETHGlobal submission form

**Why:** account-bound action on ethglobal.com.
**Blocks:** final submission only.
**Steps:** title, description, repo link(s), demo video(s), select up to 3 partner prizes
(Hedera Harness + Hedera Tokenization of Anything).
**Expected result:** submission recorded before 2026-09-13 12:00 PM EDT.

## 5. Hedera Discord / sponsor conversation

**Why:** `docs/PROJECT_CHARTER.md`/winning-package §15 recommends a maintainer sanity-check on
architecture placement before a large PR.
**Blocks:** nothing critical-path; do independently of engineering work.
**Steps:** post the drafted technical question (see winning-package §15) in the Hedera Discord
once the recipe schema draft in `docs/HARNESS_ARCHITECTURE.md` is locked.
**Expected result:** maintainer steer on extension point, or silence (proceed on our own
judgment if no timely response — don't block the critical path on it).

## 6. Demo video recording/narration

**Why:** requires a real human voice — "no AI voiceover" is a hard rule.
**Blocks:** final submission.
**Steps:** record once the repair-loop demo (Phase 6) and ATS fixture (Phase 11) are real and
reproducible. Script skeleton: winning-package §16.
**Expected result:** 2–4 min (Harness) and/or ≤5 min (ATS) video(s), ≥720p.

## 7. X / social publishing

**Why:** public-facing, outward publishing action.
**Blocks:** nothing critical-path; only do after core package is stable, and only on request.
**Steps:** n/a until requested.
**Expected result:** n/a.

## 8. Decide on AI-authorship balance before submission

**Why:** ETHOnline's AI disclosure rule says AI should assist, not create entire projects, and
over-reliance may disqualify work from partner prizes. `docs/AI_USAGE.md` honestly discloses
that nearly all code/docs in both repos were authored end-to-end by Claude Code — this is a real
eligibility consideration, not a formality.
**Blocks:** final submission — this needs a decision, not silence.
**Steps:** read `docs/AI_USAGE.md` in full, decide whether the current authorship balance is
one you want to present as-is, or whether specific submission-facing artifacts (README
narrative, technical note, demo script) should get more direct human authorship first.
**Expected result:** either explicit sign-off on the current disclosure, or specific direction
on what to rewrite by hand before submission.
