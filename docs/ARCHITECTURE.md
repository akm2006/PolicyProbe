# Architecture

PolicyProbe extends the existing Harness `CHAIN` stage after deployment and before the dev
server starts. Recipes without actors or assertions follow the original execution path.

## Execution path

1. Harness provisions its primary signer and any named actors.
2. Each assertion optionally samples a balance before the action.
3. The action command runs with only its selected actor exposed through the existing signer
   environment variables.
4. The command prints a Hedera transaction ID or EVM transaction hash.
5. Harness polls Mirror Node and classifies the evidence as found, not found, or an
   infrastructure error.
6. Code compares the confirmed outcome and optional balance delta with the declaration.
7. A mismatch emits `chain-assertion`; an unavailable command, RPC, or evidence source emits
   `chain-assertion-infra`.
8. Policy findings enter the normal runtime repair prompt. Infrastructure findings do not
   masquerade as application defects.

## Trust boundaries

- The recipe controls action commands, actor names, and expected outcomes.
- Harness injects signer secrets into the selected child process. It redacts those values from
  findings, attempt reports, and repair prompts.
- Mirror Node is the independent source for consensus results and balances. Missing evidence is
  never treated as a successful assertion.
- Standard `Error(string)` revert data can be decoded generically. Contract-specific custom
  errors require that contract's ABI and otherwise remain coarse result codes.
- Actor-role setup belongs to the fixture or application. The engine proves the declared action
  outcome for that signer; it does not infer legal identity or regulatory status.

## Assertion families

- Transaction outcome: `mustSucceed` or `mustRevert`, with optional `reasonContains`.
- Balance delta: exact signed integer changes for HBAR, native HTS tokens, or an ERC-20
  `balanceOf` contract.
- Actor boundary: apply either assertion family using a separately provisioned named signer.

These primitives stay generic; the ATS bond is one integration fixture, not a dependency of
the Harness implementation.
