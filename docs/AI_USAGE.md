# AI Usage Disclosure

Required by ETHOnline 2026's submission rules (`docs/HACKATHON_REQUIREMENTS.md`): "clearly
document where and how AI tools were used," specific enough to identify which code sections or
assets were AI-generated, so judges can weigh AI assistance against over-reliance.

**Read this section first, honestly, before anything else here:** the ETHOnline rule states AI
should *assist* development, not *create entire projects*, and that over-reliance may
disqualify work from partner prizes and finalist consideration. Virtually all code, tests, and
documentation in both repositories were authored end-to-end by Claude Code (Anthropic's Sonnet 5
model) across a small number of long agentic sessions, not hand-written by the human collaborator
and then AI-assisted. The human's role was: providing the initial strategic brief
(`Hedera_PolicyProbe_ETHOnline_2026_Winning_Package.md`), making the calls only a human could —
approving repository creation, supplying and authorizing use of live Hedera testnet credentials,
choosing among presented tradeoffs at real decision points (e.g. "how should the remaining time
be allocated between the Harness and ATS tracks," answered by explicitly directing the project
toward production-grade completeness over a deadline-driven cut), and reviewing/steering output
throughout the conversation. Every commit, every test, every design document was written by the
AI session. This is disclosed here plainly rather than minimized, because the alternative is
misrepresenting the actual balance of authorship — decide before submission whether this
balance is one you're comfortable presenting for the partner-prize criteria, and if not,
treat the remainder of the timeline as an opportunity to increase direct human authorship
in specific places (the README's judge-facing narrative and the demo video script/narration are
natural candidates, since narration must be a real human voice regardless).

## What Claude Code did

- All source code in the `hedera-harness` fork's working branch (`chainValidation.actors`/
  `chainValidation.assertions` schema, the Mirror Node evidence reader, the execution/evaluation
  engine, actor-signer provisioning, `ValidationFinding` category extensions, repair-prompt
  template updates) and every accompanying test.
- All source code in `fixtures/ats-bond/` (the bond-deployment script ported from ATS's own
  Apache-2.0-licensed `scripts/domain/factory/deployBondToken.ts`, the policy-action scripts,
  the policy-suite and killer-demo drivers).
- All project documentation in `docs/` (charter, architecture notes, ADRs, acceptance criteria,
  status tracking, this file), `CLAUDE.md`/`AGENTS.md`, and the `.claude/skills`/`.claude/agents`
  configuration.
- Research: reading Hedera Harness's and Asset Tokenization Studio's source code, GitHub PRs/
  issues, and documentation to validate (and in places correct) the strategic brief's technical
  assumptions before building anything.
- Execution: real Hedera testnet transactions (bond deployment, role grants, transfers,
  freeze/pause operations) run by the agent using credentials the human explicitly supplied and
  authorized for this purpose.

## What the human did

- Wrote the original strategic brief that set the project's direction and thesis.
- Approved the bootstrap (repository creation, initial architecture/topology decisions).
- Supplied real Hedera testnet operator credentials and authorized their use for real
  transactions — never generated or requested unprompted by the agent.
- Made the explicit call, when presented with a genuine tradeoff (ATS integration complexity
  discovered mid-session vs. remaining time), to prioritize production-grade completeness.
- Directed commit-attribution conventions and reviewed status/progress at each major milestone
  throughout the conversation.
- Has not yet written the demo video narration or the final submission copy — both remaining,
  both requiring genuine human authorship regardless of this disclosure (no AI voiceover is a
  hard ETHOnline rule).

## What's independently verifiable, regardless of who wrote the code

The claims in `docs/STATUS.md`, `docs/BENCHMARK.md`, and `fixtures/ats-bond/EVIDENCE.md` are
backed by real, independently-checkable evidence — Hedera testnet transaction hashes, Mirror
Node records, passing test suite output — not by either party's say-so. A judge can verify the
technical claims without trusting either the AI's or the human's account of them.

## Still to do before submission

- Decide, per the honest framing above, whether additional direct human authorship is needed
  in specific submission-facing artifacts before this disclosure is submitted as-is.
- Record the demo video with real human narration (hard requirement, not a disclosure nuance).
- Finalize this file once the README, technical note, and submission copy exist, since those
  are additional artifacts this disclosure will need to cover.
