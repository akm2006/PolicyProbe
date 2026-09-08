# Project Charter

## Validated problem

Hedera Harness (`hedera-dev/hedera-harness`, branch `dev`) drives a coding agent through
GENERATE → ASSERT → SMOKE → EVALUATE, optionally provisioning a funded ephemeral testnet
signer (`chainValidation`) that either runs on-chain deploy commands (SMOKE) or is exposed
to the app as a burner wallet during EVALUATE. Confirmed by reading `src/attemptStages.ts`,
`src/validation/chainSigner.ts`, `src/evaluation.ts`, `src/types.ts` at base SHA
`587a2f335c29835e9505d9f13e230b8d677c0674`:

- Real signed transactions can land on testnet (`chainSigner`).
- Whether those transactions **obeyed an application-level policy** — an unauthorized actor
  was rejected, a balance moved by exactly the right amount, a paused/frozen/KYC-gated action
  failed the way it should — is judged, if at all, by the EVALUATE agent's semantic reading of
  a checklist (`category: "eval"`). There is no code path that executes an action and checks
  its outcome deterministically, independent of an LLM's judgment.
- `ValidationFinding.category` is a closed union (`files | static | secret | commands | agent |
  playwright | eval | eval-infra`) with no slot for "the transaction I just ran had the wrong
  effect." Two open PRs (#39, #43) add Mirror Node **reading** — but only for
  infra-reliability/entity-existence, not for asserting *outcome vs. expected policy* of an
  *executed* action across *distinct actor identities*. See `docs/HARNESS_ARCHITECTURE.md` and
  `docs/COMPETITOR_AUDIT.md`.

## Thesis

**PolicyProbe extends Hedera Harness with deterministic on-chain behavioral postcondition
assertions**, so an AI-built Hedera app can prove that critical rules actually hold on
testnet — not merely that a transaction happened. A recipe author declares an expected
outcome (`mustSucceed` / `mustRevert` / balance delta / actor-boundary), the harness executes
it against real testnet state with a real signer, evaluates the outcome in code (not an
LLM), and — on mismatch — emits a typed `ValidationFinding` that flows through the existing
repair loop exactly like any other finding.

## User

A developer (often working with an AI coding agent) building a Hedera application with
security- or compliance-relevant invariants — token controls, role-gated operations,
regulated-asset transfer rules — who currently has no reusable way to make Harness prove
those invariants hold on-chain, only that the UI/agent claims they do.

## Why Harness, not a standalone tool

Harness already owns generation → validation → repair. A standalone verifier would create a
second, disconnected pass/fail authority and a second repair path. Feeding failures into the
existing `ValidationFinding` / repair-prompt machinery means a caught violation gets fixed by
the same loop that fixes everything else, with no new mental model for the developer.

## Why ATS is the flagship fixture, not the invention

Asset Tokenization Studio bonds carry several *independent, adversarially testable* invariants
(KYC gating, freeze, pause, role-gated compliance actions, coupon/redemption math) in one small
asset — the best available proof case for a *generic* postcondition mechanism. The mechanism
must not be ATS-specific; ATS-flavored assertions are a thin adapter over a general primitive
(transaction outcome, balance/state delta, actor-boundary). See `docs/ACCEPTANCE_CRITERIA.md`.

## Primary scope (MVP)

1. Transaction-outcome assertion: `mustSucceed` / `mustRevert`.
2. Balance/state-delta assertion (one deterministic contract/HTS read, before/after).
3. Actor-authorization-boundary assertion (actor X may act; actor Y must be rejected) — this
   is a thin composition of (1)+(2) over multiple signer identities, not a new primitive.
4. Structured `ValidationFinding` integration (new category, infra-vs-app-failure distinction
   mirroring the existing `eval` / `eval-infra` pattern) feeding the repair loop unchanged.
5. Real Hedera testnet proof, ATS bond fixture exercising all of the above, deliberate
   broken-policy → repair → pass demo.

## Stretch scope

- Policy mutation testing (intentionally break a rule, measure detection rate).
- ATS-specific convenience adapters (`kyc`, `freeze`, `pause` sugar over the general primitives).
- Judge-facing evidence console (proof page, run detail, repair timeline).
- Upstream ATS contribution, if a natural gap surfaces during the fixture build.

## Non-goals

- A general policy DSL. Start with the smallest expressive schema that proves the thesis.
- A generic Mirror Node wrapper as the headline (adjacent to PR #39/#43 — reuse, don't rebuild).
- A generic contract-security scanner (adjacent to PR #40).
- Real KYC vendor integration, legal-compliance engine, secondary market, multi-chain support,
  DAO/NFT features, ML underwriting, large branding effort, AI chatbot.
- Any claim of legal or regulatory compliance — PolicyProbe verifies **technical behavior**.
