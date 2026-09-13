# PolicyProbe Design System

> **Expected. Executed. Verified.**

**Document:** `PolicyProbe_DESIGN.md`
**Project:** PolicyProbe
**Purpose:** Reference for brand identity, product UI, evidence visualization, motion, and diagrams.
**Status:** Current web interface design reference
**Last updated:** September 2026

---

# 1. Design Objective

PolicyProbe should feel like a **serious verification layer for Hedera developers**, not a generic security dashboard and not a clone of Hedera’s brand.

The product exists to answer one question:

> **Did the deployed application actually behave the way its policy said it should?**

Every visual decision should reinforce this sequence:

```text
EXPECTED BEHAVIOR
        ↓
REAL EXECUTION
        ↓
OBSERVED STATE
        ↓
DETERMINISTIC COMPARISON
        ↓
PASS / FAIL
        ↓
REPAIR EVIDENCE
```

PolicyProbe should feel:

- deterministic
- evidence-driven
- technical
- infrastructure-grade
- calm
- precise
- trustworthy
- open-source
- easy to audit

It should **not** feel:

- cyberpunk
- surveillance-themed
- generic “security SaaS”
- compliance-marketing-heavy
- overly financial
- like a blockchain explorer clone
- like an unofficial Hedera product
- like AquaQoS or another flow-routing product

---

# 2. Research Basis

The visual direction is grounded in the current public Hedera ecosystem and the project’s actual technical role.

## 2.1 Hedera — layers of trust

Hedera’s current brand refresh explicitly frames the ecosystem as **different interconnected layers of trust**.

Source:

- https://hedera.com/blog/a-new-era-for-hedera/

The current Hedera homepage reinforces this with:

- near-black backgrounds
- white typography
- violet/blue luminous layers
- rigid rectangular slabs
- multiple independent pieces aligning into one larger structure
- generous negative space
- restrained navigation

PolicyProbe should borrow the **concept of alignment and layered trust**, not copy the Hedera “H” or its proprietary artwork.

---

## 2.2 Hedera Developer Docs — clean modular tooling

The current Hedera developer documentation uses:

- white/light surfaces
- black typography
- violet accents
- modular rectangular cards
- low ornament
- practical navigation
- strong hierarchy

Source:

- https://docs.hedera.com/

This is the stronger reference for PolicyProbe’s day-to-day application UI than Hedera’s marketing homepage.

---

## 2.3 Hedera Harness — authoritative validation

Hedera Harness states:

> **The harness decides whether a run passed, not the agent.**

Its design philosophy is therefore directly aligned with PolicyProbe.

Source:

- https://github.com/hedera-dev/hedera-harness

Harness emphasizes:

- deterministic validation
- explicit failure reporting
- infrastructure failure vs application failure
- repair loops
- Git-backed evidence
- minimal CLI-first developer tooling

PolicyProbe should visually reflect **authority and evidence**, not “AI magic.”

---

## 2.4 Asset Tokenization Studio — controlled operations

ATS provides the flagship demonstration surface for PolicyProbe.

Its current product/docs language includes:

- bond/equity issuance
- KYC/AML controls
- transfer restrictions
- freeze/pause
- corporate actions
- audit trails

Sources:

- https://docs.tokenization-studio.hedera.com/
- https://github.com/hashgraph/asset-tokenization-studio

ATS visually uses dark charcoal, white, violet, and modular cards.

PolicyProbe should remain visually adjacent enough that ATS evidence feels native, but ATS is a **fixture**, not PolicyProbe’s brand foundation.

---

## 2.5 HashScan — evidence and verifiability

HashScan presents network state with:

- high-contrast black/white structure
- purple/magenta accents
- transaction-centric evidence
- data tables
- exact identifiers

PolicyProbe should borrow the principle:

> **proof should be inspectable and linkable**

not HashScan’s exact visual design.

---

## 2.6 Hiero — open-source neutrality

Hiero’s identity is:

- open-source
- vendor-neutral
- Linux Foundation-aligned
- simple geometric mark
- technical rather than consumer-facing

Source:

- https://hiero.org/

PolicyProbe should feel comfortable existing in an open-source developer ecosystem, not like a proprietary enterprise compliance suite.

---

## 2.7 Trademark boundary

Hedera’s terms protect its logos, designs, typefaces, marks, and other visual assets.

Source:

- https://hedera.com/terms/

Therefore:

- do not copy the Hedera “H”
- do not modify the Hedera logo
- do not imply PolicyProbe is an official Hedera product
- do not reuse Hedera’s homepage glass-layer artwork
- do not copy ATS or Hiero marks

PolicyProbe may use ecosystem-adjacent colors and visual principles while remaining independently identifiable.

---

# 3. Core Visual Principle

## Two states. One proof.

PolicyProbe’s entire visual language is derived from:

```text
EXPECTED
   +
OBSERVED
   ↓
COMPARE
   ↓
CONFORM / MISMATCH
```

This is fundamentally different from AquaQoS.

AquaQoS visualizes:

```text
many flows → scheduler → capacity
```

PolicyProbe visualizes:

```text
two states → deterministic comparison → evidence
```

Do not introduce:

- streams
- routing lanes
- input dots
- network pipes
- capacity flows

into PolicyProbe branding.

---

# 4. Brand Architecture

## Product name

Use:

# PolicyProbe

Correct casing:

```text
PolicyProbe
```

Avoid:

```text
POLICYPROBE
policyprobe
Policy Probe
Policyprobe
```

### Meaning

**Policy**

The intended behavioral rule.

**Probe**

A real action used to test whether that rule holds.

The name communicates active verification rather than passive scanning.

---

# 5. Brand Lines

Primary:

> **Expected. Executed. Verified.**

Secondary:

> **Prove the behavior.**

Technical description:

> Deterministic onchain behavioral assertions for Hedera Harness.

Long form:

> PolicyProbe executes real onchain actions, compares observed outcomes against declared expectations, and turns mismatches into structured repair findings.

Do not use “compliance” as the primary brand word.

PolicyProbe verifies **technical behavior**, not legal compliance.

---

# 6. Logo System

## 6.1 Core concept — State Conformance Mark

The PolicyProbe mark represents:

1. **expected state**
2. **observed state**
3. **comparison point**
4. **alignment / mismatch**

The canonical symbol should use two independent geometric forms.

Conceptually:

```text
EXPECTED STATE
┌───────
│
└───

        ◇  comparison / proof point

    ───┐
       │
───────┘
OBSERVED STATE
```

The two forms are related but intentionally offset.

Their relationship communicates:

> same policy, two states, one deterministic comparison

---

## 6.2 Meaning of each part

### White form

Represents:

```text
EXPECTED
```

The declared rule or intended behavior.

### Violet form

Represents:

```text
OBSERVED
```

The real onchain result.

### Central intersection / proof element

Represents:

```text
ASSERTION
```

The deterministic comparison.

The mark should still work in monochrome, so meaning cannot depend on color alone.

---

## 6.3 Why offset geometry

Expected and observed states should not initially appear perfectly identical.

A small deliberate offset communicates:

> verification is required because actual behavior may diverge from intended behavior

When used in motion:

```text
EXPECTED
    ─────

OBSERVED
       ─────
```

may move into:

```text
EXPECTED
    ─────
OBSERVED
    ─────
```

on PASS.

On FAIL, the mismatch remains visible.

---

## 6.4 Geometry rules

The logo must be:

- flat
- solid
- vector-friendly
- geometric
- primarily rectangular
- based on straight edges
- structurally balanced
- recognisable in monochrome

Allowed:

- rectangles
- open rectangular frames
- chamfers
- 45° cuts
- negative space
- one small comparison element

Avoid:

- circles as the primary structure
- shield outlines
- checkmarks
- magnifying glasses
- eyes
- locks
- chain links
- hexagons
- circuit-board traces
- random nodes
- arrows as the logo
- liquid curves
- gradients
- glass
- 3D
- glow
- shadows

---

## 6.5 Logo color

### Canonical dark lockup

```text
Background: #080808
Expected:   #FFFFFF
Observed:   #7C4DFF
```

### Monochrome white

```text
Mark:       #FFFFFF
Background: #080808
```

### Monochrome black

```text
Mark:       #090909
Background: #FFFFFF
```

### Light lockup

```text
Expected:   #111111
Observed:   #6F45E8
Background: #FFFFFF
```

The logo must remain recognizable if all elements become one color.

---

## 6.6 Favicon / avatar

Use only the symbol.

Test at:

- 16×16
- 24×24
- 32×32
- 48×48
- 128×128
- 400×400

At small sizes:

- reduce internal detail
- preserve the expected/observed offset
- preserve central comparison point
- remove any fragile gaps
- never include wordmark

Recommended avatar:

```text
white + violet mark
on near-black square
```

---

# 7. Color System

## 7.1 Primary foundation

### Probe Black

```css
--pp-black: #080808;
```

Purpose:

- landing hero
- technical surfaces
- evidence panels
- terminal-style sections
- primary dark theme

Use true near-black rather than blue-black.

---

### Paper White

```css
--pp-white: #FFFFFF;
```

Purpose:

- primary text on black
- light mode
- expected-state encoding
- documentation surfaces

---

### Probe Violet

```css
--pp-violet: #7C4DFF;
```

Purpose:

- observed state
- active controls
- selected assertions
- important links
- run progress
- brand accent

This is Hedera-adjacent, not intended as an official Hedera brand token.

Do not use many violet variants.

---

## 7.2 Neutral scale

```css
--pp-gray-950: #0B0B0B;
--pp-gray-900: #121212;
--pp-gray-850: #181818;
--pp-gray-800: #202020;
--pp-gray-700: #303030;
--pp-gray-600: #4B4B4B;
--pp-gray-500: #6B6B6B;
--pp-gray-400: #9B9B9B;
--pp-gray-300: #C7C7C7;
--pp-gray-200: #E2E2E2;
--pp-gray-100: #F3F3F3;
--pp-gray-50:  #FAFAFA;
```

---

## 7.3 Functional colors

Functional state colors should be distinct from brand color.

### PASS

```css
--pp-pass: #22C55E;
```

### WARNING / INCONCLUSIVE

```css
--pp-warning: #F59E0B;
```

### FAIL

```css
--pp-fail: #EF4444;
```

### INFRASTRUCTURE ERROR

Use a neutral technical color rather than FAIL red:

```css
--pp-infra: #64748B;
```

This is important because Harness explicitly distinguishes:

```text
application failure
```

from:

```text
infrastructure/tooling failure
```

The UI must preserve that distinction.

---

# 8. State Color Semantics

Never use violet to mean PASS.

Violet means:

> PolicyProbe / observed state / active comparison

Green means:

> deterministic assertion satisfied

Red means:

> deterministic behavioral mismatch

Amber means:

> warning / incomplete evidence / transient state

Slate means:

> infrastructure/tooling failure

This prevents brand color from being confused with test result.

---

# 9. Color Usage Ratio

## Marketing / hero

Typical:

```text
65–80% black
15–25% white
5–10% violet
```

PolicyProbe should feel darker than AquaQoS.

---

## Product UI

Typical:

```text
55–70% neutral
15–25% white/light structure
5–10% violet
<10% status colors
```

Status colors appear only when a real state is being communicated.

---

# 10. Typography

Use one modern grotesk family for product UI.

Preferred:

1. Geist
2. Inter
3. system sans-serif

Suggested stack:

```css
font-family:
  Geist,
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

---

## 10.1 Monospace

Use monospace intentionally for:

- transaction IDs
- account IDs
- contract addresses
- assertion IDs
- command output
- actual/expected values
- error codes
- code

Preferred:

```text
Geist Mono
ui-monospace
SFMono-Regular
Consolas
```

Do not use monospace for the whole interface.

---

## 10.2 Type hierarchy

### Display

```text
56–80px desktop
42–52px tablet
36–44px mobile
Weight: 500–650
Tracking: -0.04em
```

### H1

```text
44–56px
Weight 600
```

### H2

```text
30–38px
Weight 600
```

### H3

```text
20–26px
Weight 600
```

### Body

```text
15–17px
Line-height 1.5–1.65
```

### Evidence label

```text
11–12px
Uppercase optional
Tracking 0.06–0.10em
Weight 600
```

Use uppercase only for structural metadata, not paragraphs.

---

# 11. Layout System

PolicyProbe should use a modular, evidence-oriented grid.

## Marketing width

```text
max-width: 1440px
content: 1180–1260px
```

## Product width

```text
max-width: 1600px
```

## Grid

Desktop:

```text
12 columns
24px gutters
```

Mobile:

```text
4 columns
16px gutters
```

## Spacing scale

```text
4
8
12
16
24
32
48
64
96
128
```

---

# 12. Corners

PolicyProbe should be more rigid than consumer SaaS.

Recommended:

```text
small controls: 6–8px
buttons:        8–10px
cards:          10–12px
large panels:   12–14px
```

Avoid:

```text
24–32px rounded cards
pill-shaped everything
```

This is developer infrastructure.

---

# 13. Borders and Surfaces

Use subtle borders to establish evidence boundaries.

Dark mode:

```css
border: 1px solid rgba(255,255,255,0.10);
```

Light mode:

```css
border: 1px solid rgba(0,0,0,0.10);
```

Prefer:

- flat panels
- subtle elevation
- clear section dividers

Avoid:

- glass blur
- neon borders
- violet glow
- floating translucent cards

---

# 14. Hero Experience

Recommended hero:

```text
PolicyProbe

Expected.
Executed.
Verified.

Deterministic onchain behavioral assertions
for Hedera Harness.

[Run the demo] [View the Harness PR]
```

Adjacent visual:

```text
EXPECTED
KYC=false → transfer MUST REVERT

                         compare
                           ◆

OBSERVED
transaction succeeded
balance +100

                        FAIL
```

This communicates the project faster than abstract blockchain artwork.

---

# 15. Main Product Mental Model

Every run should visually follow:

```text
POLICY
  ↓
ACTOR
  ↓
ACTION
  ↓
EXECUTION
  ↓
OBSERVATION
  ↓
ASSERTION
  ↓
RESULT
  ↓
REPAIR
```

Use this sequence consistently across:

- architecture diagrams
- run detail
- demo
- documentation
- technical paper
- pitch video

---

# 16. Assertion Card

A single assertion should be readable in seconds.

Example:

```text
PP-017

Unverified investor must not receive bond

ACTOR
Bob · KYC=false

ACTION
Transfer 100 BOND

EXPECTED
REVERT

OBSERVED
SUCCESS

RESULT
FAIL
```

Below:

```text
Evidence
Transaction    0.0.123@...
Balance delta  +100
Network        Hedera Testnet
```

The expected/observed comparison is the visual center.

---

# 17. Expected vs Observed Design

Use a strict two-column model on desktop:

```text
EXPECTED              OBSERVED
────────────────────────────────
REVERT                 SUCCESS
balance delta = 0      balance delta = +100
```

Rules:

### Expected

- neutral white/gray
- no green before comparison
- represents declaration, not truth

### Observed

- violet accent
- real network evidence

### Result

Only after comparison:

```text
PASS / FAIL
```

gets functional state color.

This is critical.

Do not make expected = green and observed = violet by default.

---

# 18. Result States

## PASS

```text
✓ PASS
```

Use:

- green status indicator
- concise explanation
- evidence still accessible

Example:

```text
Expected: REVERT
Observed: REVERT

PASS
```

---

## FAIL

```text
× FAIL
```

Use:

- red status indicator
- mismatch emphasized
- exact evidence exposed
- repair finding visible

Example:

```text
Expected: REVERT
Observed: SUCCESS

FAIL
```

---

## INFRASTRUCTURE ERROR

Never present this as a policy FAIL.

Example:

```text
! RUN ABORTED

Mirror Node unavailable.
Application behavior was not evaluated.
```

Use slate/neutral state.

This mirrors Harness philosophy:

> infrastructure failure is not application failure

---

## PENDING / WAITING FOR NETWORK

Use amber or neutral.

Example:

```text
WAITING FOR MIRROR CONFIRMATION
```

Do not briefly flash FAIL while data is still pending.

---

# 19. Repair Timeline

This is one of the most important visual features.

Example:

```text
Attempt 1
× FAIL
Unverified investor received 100 BOND

        ↓

Repair
Changed KYC transfer guard

        ↓

Attempt 2
✓ PASS
Transfer correctly reverted
```

Each attempt is a discrete block.

Do not draw an elaborate flowchart.

The story should be obvious in one vertical timeline.

---

# 20. Run Overview

Recommended summary:

```text
RUN #018

12 assertions
10 passed
1 failed
1 infrastructure error

Hedera Testnet
ATS Bond Fixture

Duration  2m 14s
```

Result hierarchy:

1. failures
2. infrastructure errors
3. passes

Do not hide failures beneath a large success percentage.

---

# 21. Evidence Panel

PolicyProbe should treat evidence as a first-class product surface.

Each evidence block can include:

```text
Transaction ID
Consensus timestamp
Account ID
Contract address
Token ID
Expected outcome
Observed outcome
Before state
After state
Mirror Node evidence
Harness finding ID
Repair attempt
```

Use monospace for identifiers.

Support:

```text
Copy
Open in HashScan
View raw JSON
```

where appropriate.

---

# 22. HashScan Integration

When linking evidence externally:

- clearly label it as HashScan
- do not visually imitate HashScan
- open the exact transaction/account/token
- distinguish external evidence from PolicyProbe’s own evaluation

Example:

```text
Network evidence
0.0.123456@...
[Open in HashScan ↗]
```

---

# 23. ATS Fixture UI

ATS is the demonstration environment.

Do not rebuild ATS.

PolicyProbe only needs a thin fixture/evidence layer showing:

```text
Asset
Atlas Infrastructure Bond

Token ID
0.0.x

Rules
KYC required
Freeze enabled
Pause enabled

Actors
Issuer
Verified investor
Unverified investor
Frozen investor
Unauthorized actor
```

The focus is the policy tests.

Not financial analytics.

---

# 24. Actor System

Actors should have plain, role-based identity.

Example:

```text
ALICE
Verified investor

BOB
Unverified investor

CAROL
Frozen investor

EVE
Unauthorized actor
```

Use small geometric avatars or initials.

Avoid:

- cartoon avatars
- generated profile pictures
- crypto PFPs

Actor identity exists only to make adversarial behavior understandable.

---

# 25. Policy Visualization

Policies should look like executable rules.

Good:

```text
IF investor.kyc == false
THEN transfer MUST REVERT
```

Better for nontechnical viewers:

```text
Unverified investors
MUST NOT receive the bond
```

Support both:

```text
Human rule
Technical assertion
```

Do not display legal/regulatory claims.

---

# 26. Proof Page

The `/proof` page is the reviewer-facing verification surface.

It should be sparse.

Example:

```text
POLICYPROBE PROOF

Harness contribution
PR #___

Upstream base
hedera-dev/hedera-harness
dev @ <sha>

Tests
___ passing

Hedera Testnet
Verified

ATS fixture
Bond 0.0.x

Failure → repair → pass
Verified

Source
GitHub

Demo
Watch
```

Additional:

```text
Assertion types
mustSucceed
mustRevert
reasonContains
balanceDelta
```

No marketing hero.

No animation.

---

# 27. Developer / CLI Surface

PolicyProbe is fundamentally developer tooling.

CLI output should be excellent.

Example:

```text
POLICYPROBE

PP-001  reject-unverified-transfer

  actor       alice
  action      transfer to an unverified investor
  expected    mustRevert
  observed    SUCCESS

  result      FAIL

  finding     chain-assertion:reject-unverified-transfer
  tx          0xdcf971…8877c
```

Use:

- spacing
- indentation
- restrained color
- exact language

Do not use excessive emojis in CLI.

---

# 28. Architecture Diagram Style

Diagrams should use:

- rectangular boxes
- straight connectors
- one accent color
- clear arrows
- no gradients
- no decorative clouds

Canonical:

```text
Policy / Recipe
      ↓
Harness
      ↓
Actor + Action
      ↓
Hedera Testnet
      ↓
Observed State
      ↓
PolicyProbe Assertion
      ↓
PASS / FINDING
      ↓
Harness Repair Loop
```

ATS sits as an application fixture, not as the central system.

---

# 29. Motion System

Motion should explain **comparison and repair**.

Allowed:

### State alignment

Observed state moves toward expected state.

### Comparison

A subtle line/square locks into place when evaluation completes.

### Repair

Failed attempt transitions to repaired attempt.

### Evidence reveal

Transaction/state details expand.

Durations:

```text
micro:      120–180ms
standard:   180–260ms
comparison: 300–500ms
timeline:   400–650ms
```

No:

- floating particles
- glowing blockchain nodes
- perpetual background animation
- 3D glass slabs
- scanning radar
- “hacker” matrix effects

Respect `prefers-reduced-motion`.

---

# 30. Landing Page Structure

Recommended:

## Hero

```text
PolicyProbe

Expected.
Executed.
Verified.

Deterministic behavioral assertions
for AI-built Hedera applications.

[See it fail] [View source]
```

---

## Problem

Headline:

> A successful transaction does not prove correct behavior.

Show:

```text
Harness action exits 0
           ≠
application policy is correct
```

---

## How it works

```text
Declare
Execute
Observe
Compare
Repair
```

Five simple blocks.

---

## Killer demo

Show:

```text
Unverified investor receives bond

Expected
REVERT

Observed
SUCCESS

FAIL
```

Then:

```text
Harness repairs implementation
```

Then:

```text
Same probe
REVERT

PASS
```

---

## Upstream contribution

Show:

- Hedera Harness PR
- test count
- assertion API
- exact files
- open-source contribution

---

## Evidence

Show real Testnet transaction / HashScan link.

---

# 31. Navigation

Recommended:

```text
PolicyProbe
Overview
Runs
Assertions
Demo
Proof
Docs
GitHub
```

If the final app is intentionally small:

```text
PolicyProbe
Demo
Proof
Docs
GitHub
```

Do not copy Hedera’s navigation shell.

---

# 32. Buttons

## Primary

Dark surface:

```text
background: #7C4DFF
text: #FFFFFF
```

Light surface:

```text
background: #111111
text: #FFFFFF
```

## Secondary

Transparent with subtle border.

## Danger

Red only for destructive actions.

Do not use violet for “FAIL.”

---

# 33. Iconography

Preferred:

- Lucide or similar consistent outline set
- 1.5–2px stroke
- square optical bounds
- minimal use

Relevant icons:

- terminal
- code
- git branch
- external link
- copy
- clock
- account/user
- database/state
- check
- x

Avoid:

- shield icon as the main project metaphor
- generic blockchain cube
- fingerprint
- eye
- magnifying glass branding

---

# 34. Data Tables

Evidence-heavy tables should:

- use sticky headers when long
- keep IDs monospace
- right-align numeric deltas
- expose result clearly
- avoid zebra striping unless needed
- allow copying identifiers
- support compact density

Example:

| Assertion | Expected | Observed | Result |
|---|---|---|---|
| KYC receive | REVERT | SUCCESS | FAIL |
| Frozen transfer | REVERT | REVERT | PASS |
| Admin freeze | SUCCESS | SUCCESS | PASS |

---

# 35. Benchmark Visualization

PolicyProbe’s strongest benchmarks are not TPS charts.

Useful metrics:

- deterministic assertions executed
- intentional defects caught
- false PASS rate
- false FAIL rate
- repair attempts to convergence
- before/after custom validator code
- time to identify defect

Use:

- simple bar charts
- dot plots
- attempt timelines

Do not show vanity metrics.

---

# 36. Documentation Style

Docs should look closer to developer tooling than marketing.

Use:

- white or near-black background
- high contrast
- clear code blocks
- violet only for links/active state
- numbered examples
- visible expected/observed pairs

Core docs:

```text
Quick Start
Assertion Model
Transaction Assertions
State Assertions
Findings
Repair Loop
ATS Example
Architecture
Limitations
```

---

# 37. Copy Style

PolicyProbe copy should be factual and exact.

Prefer:

> Expected the transfer to revert. It succeeded and increased the recipient balance by 100.

Avoid:

> PolicyProbe's revolutionary verification intelligence detected a critical compliance anomaly.

Prefer:

> Infrastructure error. The application was not evaluated.

Avoid:

> Verification failed.

when the real issue was tooling/network availability.

---

# 38. Terminology Rules

Use:

- assertion
- expected
- observed
- evidence
- behavioral mismatch
- postcondition
- finding
- repair
- actor
- action
- testnet
- technical policy
- behavioral conformance

Avoid as unqualified claims:

- compliant
- certified
- legally valid
- regulator approved
- secure
- formally verified

PolicyProbe does not replace:

- legal review
- security audit
- formal verification

---

# 39. Accessibility

Minimum:

- WCAG AA contrast
- keyboard navigation
- visible focus
- semantic headings
- 44px practical touch targets
- status not communicated by color alone
- reduced motion
- screen-reader labels on result state
- tables with real headers

Use:

```text
✓ PASS
× FAIL
! INFRASTRUCTURE ERROR
… PENDING
```

not only green/red/gray.

---

# 40. Responsive Design

On mobile prioritize:

1. assertion title
2. expected
3. observed
4. result
5. evidence link
6. repair timeline

Stack:

```text
EXPECTED
↓
OBSERVED
↓
RESULT
```

instead of forcing two tiny columns.

Raw JSON and technical detail may live in collapsible panels.

---

# 41. Design Tokens

Suggested starting point:

```css
:root {
  --pp-black: #080808;
  --pp-white: #ffffff;
  --pp-violet: #7c4dff;

  --pp-gray-950: #0b0b0b;
  --pp-gray-900: #121212;
  --pp-gray-850: #181818;
  --pp-gray-800: #202020;
  --pp-gray-700: #303030;
  --pp-gray-600: #4b4b4b;
  --pp-gray-500: #6b6b6b;
  --pp-gray-400: #9b9b9b;
  --pp-gray-300: #c7c7c7;
  --pp-gray-200: #e2e2e2;
  --pp-gray-100: #f3f3f3;
  --pp-gray-50: #fafafa;

  --pp-pass: #22c55e;
  --pp-warning: #f59e0b;
  --pp-fail: #ef4444;
  --pp-infra: #64748b;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

Treat these as project tokens, not official Hedera brand values.

---

# 42. Frontend Build Priority

Until the Harness contribution and testnet evidence are stable:

> **Usable > polished.**

Final frontend priority:

1. correctness of evidence
2. expected/observed hierarchy
3. result clarity
4. repair story
5. reviewer verification
6. responsive layout
7. typography
8. spacing
9. brand polish
10. motion

Never let UI polish delay the upstream PR or real testnet proof.

---

# 43. Explicit Anti-Patterns

## Branding

Do not use:

- Hedera “H” derivative
- Hiero logo derivative
- shield
- lock
- magnifying glass
- eye
- checkmark-in-circle as primary mark
- blockchain hexagon
- chain links
- random nodes
- AquaQoS-style lanes
- gradients
- glass
- glow
- 3D

## UI

Do not use:

- security-SOC aesthetic
- red alerts everywhere
- Matrix terminal backgrounds
- giant graphs unrelated to proof
- token-price charts
- glass cards
- crypto trading terminal layout
- excessive cards
- decorative blockchain animation

## Copy

Do not claim:

- “legally compliant”
- “guaranteed secure”
- “certified”
- “formal proof”

unless technically true and precisely qualified.

---

# 44. Review Experience

The review path should make it easy to inspect:

- clean Harness diff
- tests
- assertion API
- upstream PR
- ATS fixture
- recorded testnet evidence

The interface links each claim to its source or transaction record.

---

# 45. Canonical Demo Story

Use one deliberately broken rule:

> **An unverified investor must not receive the bond.**

### Expected

```text
mustRevert
```

### Observed

```text
SUCCESS
```

### PolicyProbe

```text
FAIL
chain-assertion:reject-unverified-transfer
```

### Repair

The same assertion passes against the whitelist-enabled bond.

### Rerun

```text
Expected: mustRevert
Observed: CONTRACT_REVERT_EXECUTED
PASS
```

This story should influence:

- homepage
- screenshots
- demo video
- architecture
- README
- project website
- project documentation

---

# 46. Visual Identity Formula

PolicyProbe should visually equal:

```text
HEDERA-ADJACENT TRUST
+
HARNESS DETERMINISM
+
HASHSCAN-LIKE EVIDENCE DISCIPLINE
+
OPEN-SOURCE TOOLING RESTRAINT
```

Rendered as:

```text
NEAR BLACK
+
PURE WHITE
+
CONTROLLED VIOLET
+
RECTANGULAR LAYERS
+
EXPECTED / OBSERVED PAIRS
+
EXACT EVIDENCE
+
MINIMAL MOTION
```

---

# 47. Final Brand Rule

If an element cannot be explained in terms of:

- expected behavior
- observed behavior
- deterministic comparison
- evidence
- pass/fail
- repair
- Hedera execution

remove it.

PolicyProbe should feel **designed from verification outward**, not decorated like a generic blockchain security product.
