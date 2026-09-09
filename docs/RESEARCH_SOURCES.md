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
| Asset Tokenization Studio docs | https://docs.tokenization-studio.hedera.com/ | live | 2026-09-09 | ATS feature surface, SDK usage patterns |
| Asset Tokenization Studio repo | https://github.com/hashgraph/asset-tokenization-studio | `main`, release `v.8.0.0-ats` (2026-06-24) | 2026-09-09 | Contracts/scripts/roles referenced by the bond fixture |
| `@hashgraph/asset-tokenization-contracts` (npm) | https://www.npmjs.com/package/@hashgraph/asset-tokenization-contracts | `8.0.0` | 2026-09-09 | Typechain factories the fixture calls directly (Factory, ResolverProxy, Kyc/Freeze/Pause/ControlList/AccessControl/Transfer facets) |
| Existing ATS testnet deployment | `packages/ats/contracts/deployments/hedera-testnet/newBlr-2026-06-12T11-19-42-198.json` in the ATS repo | commit as of 2026-09-09 fetch | 2026-09-09 | Factory `0.0.9213391` / BLR `0.0.9212226` — the fixture issues bonds through this existing factory rather than deploying its own system; see `docs/DECISIONS.md` |
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
- ATS docs/repo fetched 2026-09-09. The winning package's assumption that ATS is a simple
  SDK call away was wrong: the officially-documented `Network.connect` flow is wallet-only
  ("Wallet: only metamask is compatible right now" per the SDK README), unusable headlessly.
  The fixture instead calls the published `@hashgraph/asset-tokenization-contracts` typechain
  factories directly with a plain ethers signer — the same pattern ATS's own
  `scripts/domain/factory/deployBondToken.ts` uses internally, just not exposed as a published
  API. See `docs/DECISIONS.md` and `fixtures/ats-bond/README.md`.
- ATS's internal-KYC mechanism models W3C-style verifiable credentials with a registered
  issuer subsystem (`SSI_MANAGEMENT`) — deeper than this fixture needed. Used the
  whitelist/control-list compliance mechanism instead (same policy shape, well-documented,
  much simpler). Not a claim that internal KYC doesn't work — just out of scope here.
- Three ATS role-naming surprises, found empirically by decoding real revert `error_message`
  data: `grantKyc` needs `ROLE_KYC` not `ROLE_KYC_MANAGER`; `addToControlList`/
  `removeFromControlList` need `ROLE_CONTROL_LIST` not `ROLE_CONTROL_LIST_MANAGER`; `pause`/
  `unpause` need `ROLE_PAUSER` not `ROLE_PAUSE_MANAGER`. Only `ROLE_FREEZE_MANAGER` behaves as
  its name suggests. See `fixtures/ats-bond/EVIDENCE.md`.
