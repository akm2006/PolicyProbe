# feat(chain): add deterministic on-chain postcondition assertions

## Problem

A CHAIN deploy command can exit successfully while the resulting application violates a recipe's
intended on-chain behavior. Existing semantic evaluation can inspect evidence, but recipes cannot
declare that a specific action by a specific signer must succeed, must revert, or move an exact
balance and receive a deterministic finding when it does not.

## Result

This change adds optional `chainValidation.actors` and `chainValidation.assertions`. Harness
executes each declared action, confirms its Hedera transaction ID or EVM hash through Mirror Node,
compares the confirmed outcome and optional balance delta, and feeds mismatches into the existing
repair loop.

```yaml
chainValidation:
  enabled: true
  network: testnet
  actors:
    attacker: { fundingHbar: 5 }
  assertions:
    - id: reject-unauthorized-transfer
      actor: attacker
      action:
        name: attempt-transfer
        command: npx tsx scripts/transfer.ts
      expect:
        outcome: mustRevert
```

## Implementation

- Parses and validates named actors, expected outcomes, revert substrings, and exact HBAR, native
  HTS, or ERC-20-compatible balance deltas.
- Provisions and sweeps named ephemeral signers through the existing chain-signer lifecycle.
- Classifies confirmed mismatches as `chain-assertion` and unavailable commands or evidence as
  `chain-assertion-infra`.
- Routes policy findings to runtime repair while excluding infrastructure findings from repair
  scope.
- Redacts primary and actor keys from reports, persisted prompts, and repair output.
- Adds recipe authoring documentation and focused coverage for schema validation, evidence resolution,
  actor provisioning, assertion execution, and reporting redaction.

Existing recipes without actors or assertions retain their current behavior. The change adds no
production dependency and contains no application-specific policy or ATS code.

## Verification

- `npm run typecheck`: pass on Windows
- direct `tsc -p tsconfig.json`: pass on Windows
- focused Harness tests: 72 pass, 0 fail, 6 credential-gated live tests skipped
- [Ubuntu CI](https://github.com/akm2006/PolicyProbe/actions/runs/34677303566) passed the full Harness
  test, typecheck, build, package smoke, browser tests, and ATS fixture build/audit
- recorded ATS testnet fixture: 6 policy assertions pass; transaction evidence is linked from the
  companion PolicyProbe repository

The full upstream suite contains POSIX-only commands and process assumptions, so the Windows run
is not authoritative for those cases. The full suite passed in the linked Ubuntu CI run.

## Review order

1. `src/types.ts` and `src/specLoader.ts`
2. `src/validation/chainAssertionEvidence.ts`
3. `src/validation/chainAssertions.ts`
4. `src/attemptStages.ts` and `src/validation/chainSigner.ts`
5. reporting, prompt integration, tests, and authoring documentation
