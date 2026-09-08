# Submission Checklist

Final gate before the 2026-09-13 12:00 PM EDT deadline. Derived from
`docs/HACKATHON_REQUIREMENTS.md` and `docs/ACCEPTANCE_CRITERIA.md` — don't duplicate detail,
just check off here.

## Harness track

- [ ] Core deterministic assertion mechanism implemented and tested in the Harness fork
- [ ] No overlap with active PRs (`docs/COMPETITOR_AUDIT.md` re-checked within 48h of submission)
- [ ] Failed assertions become structured `ValidationFinding`s, repair-loop compatible
- [ ] Full upstream test suite passes (`npm test` in `../hedera-harness`)
- [ ] Docs + example recipe included in the fork
- [ ] Upstream PR opened (needs approval — `docs/MANUAL_ACTIONS.md` #2) OR fork+branch public
      and linked, per track rules ("public repo **or** PR link" is acceptable)
- [ ] Before/after developer-experience evidence written up

## ATS track

- [ ] ATS-issued bond live on Hedera testnet
- [ ] Issuance/configuration demonstrated
- [ ] At least one lifecycle operation demonstrated for real
- [ ] KYC/freeze/pause (or equivalent compliance control) actually exercised, not just described
- [ ] HashScan links / relevant tx IDs recorded

## Demo

- [ ] Real broken-policy scenario captured
- [ ] Real testnet evidence (tx IDs) shown on screen
- [ ] Repair shown end-to-end
- [ ] Same adversarial assertion passes after repair
- [ ] Video 2–4 min (Harness) / ≤5 min (ATS), ≥720p, real human voice, no artificial speed-up

## Repo / docs

- [ ] Clean, incremental git history in both repos (no mega-commits)
- [ ] README optimized for a judge reading for ~60 seconds
- [ ] Architecture diagram present
- [ ] Threat model / limitations section present, no compliance overclaim anywhere
- [ ] `docs/AI_USAGE.md` written, specific and honest
- [ ] PR link (or fork+branch link) prominent in README
- [ ] Every "how to run" command in the README actually tested as written

## Logistics

- [ ] Both repos set public (`docs/MANUAL_ACTIONS.md` #3)
- [ ] ETHGlobal form submitted with up to 3 partner prizes selected
      (`docs/MANUAL_ACTIONS.md` #4)
- [ ] Submitted before 2026-09-13 12:00 PM EDT, no later
