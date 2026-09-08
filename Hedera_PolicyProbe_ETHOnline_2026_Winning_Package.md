# PolicyProbe / StateProof — ETHOnline 2026 Winning Package

> **AI can build the app. It should not grade its own onchain behavior.**

**Working name:** PolicyProbe (formerly StateProof). “State proof” already has an established meaning in Hedera, so PolicyProbe is the safer submission name unless a better brand is chosen.

## 1. Core Project Thesis

### One-line pitch

**PolicyProbe extends Hedera Harness with deterministic onchain behavioral assertions, so AI-built Hedera applications can prove that critical rules actually hold on testnet — not merely that a transaction happened.**

### The gap

Hedera Harness already has a strong validation ladder:

- Tier 0–1: deterministic/build checks
- Tier 2: Playwright/UI gate
- Tier 3: adversarial semantic validation
- Tier 3.5: a funded ephemeral signer performs real Hedera testnet transactions, with chain evidence

The missing layer is **domain-level onchain postconditions**.

A real transaction existing does not prove that the application enforced the intended rule.

Examples:

- an unverified investor **must not** receive a regulated bond
- a frozen holder **must not** transfer
- only the compliance role may freeze an investor
- a coupon distribution must change holder balances by the expected amount
- a paused security must reject transfers
- a redemption must burn the expected bond units

PolicyProbe makes these behaviors explicit, executes them against real Hedera testnet state, independently verifies the result, and converts violations into structured Harness findings that can enter the existing repair loop.

### Memorable pitch

> **Hedera Harness can prove that the AI shipped a transaction. PolicyProbe proves that the transaction obeyed the policy.**

---

# 2. Current ETHOnline Prize Strategy

## Primary target — Hedera: Open Source — Improve the Hedera Harness

**Prize pool:** $2,000, up to 2 teams receiving $1,000.

Qualification:

- meaningful contribution to Hedera Harness, or a new harness built on its foundations
- public GitHub repo or open PR
- README/PR description explaining the problem and how to run it
- demo video <= 5 minutes

Extra points include:

- new coverage / better ergonomics
- tests
- documentation
- examples
- clear before/after developer-experience evidence

**Our strategy:** submit a focused, upstreamable Harness PR implementing generic deterministic onchain assertions and structured chain findings.

## Secondary target — Hedera: Tokenization of Anything

**Prize pool:** $6,000, up to 3 teams receiving $2,000.

Qualification:

- use Asset Tokenization Studio (ATS) to issue/manage a tokenized asset
- deploy/demo on Hedera testnet
- public GitHub repo
- verify contracts on HashScan where applicable
- demonstrate issuance/configuration and at least one lifecycle operation

Extra points include:

- KYC/freeze/transfer restrictions/pause controls
- coupon/dividend distribution
- scheduled transactions
- upstream ATS contributions

**Our strategy:** use an ATS-issued bond as the flagship PolicyProbe fixture. The bond is not the main invention — it is the strongest adversarial test case.

## Why one project can pursue both

ETHGlobal allows selecting up to 3 partner prizes. If a partner has multiple tracks, eligibility across that partner's tracks counts as one partner prize selection. Therefore the same Hedera submission can be designed to satisfy both the Harness and Tokenization tracks.

---

# 3. Critical 2026 Competition Update

Do **not** build generic Mirror Node support or a generic static contract-security scanner as the headline.

As checked during ETHOnline:

- Hedera Harness PR #39 adds a deterministic Mirror Node reader, polling/normalization, and better infrastructure-failure classification.
- Hedera Harness PR #40 adds an opt-in contract-security validator in the ASSERT stage.

Those are adjacent to our idea and reduce the novelty of “we improved chain verification” or “we added security checks.”

### Our defensible gap

PolicyProbe should focus on:

> **Application-specific behavioral invariants verified against real chain state, expressed as reusable Harness assertions and returned as structured repair findings.**

Examples:

- transaction must succeed / must fail
- expected balance delta
- expected role-gated failure
- expected event/state change
- expected KYC/freeze/pause behavior
- expected token lifecycle state

That is meaningfully different from:

- merely reading Mirror Node reliably
- static contract scanning
- browser-based semantic grading

---

# 4. Product Model

## Before PolicyProbe

```text
PRD / spec
    ↓
Coding agent builds feature
    ↓
Harness checks build/UI
    ↓
Semantic validator drives app
    ↓
Tier 3.5 executes real testnet transaction
    ↓
Transaction evidence exists
```

This can establish that something happened onchain.

## After PolicyProbe

```text
PRD / policy
    ↓
Coding agent builds feature
    ↓
Harness normal validation
    ↓
Real testnet transaction(s)
    ↓
POLICYPROBE ASSERTIONS
    ↓
Independent onchain postcondition checks
    ↓
PASS
or
STRUCTURED FINDING → repair prompt → agent fixes → rerun
```

The important new question is:

> **Did the deployed system reach the exact state the policy required — including when an adversary tried to violate it?**

---

# 5. Core Assertion Families

Keep the hackathon MVP narrow and excellent.

## 1. Transaction outcome

Examples:

- `mustSucceed`
- `mustRevert`

Use for:

- blocked transfers
- unauthorized role calls
- paused-token behavior

## 2. State / balance delta

Examples:

- holder balance increases by X
- issuer balance decreases by X
- bond supply decreases by X after redemption

## 3. Authorization boundary

Examples:

- compliance role may freeze
- ordinary investor may not freeze
- issuer role may mint
- unauthorized wallet may not pause

## 4. Hedera / token compliance state

Where supported cleanly by current Harness/Hedera APIs:

- KYC state
- freeze state
- pause state
- token relationship / balance

## 5. Evidence

Every assertion should produce evidence suitable for:

- human review
- machine-readable artifacts
- Harness repair findings
- demo links / transaction IDs

Do not make the frontend responsible for PASS/FAIL.

---

# 6. The ATS Bond Demo

Use a **tokenized corporate bond** because one small asset exercises many meaningful policies.

### Example asset

**Atlas Infrastructure Note 2027**

- token type: bond
- testnet only
- fixed face value
- coupon enabled
- compliance controls enabled
- transferability restricted

### Test actors

- **Issuer** — authorized issuer/minter
- **Alice** — verified investor
- **Bob** — unverified investor
- **Carol** — verified but frozen investor
- **Attacker** — no administrative role

### Policy suite

| Behavior | Expected |
|---|---|
| Mint to authorized path | PASS |
| Transfer to Alice (verified) | PASS |
| Transfer to Bob (unverified) | REJECT |
| Carol transfers while frozen | REJECT |
| Attacker invokes freeze | REJECT |
| Compliance officer freezes holder | PASS |
| Transfer while token paused | REJECT |
| Coupon distribution | Exact expected balance delta |
| Redemption | Expected burn / lifecycle state |

We do not need every row for the MVP. A smaller set working perfectly is better than a broad flaky demo.

---

# 7. Killer Failure Demo

The demo must contain a **real broken policy**, not only green checkmarks.

Example:

Policy:

> Unverified investors must never receive this bond.

Deliberately deploy/configure a broken version where Bob can receive the token.

Run PolicyProbe:

```text
12 behavioral assertions
11 PASS
1 FAIL

FAIL: reject-unverified-holder
Expected: transfer rejected
Observed: transfer succeeded
Evidence: Hedera testnet transaction 0.0.x@...
```

Then show the finding entering the Harness repair loop.

The coding agent fixes the implementation/configuration.

Run the exact same probe again:

```text
12 / 12 PASS
```

That is the central WOW moment.

---

# 8. Upstream PR Strategy

The **upstream PR matters more than the demo website** for the Harness bounty.

## Keep the PR generic

Do **not** make the core PR depend on ATS.

The upstream contribution should add a generally useful Harness capability such as:

- structured chain assertions/postconditions
- deterministic assertion evaluation
- typed evidence/results
- conversion of failed assertions into Harness findings
- documentation + tests + minimal generic example

ATS-specific fixtures can live in the AquaQoS/PolicyProbe project repo or an examples layer unless maintainers explicitly want them upstream.

## Ideal PR shape

Possible title:

> `feat: add deterministic on-chain postcondition assertions to chain validation`

A strong PR should contain:

- focused implementation
- offline unit tests where possible
- a small integration test
- docs
- example recipe/config
- before/after behavior
- no unrelated refactors
- compatibility with current `dev` branch if that is the active integration branch

## Before/after proof

Before:

> Chain validation can show a transaction occurred, but each application must reinvent domain-specific chain-state verification.

After:

> Recipe authors can declare/execute deterministic behavioral postconditions and receive typed evidence/findings that integrate with the repair loop.

---

# 9. Mutation / Fault Injection — Best Stretch Feature

If the core works early, add **policy mutation testing**.

Instead of asking only:

> Do my tests pass?

ask:

> Can my policy suite detect when I intentionally break a critical rule?

Possible mutations:

- disable a KYC restriction
- assign an admin capability incorrectly
- remove a freeze restriction
- alter expected coupon amount
- remove pause enforcement

Then calculate something like:

```text
Policy mutations introduced: 10
Detected by suite:            9
Policy mutation score:       90%
```

This is more meaningful than line coverage for a policy-heavy application.

Only build this after deterministic onchain assertions are reliable.

---

# 10. Web App

The website is a **proof console**, not the product itself.

Keep it functional until the final pass.

## `/`

Hero:

# PolicyProbe

### AI can build the app. It should not grade its own onchain behavior.

Show immediately:

```text
NETWORK          Hedera Testnet
ASSET            Atlas Infrastructure Note
POLICIES         12
PASS              11
FAIL               1
LATEST RUN        #42
```

## `/run`

Show adversarial actors and executed scenarios.

Example cards:

```text
Alice — Verified Investor
Transfer receive
PASS
```

```text
Bob — Unverified Investor
Transfer receive
FAIL — transaction succeeded unexpectedly
```

## `/evidence`

For each assertion:

- expected behavior
- observed behavior
- transaction ID
- chain evidence
- actor
- result
- Harness finding

## `/repair`

Show the closed-loop story:

```text
Run #41
1 policy violation
       ↓
Structured Harness finding
       ↓
Agent repair
       ↓
Run #42
12/12 PASS
```

## `/proof`

Judge page:

```text
Hedera Harness contribution    PR #...
ATS asset deployed             ✓
Hedera testnet                 ✓
Real adversarial transactions  ✓
Tests                          ... passing
Harness before/after           View
ATS lifecycle operation        View
GitHub                         Open
Architecture                   Open
```

---

# 11. Repository Strategy

Because this project has both an upstream contribution and a demo application, keep provenance clear.

Suggested main submission repo:

```text
policyprobe/
│
├── app/                         # judge-facing web console / ATS demo
├── fixtures/                    # policies and adversarial actor scenarios
├── integration/                 # Harness integration/demo glue
├── tests/                       # end-to-end project tests
├── docs/
│   ├── ARCHITECTURE.md
│   ├── HARNESS_CONTRIBUTION.md
│   ├── ATS_DEMO.md
│   ├── THREAT_MODEL.md
│   ├── AI_USAGE.md
│   └── TECHNICAL_NOTE.pdf
├── scripts/
│   ├── deploy-testnet.*
│   ├── seed-actors.*
│   └── run-demo.*
├── README.md
└── ...
```

The upstream Harness fork/branch should remain a clean contribution against Hedera Harness rather than absorbing the entire demo application.

---

# 12. Git & AI-Use Discipline

ETHGlobal requires clear version-control history and transparency around AI use.

Do:

- commit throughout the event
- keep planning/spec artifacts used to direct AI
- document which tools assisted which areas
- keep meaningful human decisions visible
- show iterative development rather than one giant generated commit

Suggested commits:

```text
research: map current Harness chain validation and open PR overlap

test: add failing fixture for deterministic chain postcondition

feat: add transaction-outcome assertion model

feat: add balance-delta assertion evidence

feat: map chain assertion failures into Harness findings

test: add adversarial authorization fixtures

docs: add chain assertion recipe example

feat: issue ATS bond test fixture

feat: add PolicyProbe evidence console

demo: add broken-KYC repair scenario
```

Maintain `docs/AI_USAGE.md` or an equivalent section explaining the use of Codex/other assistants.

---

# 13. README Strategy

A judge should understand the project in ~60 seconds.

Recommended order:

1. **One-line thesis**
2. **The problem in current Harness**
3. **What PolicyProbe adds**
4. **Before/after diagram**
5. **Killer ATS example**
6. **Upstream PR link**
7. **How to run**
8. **Testnet evidence**
9. **Tests**
10. **Hedera bounty mapping**
11. **Limitations**
12. **AI-use disclosure**

Do not claim:

> “PolicyProbe proves legal compliance.”

Use:

> **technical policy-conformance testing**

or:

> **behavioral onchain assertions**

---

# 14. Technical Note / Short Paper

A concise **5–7 page technical note** is useful if the core implementation is already finished.

Suggested title:

# PolicyProbe: Deterministic Behavioral Verification for AI-Built Hedera Applications

Suggested sections:

1. Abstract
2. Hedera Harness validation model
3. Gap: transaction evidence vs application postconditions
4. Assertion/evidence model
5. Repair-loop integration
6. ATS bond case study
7. Evaluation / fault injection
8. Limitations and future work

Do not prioritize the paper over the upstream PR, tests, or demo reliability.

---

# 15. Sponsor Interaction

Talk to Hedera maintainers early, but ask **technical questions**, not promotional ones.

After you have mapped the Harness internals and a minimal prototype, ask something like:

> Tier 3.5 proves real testnet activity, and we are adding deterministic application-level postconditions that turn chain-state mismatches into structured Harness findings. We are keeping the core generic and using ATS compliance behaviors as the demo fixture. Would you prefer this as an extension of `chainValidation`, a separate validator surface, or another pattern in the current `dev` architecture?

This can prevent building the right idea in the wrong architectural location.

Before opening a large PR, prefer showing a concise design/issue/discussion if the maintainers' contribution workflow supports it.

---

# 16. Demo Video

Global ETHOnline rules require a **2–4 minute** video. Target ~3:20–3:40.

Do not use AI voiceover.

## Suggested timeline

### 0:00–0:20 — Hook

> “Hedera Harness can prove that an AI-built app sent a real transaction. But a real transaction does not prove the app enforced the rule it was supposed to enforce.”

### 0:20–0:45 — Current gap

Show the existing validation ladder and the missing behavioral layer.

### 0:45–1:10 — PolicyProbe

Show the assertion suite:

```text
verified holder may receive
unverified holder must fail
frozen holder must fail
unauthorized freeze must fail
coupon delta must equal X
```

### 1:10–1:50 — Broken app

Run real Hedera testnet actions.

Show:

```text
11 PASS
1 FAIL
```

Open the failed transaction evidence.

### 1:50–2:25 — Repair loop

Show structured finding → agent fix → rerun.

```text
12 / 12 PASS
```

### 2:25–2:55 — Upstream contribution

Show the focused Hedera Harness PR, tests, and generic assertion mechanism.

### 2:55–3:20 — ATS qualification

Show bond issuance/configuration plus one lifecycle/compliance operation.

### 3:20–3:35 — Close

> **“AI can build the app. PolicyProbe makes the chain grade the behavior.”**

---

# 17. Live Finalist Pitch

If selected for live judging, ETHGlobal gives **7 minutes total: 4 minutes demo + 3 minutes Q&A**.

Prepare answers for:

### Why is this not just unit testing?

Because PolicyProbe executes against the deployed Hedera application and independently evaluates real chain outcomes/evidence, including adversarial identities and integration behavior.

### Why does this belong in Harness?

Harness already owns generation → validation → repair. PolicyProbe turns chain-level behavioral failures into the same repair system instead of creating a separate testing silo.

### Why ATS?

Regulated assets have clear positive and negative invariants — KYC, freeze, pause, roles, coupon/redemption — making ATS the strongest proof case for the generic validator.

### Why not just use the semantic Tier 3 agent?

A probabilistic evaluator is valuable for UX/semantic behavior, but deterministic financial/security postconditions should be machine-checkable and reproducible.

### Is this legal compliance proof?

No. It proves configured **technical behavior**, not legal or regulatory compliance.

---

# 18. Judging Map

ETHGlobal judges Technicality, Originality, Practicality, Usability/DX, and WOW Factor.

| Criterion | PolicyProbe answer |
|---|---|
| Technicality | Harness internals + chain assertions + evidence + repair-loop integration |
| Originality | Deterministic behavioral postconditions layered onto AI-driven onchain validation |
| Practicality | Reusable for any Hedera app with critical chain invariants |
| Usability / DX | Declarative/reusable assertions, clear findings, one repair workflow |
| WOW | Deliberately broken regulated-token rule caught on real testnet, auto-repaired, same attack passes afterward |

### Hedera Harness track mapping

| Requirement / bonus | Project |
|---|---|
| Meaningful Harness contribution | Core deliverable |
| Open PR acceptable | Yes |
| README / PR explanation | Required |
| Working demo | Required |
| Better developer ergonomics | Reusable chain assertions |
| Tests | First-class |
| Documentation | First-class |
| Before/after evidence | Central demo |

### ATS track mapping

| Requirement / bonus | Project |
|---|---|
| Use ATS | Bond fixture |
| Hedera testnet | Required |
| Public repo | Required |
| Issuance/configuration | Demo |
| Lifecycle operation | Transfer/compliance/coupon/redemption |
| KYC/freeze/pause | Core adversarial examples |
| Coupon distribution | Strong optional assertion |
| Upstream contribution | Harness PR; ATS contribution only if natural |

---

# 19. Priority Allocation

If total effort = 100:

| Work | Effort |
|---|---:|
| Harness core contribution | 28 |
| Tests / fixtures / deterministic evidence | 20 |
| ATS testnet fixture | 12 |
| Repair-loop integration | 10 |
| Demo reliability | 10 |
| README / PR / docs | 8 |
| Web proof console | 6 |
| Demo video / pitch | 4 |
| Public promotion | 2 |

The PR and test quality should dominate the project.

---

# 20. What NOT to Build

Avoid:

- generic “smart contract scanner” — now adjacent to PR #40
- generic Mirror Node wrapper — now adjacent to PR #39
- giant tokenization platform
- secondary market unless core work is finished
- real KYC vendor integration
- legal compliance engine
- AI chatbot
- multi-chain support
- DAO/token/NFT
- large branding effort
- unnecessary sponsor integrations
- complex ML underwriting
- a 20-page whitepaper

The ATS application is a **fixture**.

The product is the **Harness verification capability**.

---

# 21. Submission Deadline and Final Gates

**ETHOnline 2026 submission deadline:** Sunday, September 13, 2026 at 12:00 PM EDT.

Global submission requirements include:

- GitHub repo / proof of event work
- clear version-control history
- 2–4 minute demo video
- AI usage disclosure
- up to 3 partner prize selections

Final gates:

### Harness

- [ ] Current `dev` architecture re-checked before coding
- [ ] No overlap with active PRs #39/#40
- [ ] Core assertion model implemented
- [ ] Failed assertions become structured Harness findings
- [ ] Tests pass
- [ ] Docs/example included
- [ ] Upstream PR opened
- [ ] Before/after demonstrated

### ATS

- [ ] ATS-issued bond on Hedera testnet
- [ ] Issuance/configuration shown
- [ ] At least one lifecycle/compliance operation shown
- [ ] KYC/freeze/pause or equivalent controls actually exercised
- [ ] HashScan links / contract verification where applicable

### Demo

- [ ] Real broken-policy scenario
- [ ] Real testnet evidence
- [ ] Repair shown
- [ ] Same adversarial test passes afterward
- [ ] 2–4 minute video
- [ ] No AI voiceover
- [ ] At least 720p

### Repo / docs

- [ ] Clean Git history
- [ ] README optimized for judges
- [ ] Architecture diagram
- [ ] Threat/limitations section
- [ ] AI usage documented
- [ ] PR link prominent
- [ ] Reproduction commands tested

---

# 22. Final Judge Experience

Within **10 seconds**:

> AI can build the app. It should not grade its own onchain behavior.

Within **30 seconds**:

Judge understands transaction evidence vs behavioral postconditions.

Within **60 seconds**:

Judge sees an ATS rule suite and adversarial actors.

Within **90 seconds**:

A real testnet policy violation is caught with transaction evidence.

Within **2–3 minutes**:

The same finding enters the Harness repair loop and the exact attack passes after repair.

Then the judge opens GitHub and finds:

- focused upstream PR
- tests
- docs
- generic assertion architecture
- ATS example
- clean history

That is the winning package.

---

# 23. Final Pitch Variants

## Simple

> **PolicyProbe attacks an AI-built Hedera app with real testnet transactions and proves whether its critical rules actually hold.**

## Technical

> **PolicyProbe extends Hedera Harness with deterministic onchain postcondition assertions and typed evidence, turning application-level chain-state violations into structured repair findings.**

## Memorable

> **AI can build the app. PolicyProbe makes the chain grade the behavior.**

## Sponsor-native

> **Hedera Harness already proves that the agent shipped. PolicyProbe proves that what it shipped behaves correctly onchain.**

---

# 24. Primary Sources to Keep Pinned

- ETHOnline 2026 Hedera prize page: https://ethglobal.com/events/ethonline2026/prizes/hedera
- ETHOnline 2026 event details/rules: https://ethglobal.com/events/ethonline2026/info/details
- Hedera Harness: https://github.com/hedera-dev/hedera-harness
- Hedera Harness PR #39: https://github.com/hedera-dev/hedera-harness/pull/39
- Hedera Harness PR #40: https://github.com/hedera-dev/hedera-harness/pull/40
- Hedera Skills: https://github.com/hedera-dev/hedera-skills
- Asset Tokenization Studio docs: https://docs.tokenization-studio.hedera.com/
- Asset Tokenization Studio repository: https://github.com/hashgraph/asset-tokenization-studio

Re-check all active Harness PRs immediately before choosing the exact implementation surface. The repository is moving quickly during ETHOnline.
