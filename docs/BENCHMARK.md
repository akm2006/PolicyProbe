# Measured benchmark

Measurements compare the Harness feature branch with
`hedera-dev/hedera-harness:dev` at `587a2f335c29835e9505d9f13e230b8d677c0674`.

## Capability change

| Measure | Base | Feature branch |
|---|---:|---:|
| Declarative action-outcome assertion families | 0 | 2: outcome and balance delta |
| Named assertion actors | 0 | Supported |
| Typed policy/infrastructure finding categories | 0 | 2 |
| Harness tests | 195 | 277 |

The actor boundary composes with both assertion families rather than adding another evidence
primitive.

## Diff size

Measured with `git diff --stat upstream/dev` after the cleanup:

- 21 files changed
- 2,885 insertions and 36 deletions
- 1,174 production and prompt insertions
- 1,599 test insertions across seven test files
- 112 documentation insertions
- 82 tests added to the full Harness suite

A typical transaction-outcome assertion adds about six lines to a recipe. The shared engine owns
command execution, identifier extraction, Mirror Node polling, outcome comparison, findings,
actor lifecycle, and redaction.

## Local verification

On Windows with Node 22:

- Harness TypeScript typecheck: pass
- Harness build via direct `tsc`: pass
- Feature-focused suites: 75 pass, 0 fail, 6 credential-gated live tests skipped
- Full direct suite: 257 pass, 14 fail, 6 skipped
- ATS fixture TypeScript build: pass
- ATS fixture production dependency audit: 0 known vulnerabilities

The 14 full-suite failures are pre-existing Windows assumptions in upstream tests, including
POSIX `true`, path-separator assertions, and process-group signal behavior. The feature-focused
tests are portable after this cleanup. The canonical `npm test` script also uses POSIX `rm` and
therefore requires Linux or macOS until upstream Windows support lands. A fresh Linux CI run is a
publication gate.

## Testnet evidence

The recorded ATS run evaluates six policies and reports six passes. The before/after comparison
detects a whitelist-disabled bond because the forbidden transfer succeeds, then passes against
the corrected bond when the same transfer reverts. See
[`fixtures/ats-bond/EVIDENCE.md`](../fixtures/ats-bond/EVIDENCE.md) for the disclosed contract and
transaction identifiers.

No repeated-run false-positive/false-negative rate is claimed; that would require a separately
designed experiment.
