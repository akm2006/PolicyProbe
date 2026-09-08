# Hackathon Requirements (verified 2026-09-08)

Source: `docs/RESEARCH_SOURCES.md` (ETHGlobal prize + rules pages, fetched live).
**Deadline is hard — re-verify if this file is more than ~3 days old.**

## Global ETHOnline 2026

- **Final submission deadline: Sunday, September 13, 2026, 12:00 PM EDT.** No late submissions.
- Demo video: **2–4 minutes**, ≥720p, no mobile-phone recording, **no AI voiceover / TTS**, no
  artificial speed-up.
- **From-Scratch rule:** all project work must begin after the hackathon start. Pre-event code
  and designs are prohibited (public libraries excepted). Starting before the event forfeits
  partner-prize/finalist eligibility.
- **AI disclosure required:** must document where/how AI tools were used, down to which code
  sections/assets were AI-generated. AI should assist, not build the whole project — see
  `docs/AI_USAGE.md` (create alongside the README before submission).
- **Public repo required**, clear version-control history distinguishing new vs. reused work.
- Judging: finalists get 7 minutes live (4 demo + 3 Q&A); partners otherwise judge
  asynchronously. Up to 3 partner-prize selections per team.
- Required submission fields: title, description, repo link, 2–4 min video, up to 3 partner
  prizes.

## Track: Hedera — Open Source: Improve the Hedera Harness

- **Prize:** $2,000 total, up to 2 teams × $1,000.
- **Requirement:** meaningful contribution to the existing Harness, or a new harness built on
  its foundations. Public GitHub repo or open PR link, with README/PR description explaining
  the problem solved.
- **Bonus:** new service coverage, tests, documentation, examples, clear before/after
  developer-experience evidence.
- An **open, unmerged PR is explicitly acceptable** per the prize copy ("public GitHub repo
  **or** PR link").

## Track: Hedera — Tokenization of Anything

- **Prize:** $6,000 total, up to 3 teams × $2,000.
- **Requirement:** use Asset Tokenization Studio to issue/manage a tokenized asset, deployed
  on Hedera testnet. **Demo video ≤5 minutes** showing issuance, configuration, and at least
  one lifecycle operation. Public GitHub repo.
- **Bonus:** secondary markets, compliance controls, custom fee schedules, oracle integration,
  scheduled transactions.
- HashScan verification and explicit KYC/freeze/pause exercising were in the winning-package
  draft but were **not independently confirmed word-for-word** in the fetched prize copy —
  treat "compliance controls" as the bonus category that covers KYC/freeze/pause, and still do
  it (it is also central to our own thesis), but don't over-claim it as a hard requirement in
  submission copy without re-checking the live page nearer the deadline.

## Track: Continuity (not currently targeted)

- $1,000 for demonstrating substantive new work during the event (new features, new Hedera
  services, or significant architecture change). Not a primary target; PolicyProbe's own
  development history should satisfy this incidentally if we choose to select it — decide
  near submission time, don't design for it.

## Hard acceptance gates derived from the above

- [ ] All commits in both repos dated after this session's start (From-Scratch).
- [ ] Public repo or open PR for the Harness contribution before the deadline.
- [ ] ATS asset actually deployed + demoed on **testnet** (not simulated).
- [ ] Two demo videos or one video covering both tracks, each ≤ the relevant limit, real
      human voice, ≥720p.
- [ ] `docs/AI_USAGE.md` written before submission, naming tools and scope honestly.
- [ ] Nothing in submission copy claims legal/regulatory compliance.
