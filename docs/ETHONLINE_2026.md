# ETHOnline 2026 submission notes

PolicyProbe was built for ETHOnline 2026 and targets Hedera's open-source Harness and asset
tokenization themes. The maintained project description is the root README; this file keeps the
event-specific material out of the normal product documentation.

## Submission assets

- Public PolicyProbe repository URL
- Public Harness fork branch and open PR targeting `hedera-dev/hedera-harness:dev`
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

Before submission, replace any placeholder links after publication, run Linux CI on both public
branches, open the upstream PR, record the final video, and verify the event form requirements.
