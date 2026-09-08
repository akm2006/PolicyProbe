# Research Sources

Primary sources, pinned as of the date checked. Re-verify anything older than a few days
before relying on it for an implementation decision — this event moves fast.

| Source | URL | Pinned ref | Date checked | Supports |
|---|---|---|---|---|
| ETHOnline 2026 Hedera prize page | https://ethglobal.com/events/ethonline2026/prizes/hedera | live page | 2026-09-08 | Track requirements/prizes, §HACKATHON_REQUIREMENTS |
| ETHOnline 2026 event details/rules | https://ethglobal.com/events/ethonline2026/info/details | live page | 2026-09-08 | Deadline, video/AI-disclosure/repo rules |
| Hedera Harness repo | https://github.com/hedera-dev/hedera-harness | `dev` @ `587a2f335c29835e9505d9f13e230b8d677c0674` | 2026-09-08 | Architecture, base SHA |
| Harness PR #39 | https://github.com/hedera-dev/hedera-harness/pull/39 | open, base `dev` | 2026-09-08 | Mirror Node reader for CHAIN, infra-failure classification |
| Harness PR #40 | https://github.com/hedera-dev/hedera-harness/pull/40 | open, base `dev` | 2026-09-08 | ASSERT-stage contract-security validator (Slither) |
| Harness PR #43 | https://github.com/hedera-dev/hedera-harness/pull/43 | open, base `dev` | 2026-09-08 | "Tier 2.5" Mirror Node existence/metadata validator |
| Harness PR #44, #45, #46 | .../pull/44, /45, /46 | open, base `dev` | 2026-09-08 | doctor x402 check, Tier 0-1 tinybar-precision check, timeout-exitcode fix — unrelated to our surface |
| Harness issues #8, #41 | .../issues/8, /41 | open | 2026-09-08 | HOL Guard validator idea; ASSERT clean-exit-timeout bug — unrelated |
| Asset Tokenization Studio docs | https://docs.tokenization-studio.hedera.com/ | live | not yet fetched | ATS feature surface — fetch before designing the bond fixture |
| Asset Tokenization Studio repo | https://github.com/hashgraph/asset-tokenization-studio | not yet pinned | not yet fetched | ATS contracts/SDK — pin exact commit before fixture work |
| Hedera Skills repo | https://github.com/hedera-dev/hedera-skills | referenced by Harness `skills-index.json` | not yet fetched | Vendored skills Harness's generator can pick |

## Notes / corrections against the winning-package doc

- The doc's "Tier 0–1 / Tier 2 / Tier 3 / Tier 3.5" terminology is **not literal source
  vocabulary** (current stage names in code: `GENERATE`, `ASSERT`, `SMOKE`, `EVALUATE`, with
  `chainValidation`/`chainSigner` cutting across SMOKE+EVALUATE) — but it **is** how PR authors
  informally refer to stages (PR #39 says "Tier 3.5", PR #43 says "Tier 2.5", PR #40 says
  "Tier 1.5"), so it's safe as *conversational* shorthand, not as an API/doc claim.
- The doc's claim that PR #39/#40 reduce our novelty is directionally right but needs the
  sharper distinction now recorded in `docs/COMPETITOR_AUDIT.md`: neither PR executes an
  action and asserts its *outcome* against a *declared expectation*, and neither supports
  *multiple adversarial actor identities* in one assertion.
- ATS docs/repo were **not yet fetched** in this bootstrap pass — do this before any ATS
  fixture design work; do not assume the winning package's bond feature list is current.
