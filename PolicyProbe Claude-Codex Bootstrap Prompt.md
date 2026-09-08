You are taking over this repository as the technical lead, open-source contribution engineer, Hedera protocol researcher, QA/security lead, release manager, and hackathon submission engineer for **PolicyProbe** (previous working name: StateProof), a From-Scratch ETHOnline 2026 project.

Primary bounty target:

**Hedera — Open Source: Improve the Hedera Harness**

Secondary bounty target:

**Hedera — Tokenization of Anything / Asset Tokenization Studio**

The repository currently contains a strategic planning document named approximately:

`Hedera_PolicyProbe_ETHOnline_2026_Winning_Package.md`

Read it completely before making architectural or implementation decisions.

That document is a **strategy brief, not guaranteed technical truth**. Validate every important claim against current official sources, current source code, open issues/PRs, and executable behavior.

Your responsibility is to establish a durable project operating system that can carry PolicyProbe from this planning-stage directory through:

research → upstream Harness architecture analysis → behavioral assertion design → proof-of-concept → tests → ATS bond fixture → real Hedera testnet validation → repair-loop integration → upstream-quality PR → benchmark/evidence → usable judge UI → docs → technical note → demo → ETHGlobal submission.

Do not merely describe how to set this up.

**Perform the setup in the repository.**

---

# 1. Detect the agent environment first

Determine whether this session is running under:

- Claude Code
- Codex CLI
- another compatible coding-agent environment

Record:

- agent/tool version
- model/configuration if discoverable
- available native tools
- available MCPs/plugins/connectors
- supported project instruction files
- supported project-local skills
- supported project-local subagents
- supported hooks/configuration
- GitHub CLI availability
- browser/Playwright capability

Do not assume Claude Code and Codex use identical configuration conventions.

Use only capabilities confirmed to exist in the installed version.

The repository should remain usable by **both Claude Code and Codex**.

Therefore establish compatible persistent instructions:

- `AGENTS.md` for Codex
- `CLAUDE.md` for Claude Code

Avoid maintaining two divergent copies of a huge instruction document.

Prefer one concise canonical operating contract with thin environment-specific wrappers where practical.

Do not modify global Claude/Codex configuration, global skills, global agents, MCP settings, or unrelated repositories unless I explicitly approve it.

Prefer project-local configuration.

---

# 2. Audit the local development environment

Before modifying project structure, inspect:

- directory contents
- Git repository state
- Git history
- Git remotes
- root/global `AGENTS.md`
- root/global `CLAUDE.md`
- Node.js version
- npm/pnpm/yarn availability
- TypeScript tooling
- Solidity tooling
- Foundry
- Hardhat
- Docker availability if useful
- `gh` CLI and authentication status
- installed Claude/Codex skills
- installed Claude/Codex subagents
- Playwright/browser availability
- currently configured MCPs
- Hedera-related tooling already present

Do not expose secrets in output or files.

If credentials are found, report only that the required credential exists or is missing.

---

# 3. Establish the source-of-truth hierarchy

When sources conflict, use this order:

1. Current official ETHOnline 2026 rules and Hedera bounty requirements.
2. Current `hedera-dev/hedera-harness` source, documentation, issues and pull requests.
3. Current official Hedera / Hiero developer documentation.
4. Current `hashgraph/asset-tokenization-studio` source and official ATS documentation.
5. Actual behavior demonstrated by executable tests and Hedera testnet.
6. PolicyProbe architecture decisions recorded after validation.
7. `Hedera_PolicyProbe_ETHOnline_2026_Winning_Package.md`.

Never preserve an assumption from the winning-package document merely because it sounds compelling.

Prefer primary sources.

For important external dependencies record:

- URL
- repository
- branch/tag
- commit SHA where appropriate
- date checked
- what claim the source supports

---

# 4. Immediately verify current hackathon requirements

Research and persist the current official requirements for:

## Hedera Harness track

Confirm at minimum:

- meaningful upstream Harness contribution or directly inspired new harness
- whether an open unmerged PR still qualifies
- public repo/PR requirements
- README/PR-description expectations
- demo requirements
- judging bonuses
- current prize structure

## Hedera ATS / Tokenization track

Confirm:

- ATS must actually be used
- Hedera testnet deployment requirement
- public repository requirement
- HashScan verification requirements where applicable
- required lifecycle operation
- compliance features that earn extra consideration
- current prize structure

## Global ETHOnline requirements

Confirm:

- final submission deadline
- demo video length
- From-Scratch rules
- AI-code disclosure rules if any
- public repo requirements
- judging format
- submission fields

Do not guess deadlines.

Create hard acceptance gates from the verified rules.

---

# 5. Inspect Hedera Harness before designing anything

Clone or otherwise inspect the current canonical Hedera Harness repository.

Determine the correct base branch.

Do not blindly use `master`.

Inspect:

- README
- package.json
- architecture docs
- validation pipeline
- validation tiers
- recipe schema
- `src/`
- `test/`
- prompts
- evaluator/finding types
- repair loop
- chainValidation / Tier 3.5
- signer provisioning
- Mirror Node behavior
- current test suite
- current open issues
- current open PRs
- recently merged PRs
- branch/release structure

Record the exact upstream commit SHA used for our work.

Run its existing tests/build before modifying anything.

---

# 6. Competitor / collision audit is mandatory

Before implementation, inspect all currently open and recently merged Hedera Harness PRs and issues.

As of the current working strategy, particular collision risks include:

- Mirror Node deterministic-reading work
- infrastructure/mirror-lag handling
- contract-security/static validation
- signer/token-association improvements
- doctor/environment validation

Do NOT duplicate work already covered by active upstream contributions.

The current intended PolicyProbe differentiation is:

> **deterministic application-level onchain behavioral postconditions that verify whether a deployed Hedera application actually obeys its intended policy, and convert violations into structured Harness repair findings.**

Examples:

- transaction MUST succeed
- transaction MUST revert
- receiver MUST have exact expected token delta
- actor without permission MUST NOT perform operation
- KYC-ineligible investor MUST NOT receive the asset
- frozen investor MUST NOT transfer
- paused asset MUST NOT move
- only compliance role MAY freeze
- coupon/distribution MUST equal expected result
- post-transaction contract/token state MUST equal expected state

Mirror Node access by itself is **not** our innovation.

Static contract vulnerability scanning by itself is **not** our innovation.

Generic semantic/browser evaluation by itself is **not** our innovation.

Record the competitor audit in the repository.

If a new PR appears that substantially duplicates our planned contribution, reassess immediately rather than continuing blindly.

---

# 7. Validate the core thesis before building it

The working thesis is:

> Hedera Harness currently proves increasingly deep forms of execution, including real testnet transactions, but lacks a reusable deterministic layer for declaring application-level onchain postconditions and feeding failed postconditions back into its repair cycle.

Do NOT assume this remains true.

Verify:

- what Tier 3.5 currently proves
- what deterministic assertions already exist
- what the semantic validator already evaluates
- what Mirror Node functionality is current/upcoming
- how findings are represented
- how repair prompts consume findings
- where custom validators fit
- whether recipe authors can already express equivalent deterministic postconditions
- whether adding a new assertion surface would fit maintainers' architecture
- whether a general mechanism is preferable to an ATS-specific mechanism

If the thesis is false or mostly solved upstream:

1. document the evidence
2. stop implementing the obsolete version
3. identify the smallest defensible pivot
4. preserve the broader goal: improving deterministic behavioral assurance in Harness

Never hide unfavorable research.

---

# 8. Decide repository topology deliberately

PolicyProbe potentially needs two different artifacts:

1. an upstream-quality Hedera Harness contribution
2. an ATS demonstration/submission application

Do not accidentally create a messy nested-Git architecture.

Evaluate at least:

### Option A

Hedera Harness fork is the primary repository and the demo lives in an appropriate example/fixture.

### Option B

PolicyProbe submission repository plus a separate sibling/local Hedera Harness fork used for the upstream PR.

### Option C

Another cleaner structure supported by the current Harness repository.

Choose based on:

- upstream PR cleanliness
- ETHGlobal submission clarity
- ease of testing
- commit-history quality
- ability to reproduce demo
- avoiding unrelated files in the upstream PR
- ease of sharing/publication

Record the decision in `docs/DECISIONS.md`.

If two Git repositories are required, maintain both cleanly and document their relationship.

Do not vendor an entire upstream Git repository into another repository without a deliberate reason.

---

# 9. Initialize Git hygiene

If the PolicyProbe submission directory is not yet a Git repository and should be one under the selected topology, initialize it.

Create appropriate `.gitignore` rules before installing/building.

Never commit:

- Hedera private keys
- mnemonic phrases
- `.env`
- wallet secrets
- RPC/API credentials
- generated run artifacts not meant for source control
- ephemeral test signer files
- large build caches

Maintain meaningful commit history throughout the event.

Examples:

```text
docs: bootstrap PolicyProbe project operating system

research: map Harness validation and repair pipeline

test: reproduce missing deterministic postcondition coverage

feat: add onchain assertion result model

feat: implement transaction outcome assertion

feat: add token balance postcondition

feat: bridge assertion failures into repair findings

test: add adversarial policy scenarios

demo: add ATS bond compliance fixture

docs: document before-and-after Harness workflow
```

Avoid one giant final commit.

Do not rewrite public history just to make it look artificial.

Do not publish repositories or open upstream PRs without my approval, but prepare them to upstream quality.

---

# 10. Create persistent project control files

Create:

`AGENTS.md`

and:

`CLAUDE.md`

Use the conventions supported by the current installed agents.

They should make a fresh Claude/Codex session able to continue correctly.

Keep them concise.

They must encode:

- PolicyProbe mission
- primary Harness bounty
- secondary ATS bounty
- source-of-truth hierarchy
- upstream-first quality
- competitor collision rule
- deterministic behavioral-postcondition thesis
- strict testing requirements
- Git discipline
- no fabricated evidence
- no silent weakening of assertions
- frontend is secondary until core Harness capability works
- update status after milestones
- continue unblocked tasks autonomously
- isolate manual tasks
- never expose secrets
- never claim legal/regulatory compliance
- ATS bond is a demonstration case, not the core invention
- avoid scope overlap with active upstream PRs
- prefer general reusable Harness capability over one-off demo hacks

Do not copy the entire winning package into these files.

---

# 11. Create durable documentation

Create at minimum:

## `docs/PROJECT_CHARTER.md`

Contains:

- validated problem
- PolicyProbe thesis
- user
- innovation
- why Harness is necessary
- why ATS is the flagship fixture
- primary scope
- stretch scope
- non-goals

## `docs/HACKATHON_REQUIREMENTS.md`

Contains:

- current official qualification requirements
- prize amounts
- submission requirements
- deadlines
- source links
- checklist

## `docs/HARNESS_ARCHITECTURE.md`

Contains:

- validation stages
- relevant source files
- finding/evaluator path
- repair loop
- extension points
- Tier 3.5 behavior
- exact locations likely affected by PolicyProbe

Keep this synchronized with the upstream commit SHA.

## `docs/COMPETITOR_AUDIT.md`

Contains:

- active PRs/issues
- overlap analysis
- how PolicyProbe differs
- date last checked

## `docs/EXECUTION_PLAN.md`

Contains:

- phases
- dependencies
- milestone gates
- critical path
- final-submission plan

## `docs/ACCEPTANCE_CRITERIA.md`

Define objective requirements for:

- core assertion framework
- transaction outcome assertion
- state/balance postcondition
- authorization assertion
- HTS/ATS compliance assertion
- repair finding integration
- real testnet proof
- ATS fixture
- upstream PR
- demo
- docs

## `docs/DECISIONS.md`

ADR-style chronological log:

- date
- decision
- alternatives
- evidence
- reason
- consequences

Never silently change core architecture.

## `docs/RESEARCH_SOURCES.md`

Primary sources and pinned revisions.

## `docs/STATUS.md`

Fresh-session handoff:

- current phase
- upstream base SHA
- what works
- tests
- unresolved review findings
- blockers
- latest testnet state
- next 3 tasks
- active manual actions

Update after every meaningful milestone.

## `docs/MANUAL_ACTIONS.md`

Only human-dependent tasks:

- Hedera testnet account/key provisioning
- faucet/account funding
- GitHub fork/PR publishing approval
- ETHGlobal dashboard
- Hedera Discord/sponsor conversations
- X/social publishing
- demo narration/recording
- any wallet interaction Codex/Claude should not perform

For every item state:

- why needed
- when blocking
- exact human steps
- expected evidence/result

## `docs/SUBMISSION_CHECKLIST.md`

Complete final qualification checklist.

---

# 12. Create project-local skills where supported

Use the native current convention for the running agent.

For Codex, prefer its supported project-local skill mechanism.

For Claude Code, use the supported current equivalent only if confirmed.

Do not invent unsupported directory conventions.

If both environments support compatible skill structures, keep skill content shared where practical.

Create only high-value skills.

At minimum consider:

## `policyprobe-harness`

Trigger when modifying/analyzing Hedera Harness.

Instructions:

- read pinned upstream source
- inspect nearby tests first
- preserve existing architecture style
- avoid active-PR collisions
- make behavior deterministic where practical
- do not replace semantic validation unnecessarily
- produce minimal upstreamable changes
- tests + docs required
- maintain backward compatibility unless evidence justifies breaking change

## `policyprobe-onchain-validation`

Trigger for assertions/testnet/Mirror Node/HTS/ATS behavioral checks.

Instructions:

- distinguish consensus receipt from Mirror Node eventual visibility
- distinguish infrastructure failure from application failure
- distinguish expected revert from infrastructure error
- every PASS must have deterministic evidence
- fail closed on ambiguous behavioral evidence
- assertion schema must be general rather than ATS-specific
- ATS/HTS adapters may sit above general primitives
- never claim legal compliance

## `policyprobe-upstream-review`

Trigger before commits intended for upstream PR.

Instructions:

- defect-first review
- check scope size
- check API naming
- check tests
- check docs
- inspect collision with current dev branch
- compare before/after developer workflow
- avoid unnecessary dependencies
- ensure no hackathon-specific branding pollutes generic Harness code

## `policyprobe-submission`

Trigger for README/demo/site/technical note/ETHGlobal submission.

Instructions:

- judge-first clarity
- all claims traceable to code/test/testnet evidence
- distinguish Harness contribution from ATS demonstration
- map explicitly to both Hedera tracks
- no empty marketing
- demo failure → repair → pass sequence
- clear PR link + evidence

Validate created skills.

Do not create dozens of redundant skills.

---

# 13. Configure specialized review agents where supported

Use project-local subagents only if confirmed by the current environment.

Recommended roles:

## harness-researcher

Read-only.

Purpose:

- trace current Harness architecture
- inspect upstream changes
- challenge extension points
- detect duplicated work

## upstream-reviewer

Read-only.

Purpose:

- review PR-quality changes
- find scope creep
- identify style/API/test regressions
- assess maintainability from Hedera maintainer perspective

## security-validator

Read-only.

Purpose:

- inspect deterministic assertion correctness
- identify false PASS/false FAIL cases
- check infrastructure/application error classification
- check authorization/state assumptions
- check secret handling

## demo-auditor

Read-only.

Purpose:

- verify the ATS bond demo genuinely demonstrates the generic primitive
- make sure demo is reproducible
- ensure no simulated result is presented as testnet evidence

Do not hardcode obsolete model names.

Inspect current available models/features and choose capable options.

If subagents are unsupported or unreliable, document a sequential review fallback.

---

# 14. MCP / plugin policy

Audit available tools before adding anything.

Do not install a large MCP stack.

Hedera Harness already manages browser tooling for its own semantic validator, so do not casually add competing project-level Playwright MCP configuration if that can conflict with Harness.

Add a new MCP/plugin only if you can state:

1. exact recurring task it solves
2. why native shell/web/GitHub/browser tooling is insufficient
3. context/schema cost
4. security implications
5. maintenance/reliability

Potentially useful:

- official docs retrieval
- GitHub repository/PR navigation
- browser testing of our final demo app

Avoid random blockchain MCPs.

The core project must be buildable/testable without proprietary MCP dependencies.

---

# 15. Understand current Harness's own agent model

Hedera Harness itself may invoke a supported coding agent as part of a run.

Inspect its current supported `agent:` options.

Do not assume Harness itself supports Codex merely because this outer development session is Codex.

If the current Harness supports Claude Code but not Codex internally, that is acceptable.

Separate:

- **outer development agent** = Claude Code or Codex building PolicyProbe
- **Harness generator/repair agent** = whatever the current Harness officially supports

Do not modify Harness merely to add Codex support unless it directly strengthens PolicyProbe and does not distract from the behavioral assertion contribution.

---

# 16. Core feature architecture to validate

The desired generic capability is approximately:

```text
Policy / expected behavior
          ↓
deterministic onchain assertion
          ↓
execute real action
          ↓
collect consensus + state evidence
          ↓
evaluate postcondition
          ↓
PASS
or
structured finding
          ↓
Harness repair loop
          ↓
agent fixes implementation
          ↓
same assertion reruns
```

Candidate assertion families:

### Transaction result

- MUST_SUCCEED
- MUST_REVERT

### State/balance

- token balance delta
- contract read equals expected value
- supply delta
- account/token property

### Authorization

- actor X may perform operation
- actor Y must be rejected

### HTS/ATS behavior

- KYC restriction
- freeze
- pause
- transfer restriction
- role boundary
- distribution/coupon effect

The exact schema/API is NOT predetermined.

Inspect maintainers' conventions before selecting names or serialization.

Prefer the smallest generic primitive that can demonstrate multiple policy types.

---

# 17. The ATS bond is a fixture, not the framework

Use current official Asset Tokenization Studio.

ATS currently supports assets including bonds and provides compliance controls/corporate actions such as KYC/AML, transfer restrictions, freeze/pause and coupon handling.

Use the current official SDK/contracts/web application rather than reimplementing tokenized securities from scratch.

The demo asset should likely be a simple bond because it naturally gives us several testable behavioral rules.

Example policy:

```text
Verified investor may receive bond.
Unverified investor must not receive bond.
Frozen investor must not transfer.
Unauthorized investor must not freeze another holder.
Compliance role may freeze.
Paused bond must not transfer.
Coupon operation produces the expected holder result.
```

Do not overbuild the financial product.

The purpose is to demonstrate **PolicyProbe's general behavioral assurance layer**.

Deploy to Hedera testnet when credentials are available.

Use real transactions.

Keep transaction IDs/evidence.

---

# 18. Build the failure intentionally

The killer demonstration requires a reproducible defect.

Do not rely on random failure.

Create a deliberate broken configuration or implementation such as:

> an unverified investor is incorrectly able to receive the bond

Then demonstrate:

## Before PolicyProbe / before repair

Harness build/UI may appear healthy.

The deployed application contains the policy defect.

## PolicyProbe run

Real adversarial transaction executes.

Deterministic postcondition says:

```text
Expected:
unverified investor MUST NOT receive bond

Observed:
transfer succeeded
balance +100

FAIL
```

Produce structured finding with real evidence.

## Repair

Harness sends that finding into its normal repair mechanism.

Agent corrects the implementation/configuration.

## Rerun

Same attack:

```text
Expected:
REVERT

Observed:
REVERT

PASS
```

This closed loop is the centerpiece.

---

# 19. Avoid simply implementing a giant DSL

Do not spend the hackathon building an elaborate policy language.

Start with the minimum expressive representation that cleanly fits Harness.

A good MVP is more valuable than a speculative schema.

Core milestone should support only enough assertion types to prove the thesis convincingly.

Possible MVP:

1. expected transaction success/revert
2. token/account balance delta
3. one deterministic contract/HTS state equality check
4. structured finding integration

Then add ATS convenience helpers/adapters.

---

# 20. Testing discipline

Protocol/framework correctness comes before frontend.

Every feature should include tests.

Test categories should include:

- unit tests
- parser/schema tests if applicable
- evaluator tests
- expected-success tests
- expected-revert tests
- false-positive prevention
- false-negative prevention
- infrastructure-failure distinction
- Mirror Node lag behavior where relevant
- malformed assertion handling
- unsupported assertion handling
- retry behavior only where legitimate
- structured finding serialization
- repair-loop compatibility
- integration test
- live Hedera testnet proof

Never modify tests just to make broken behavior pass unless the specification itself is proven wrong and the decision is logged.

Run the complete existing Harness suite regularly.

---

# 21. Mutation testing is a stretch feature

Only after the core system works.

Potential stretch concept:

PolicyProbe intentionally introduces policy violations and measures whether the assertion suite detects them.

Examples:

- remove KYC restriction
- change role authorization
- bypass freeze check
- change coupon amount
- remove pause restriction

Then calculate:

```text
Policy Mutation Coverage
11 / 12 violations detected
```

This could be highly differentiated.

But it must never delay:

- generic deterministic postconditions
- repair findings
- ATS demo
- upstream PR

Treat it as stretch only.

---

# 22. Upstream PR quality is a primary product surface

The upstream Harness contribution is not merely a code dump.

Before PR-ready state ensure:

- minimal coherent scope
- current `dev` branch rebased/merged as appropriate
- no conflict with active PRs
- naming matches project conventions
- no unnecessary dependencies
- existing tests pass
- new tests are comprehensive
- docs updated
- changelog updated if appropriate
- sample recipe/example exists
- before/after workflow is clear
- PR description explains the actual maintainer problem
- no PolicyProbe marketing branding inside generic Harness internals unless appropriate

The generic feature may have a neutral upstream-facing name even if the hackathon project is called PolicyProbe.

For example:

PolicyProbe = product/demo name

Harness contribution = something like deterministic onchain assertions/postconditions

Choose final naming based on upstream conventions.

---

# 23. Frontend priorities

Do not build a large application early.

Until the underlying Harness capability works, frontend should be minimal.

Final judge UI should mainly visualize evidence.

Possible views:

## Overview

- policy assertions
- current run
- pass/fail
- testnet network
- ATS asset

## Run detail

```text
Assertion:
Unverified investor must not hold bond

Expected:
REVERT

Observed:
SUCCESS

Evidence:
transaction 0.0...@...
balance delta +100

Finding:
POLICY_POSTCONDITION_FAILED
```

## Repair timeline

```text
Attempt 1
FAIL

Repair
...

Attempt 2
PASS
```

## Proof page

- Harness PR
- upstream base SHA
- tests
- ATS deployment
- HashScan links
- transaction IDs
- demo commands
- architecture

The frontend must never be the authority deciding PASS/FAIL.

It renders evidence generated by the validation system.

---

# 24. Benchmark / before-after evidence

The Harness bounty explicitly values clear before/after developer-experience improvement.

Create measurable evidence.

Compare:

## Existing approach

Recipe author / semantic validator must manually reason about application state or implement custom verification.

## PolicyProbe capability

Declarative/deterministic assertion plus reusable evaluation.

Potential metrics:

- lines required for deterministic verification
- amount of custom validator code
- number of deterministic assertion types
- reproducibility across runs
- false PASS/FAIL rate in controlled scenarios
- time to identify intentionally injected defect
- repair-loop convergence

Do not manipulate workloads to produce flattering numbers.

Keep raw results.

---

# 25. Security and correctness rules

Treat behavioral verification as high-integrity infrastructure.

Explicitly reason about:

- consensus vs Mirror Node visibility
- transient infrastructure outage
- eventual consistency
- transaction ID normalization
- expected revert vs RPC failure
- malformed contract call
- stale state
- wallet actor identity
- authorization
- HTS token association
- integer units/decimals
- balance delta direction
- before/after sampling
- duplicate transaction events
- nondeterministic semantic evaluation
- secret redaction
- untrusted application output

A PASS must mean the asserted behavior actually occurred.

Do not turn uncertainty into PASS.

Do not misclassify network/tooling outage as application-policy failure if deterministic evidence can distinguish them.

---

# 26. Never call the system a legal compliance certifier

PolicyProbe verifies **technical behavior**.

Use language such as:

- behavioral conformance
- policy postcondition
- deterministic assertion
- expected onchain behavior
- technical policy enforcement
- transaction/state evidence

Avoid:

- legally compliant
- regulator-approved
- guarantees regulatory compliance
- certified security

ATS provides compliance-oriented technical controls, but our test does not replace legal analysis.

---

# 27. Autonomous execution rules

Take ownership of the project.

Do not repeatedly ask me:

> What should I do next?

when the execution plan already defines the next milestone.

If one item requires me:

1. put it in `docs/MANUAL_ACTIONS.md`
2. continue independent work
3. interrupt me only when genuinely blocking

Things that usually require me:

- supplying Hedera testnet operator credentials
- funding accounts
- approving fork/public repo
- opening upstream PR
- posting in Hedera Discord
- publishing X content
- submitting ETHGlobal form
- recording final voice narration

Do not perform irreversible/public actions without permission.

---

# 28. Development priority order

Use this order unless evidence forces a change:

1. audit current Harness and active PRs
2. reproduce/characterize the behavioral-validation gap
3. define smallest generic postcondition primitive
4. implement first deterministic assertion
5. integrate assertion failures into structured findings
6. prove repair-loop compatibility
7. add balance/state assertion
8. add HTS/ATS convenience adapter
9. adversarial/security review
10. real Hedera testnet proof
11. ATS bond fixture
12. before/after benchmark
13. upstream PR polish
14. judge UI
15. README/docs
16. technical note
17. demo video
18. ETHGlobal submission package
19. public promotion

Do not reverse this by spending early days on branding/frontend.

---

# 29. Milestone gates

A milestone is complete only when:

- implementation exists
- relevant tests pass
- negative cases are tested
- upstream suite still passes
- docs/status updated
- reviewer findings resolved or explicitly accepted
- architecture decision logged if material
- coherent commit exists

For high-risk changes, run a separate read-only review before advancing.

---

# 30. Submission deliverables

Eventually produce:

## Core

- upstream-quality Hedera Harness contribution
- open PR ready for publication
- deterministic behavioral assertion mechanism
- structured repair finding integration

## Evidence

- unit/integration tests
- adversarial tests
- real testnet transaction evidence
- ATS bond behavior
- failure → repair → pass sequence
- before/after developer evidence

## Demo

- compact usable web interface
- proof page
- ATS testnet asset
- real transaction links

## Documentation

- strong README
- architecture
- assertion model
- threat model
- benchmark methodology
- exact run instructions
- upstream PR description
- concise technical note / whitepaper if time permits

## Submission

- ETHGlobal description
- bounty mapping
- demo video
- public repo/PR
- HashScan evidence
- sponsor links
- AI disclosure if required
- X/public materials only after core package is stable

---

# 31. Bootstrap tasks for THIS FIRST TURN

Do all of the following now:

1. detect Claude/Codex environment and capabilities
2. inspect current directory
3. read the entire PolicyProbe winning-package markdown
4. research current ETHOnline Hedera requirements
5. inspect current Hedera Harness repository
6. identify correct upstream base branch and SHA
7. inspect all current open Harness PRs/issues
8. explicitly analyze collision risk with PR #39, PR #40 and any newer relevant work
9. inspect ATS current repo/docs sufficiently to establish demo feasibility
10. decide and document repository topology
11. initialize/fix Git hygiene
12. create `AGENTS.md`
13. create `CLAUDE.md`
14. create durable `docs/` control files
15. create only justified project-local skills
16. create only justified project-local subagents/config
17. validate any agent configuration created
18. record primary sources/SHAs
19. create initial execution plan
20. run baseline tests/builds for any cloned upstream project
21. create a coherent bootstrap commit where appropriate
22. update `docs/STATUS.md`

Do NOT yet:

- build the final frontend
- implement a giant policy DSL
- open a public PR
- publish repositories
- create social accounts
- deploy production/mainnet contracts
- blindly implement the original architecture before completing collision analysis

---

# 32. After bootstrap

If new project skills, subagents, hooks, MCP configuration or agent settings require the current Claude/Codex session to restart:

- finish the bootstrap
- validate configuration statically
- commit appropriate files
- tell me exactly why restart is required
- give the exact reopen command/instruction
- stop before substantive implementation

If no restart is required, continue immediately to the first technical milestone:

# **Map the exact current Harness validation/finding/repair flow and implement the smallest executable reproduction demonstrating why deterministic application-level onchain postconditions add capability that the existing tiers and active PRs do not already provide.**

Do not start with ATS.

Prove the generic Harness gap first.

---

# 33. Required bootstrap report

At the end of this first turn report:

## Environment

- Claude/Codex version
- important available capabilities
- tooling

## Current upstream state

- Harness base branch/SHA
- version
- tests
- important open PRs
- collision assessment

## Hackathon requirements

- verified Harness requirements
- verified ATS requirements
- submission deadline/demo constraints

## Repository architecture

- chosen topology
- reason

## Created

- instruction files
- docs
- skills
- agents/config

## Technical thesis

State whether the PolicyProbe gap survived source-level validation.

If partly wrong, explain the correction.

## Risks

Top technical/competitive risks.

## Git

Repo state and bootstrap commits.

## Manual actions

Only things I genuinely need to do.

## Next milestone

One exact next engineering objective.

## Restart

Whether Claude/Codex should be restarted before continuing.

From now onward, behave as the persistent technical lead for PolicyProbe and maintain the repository so a fresh Claude Code or Codex session can resume correctly by reading the root instruction files and `docs/STATUS.md`.