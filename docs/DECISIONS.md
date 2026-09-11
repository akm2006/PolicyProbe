# Design decisions

## ADR-001: Extend the existing CHAIN stage

**Decision:** Run declarative postconditions after chain deployment and before the dev server.

**Reason:** This reuses signer provisioning, command execution, findings, reporting, and the
repair loop. A separate runner would duplicate lifecycle and security code.

## ADR-002: Separate policy and infrastructure findings

**Decision:** Emit `chain-assertion` for confirmed mismatches and `chain-assertion-infra` when an
action or evidence source cannot provide a trustworthy result.

**Reason:** A network outage, missing receipt, timeout, or command crash must not trigger a code
repair for an application policy that was never evaluated.

## ADR-003: Keep ATS-specific behavior in the fixture

**Decision:** The Harness engine knows only outcomes, actors, transaction identifiers, and
balances. ATS addresses, roles, action scripts, and policy declarations remain under
`fixtures/ats-bond`.

**Reason:** The upstream capability must work for any Hedera application and add no ATS runtime
dependency.

## ADR-004: Preserve generated-package attribution

**Decision:** Keep the adapted ATS deployment logic in a clearly attributed file and license the
submission repository under Apache-2.0.

**Reason:** The fixture adapts part of an Apache-2.0 ATS deployment script. The Harness fork
retains its upstream MIT license.

## ADR-005: Record evidence, never credentials

**Decision:** Commit public account, contract, and transaction identifiers needed to verify
testnet results. Ignore private keys, actor files, environment files, and transient run output.

**Reason:** Public chain identifiers are evidence. Signer material provides control of accounts
and must remain outside Git history.
