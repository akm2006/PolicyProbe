# ETHOnline 2026 submission notes

PolicyProbe was built for ETHOnline 2026 and targets Hedera's open-source Harness and asset
tokenization themes. The maintained project description is the root README; this file keeps the
event-specific material out of the normal product documentation.

## Submission assets

- Public PolicyProbe repository URL
- [Open Harness PR #74](https://github.com/hedera-dev/hedera-harness/pull/74), targeting `dev`
- [Passing Ubuntu CI](https://github.com/akm2006/PolicyProbe/actions/runs/34677303566)
- Demo video with human narration
- Testnet evidence in `fixtures/ats-bond/EVIDENCE.md`
- AI disclosure in `docs/AI_USAGE.md`

## Demo sequence

1. Show the recipe assertion and named attacker actor.
2. Run the assertion against the bond with whitelist enforcement disabled.
3. Show the typed failure and its successful on-chain transaction evidence.
4. Run the same assertion against the corrected bond.
5. Show the confirmed on-chain revert and passing verdict.
6. Briefly show the six-policy ATS suite and the upstream Harness diff.

Before submission, ensure the final web app and README are available from the public repository,
record the 2–4 minute demo, select the Hedera Open Source prize in the ETHGlobal form, and submit
before the event deadline. Keep the pre-existing work and AI-use disclosures accurate.
