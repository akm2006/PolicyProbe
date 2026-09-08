---
name: policyprobe-onchain-validation
description: Use for designing or implementing assertions, testnet execution, Mirror Node reads, or HTS/ATS behavioral checks — anything deciding PASS/FAIL for an on-chain postcondition.
---

# PolicyProbe: on-chain validation work

1. **Distinguish consensus receipt from Mirror Node eventual visibility.** A receipt proves
   consensus; a mirror-node 404 seconds later is lag, not absence. Never treat one as proof of
   the other without stating which you're asserting.
2. **Distinguish infrastructure failure from application failure.** RPC timeout, mirror lag,
   signer provisioning error (`INVALID_SIGNATURE`, insufficient balance) are infra — they get
   an `*-infra` finding category and are never fed to the repair loop as a policy violation
   (mirrors `eval-infra` — see `docs/HARNESS_ARCHITECTURE.md`).
3. **Distinguish expected revert from infrastructure error.** A `mustRevert` assertion needs to
   tell "the call reverted for the reason the policy expects" apart from "the RPC call itself
   failed" — don't conflate them into one boolean.
4. **Every PASS must have deterministic evidence** — a transaction id, a receipt, a sampled
   balance — attached to the finding/result, not just a boolean. Never assert PASS from an LLM
   judgment for this layer; that's what EVALUATE is already for.
5. **Fail closed on ambiguous evidence.** If you can't determine the outcome deterministically,
   that's an infra finding, not a PASS and not a policy-violation FAIL.
6. **Keep the assertion schema general**, not ATS-specific. KYC/freeze/pause/coupon checks are
   thin adapters over the general primitives (transaction outcome, balance/state delta,
   actor-authorization boundary) — see `docs/PROJECT_CHARTER.md`.
7. Account for: before/after sampling order, balance delta direction, integer units/decimals,
   duplicate transaction events, actor/signer identity, token association requirements.
8. Redact secrets from anything written to logs/artifacts — never let a private key reach a
   finding, log line, or test fixture.
9. Never claim legal/regulatory compliance in code comments, findings, or docs — "behavioral
   conformance" / "deterministic assertion" / "expected on-chain behavior" only.
