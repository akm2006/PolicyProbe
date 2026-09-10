# ATS Bond Fixture — Real Testnet Evidence

Every transaction below is real, on Hedera testnet, independently verifiable via
`https://hashscan.io/testnet/transaction/<hash>` or the Mirror Node REST API
(`https://testnet.mirrornode.hedera.com/api/v1/contracts/results/<hash>`). None are simulated.

## Deployment

Issued through the existing ATS factory (`0.0.9213391` / `0xd1F118A40f3b02883D35909eF2517e7EDd78379d`),
not a self-deployed system — see `docs/DECISIONS.md` for why.

| Bond | Diamond address | Config | Deploy tx |
|---|---|---|---|
| **Fixed (Session 2026-09-11)** — "Atlas Infrastructure Note 2027" | `0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a` | `isWhiteList: true` | `0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94` |
| **Fixed (Prior session)** — "Atlas Infrastructure Note 2027" | `0x19CD7866076758E3AF6C79aD7Ce725331A5606B8` | `isWhiteList: true` | `0x483922db058fd105577d8087bdf449b41854e80647d756f1de4958e0a24c6aa2` |
| **Broken** (killer demo "before") | `0xeff72A209498C890e3583702bD7818570a5c9E03` | `isWhiteList: false` — compliance gating left off | `0x44db454238b929e18a287c908d05bb4473cd94588ba8fc9022dd5bffc1749387` |
| Abandoned attempt (internal KYC / VC-issuer path, too deep for this fixture's scope) | `0xBce4fBebBB5188e8F8e5A1f15A18589595DaEdD8` | `internalKycActivated: true` | `0x96063c55a83fe019edbebaf0482a27b117c2d22f7c663db48893411544002ff7` |

## Actors (funded testnet accounts, created for this demo)

| Actor | Account ID | Role in the story |
|---|---|---|
| Alice | `0.0.10432566` | verified investor |
| Bob | `0.0.10432567` | initially unverified, later whitelisted |
| Carol | `0.0.10432568` | verified, later frozen |
| Attacker | `0.0.10432569` | never whitelisted, no roles granted |

Private keys live only in `.actors.json` (gitignored, never committed).

## Policy suite — real chain-assertion engine run (`run-policy-suite.mjs`), fixed bond

**6 / 6 PASS**, `runChainAssertions` (the actual Harness fork export, not a reimplementation):

| Assertion | Expect | Real tx | Result |
|---|---|---|---|
| `reject-unverified-transfer` | mustRevert | `0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a` | REVERT ✓ |
| `verified-transfer-succeeds` (same transfer, Bob whitelisted) | mustSucceed | `0xaf9d207c5caf18ba1fbd789cf851567a43149b8ee9540d953c9a5250986d4e7e` | SUCCESS ✓ |
| `attacker-cannot-freeze` | mustRevert | `0xc8ade9fb73e8ed65119fe7e699047ec645da54087551594e189a4bb1a9316bc7` | REVERT ✓ |
| compliance role freezes Carol (setup) | — | `0xb3b40e796a034dc23d8ccc3424221e09a95fdce9b358c5874c0313cd2dd25916` | SUCCESS |
| `frozen-holder-cannot-transfer` | mustRevert | `0x41166503c2f8a5665d14538b5f3aa0ccdb6e08087e0fd5ecc3e8583205752a31` | REVERT ✓ |
| `compliance-can-pause` | mustSucceed | `0x555bd0e8f4fa7c338f552ad2213a333f6162510efebb35d8dd2964c4b9544cd1` | SUCCESS ✓ |
| `paused-asset-blocks-transfer` | mustRevert | `0xaa02643a27c9b1b30a608d3b78838b8aef5e4fa1b7dda4a67b23bd0d7ccaf737` | REVERT ✓ |

## Killer demo (`run-killer-demo.mjs`) — same assertion, same finding id, before vs. after

**Before** (broken bond, compliance gating left off): unverified investor's transfer actually
**succeeds** on-chain — a real policy violation:

```
0 / 1 PASS
FAIL  chain-assertion:reject-unverified-transfer
      Assertion "reject-unverified-transfer" (Unverified investor must not receive the bond)
      FAILED: expected mustRevert, observed transaction result SUCCESS.
      evidence: {"transactionId":"0xdcf971ccd2978dddf816fa2eb9f980578c63253ff7aa05f8bdc2219e9038877c",
                 "expected":"mustRevert","observed":"SUCCESS"}
```

Raw violating transaction (attacker received the bond despite never being whitelisted):
`0x829ffc215b7fb043912de052c0bb43da9a2152df6797a075fdeb9254a3c4adc7` — `SUCCESS`.

**After** (fixed bond, compliance gating enabled), exact same assertion id:

```
1 / 1 PASS
PASS  reject-unverified-transfer
```

## Two independently-important engineering findings from building this

1. **ATS transactions produce EVM transaction hashes, not native Hedera SDK transaction ids** —
   the chain-assertion evidence reader only recognized the latter until this fixture surfaced
   the gap. Fixed upstream in the Harness fork (`fetchContractCallResult`,
   `extractEvmTransactionHash`) — see `docs/DECISIONS.md` and the Harness fork's commit
   `810f0c7`. This applies to *any* Solidity/EVM-relay dApp on Hedera, not just ATS.
2. **A `mustRevert` action must actually broadcast, not just be predicted client-side.** ethers'
   default `eth_estimateGas` pre-flight throws before submission on a would-be revert, leaving
   no transaction for Mirror Node evidence to check. Every action script here uses an explicit
   `gasLimit` and a `sendAndReport` helper that extracts the real transaction hash even when
   `tx.wait()` itself throws on a mined-but-reverted transaction — see `src/asset.ts`.

## Independent review (2026-09-10) — findings and fixes

Two independent review passes (one security-focused, one demo/reproducibility-focused) were
run against this fixture and the harness fork's execution engine. Findings and what was done
about each, most severe first:

1. **Critical — a live signer private key had a path to a third-party LLM prompt and a
   plaintext file, unredacted.** The repair-loop prompt writer (`attemptReporting.ts`) had no
   secrets redaction at all, unlike the EVALUATE-stage prompt writer, which redacted only the
   primary signer. **Fixed** in the Harness fork: `announceAttempt` now redacts every known
   signer (primary + all named actors) before writing any attempt prompt to disk, and the
   underlying `writePromptFile` also strips the bare (non-`0x`) hex form. This is genuinely the
   more important of the two redaction layers — findings are now redacted at the source too
   (chain-assertion/chain-deploy command output), but this fix closes the actual sink.
2. **High, confirmed against this fixture's own real data — `reasonContains` could not
   distinguish *why* an EVM transaction reverted.** Mirror Node's `result` field
   (`CONTRACT_REVERT_EXECUTED`) is identical for every revert reason on a given contract;
   `error_message` (the actual reason) was fetched but discarded. **Partially fixed**: the
   evidence reader now decodes a standard Solidity `Error(string)` revert
   (`require(condition, "message")`) into a human `revertReason`, and `reasonContains` checks
   that when present. **Honest limitation, not fully closed**: ATS's own contracts revert with
   **custom errors** (a different, gas-cheaper Solidity pattern — confirmed by decoding this
   fixture's real `reject-unverified-transfer` revert, selector `0x796c1f0d`, not the standard
   `Error(string)` selector), which cannot be decoded without that contract's own error ABI —
   deliberately out of scope, since carrying ATS-specific ABIs in the generic harness would
   violate the project's own "no PolicyProbe/ATS branding in generic Harness code" rule. This
   fixture never actually uses `reasonContains` in its real assertions (only `mustSucceed`/
   `mustRevert`), so no claim here was ever false — but the upstream recipe-authoring doc's
   worked example has been corrected to state this limitation plainly rather than imply
   universal support.
3. **Medium, reproduced live during this fix — the policy suite was not actually rerunnable.**
   `compliance-can-pause` pauses the bond with no corresponding unpause; a second run failed
   `verified-transfer-succeeds` and `compliance-can-pause` from leftover state (confirmed by
   literally hitting this failure mode running the suite for this review — see the two-run
   sequence below). **Fixed**: `run-policy-suite.mjs` now unpauses the bond as its own last
   step. Reran twice consecutively after the fix: **6/6 PASS both times**.
4. **Medium — reproducibility gap.** The whitelist/issue/freeze/role-grant sequence the policy
   suite depends on existed only as ad hoc, hand-typed calls during development, not as a
   script anyone could rerun against a fresh deployment. **Fixed**: `02-setup-policy-fixtures.ts`
   captures that exact sequence, tested against the live bond (every step succeeds; `issue` is
   documented as the one non-idempotent step, since it mints additional tokens each run rather
   than erroring on re-issue).
5. **Medium — a Mirror Node fetch exception got zero retries while a 404 got the full retry
   budget**, meaning an identical assertion against identical chain state could get a different
   verdict purely from which poll happened to hit a one-off network blip. **Fixed**: fetch
   exceptions now retry through the same backoff loop as a 404, and the final error message
   reflects the most recent attempt rather than a stale one.
6. Minor: `run-policy-suite.mjs`'s `primarySigner.evmAddress` was hardcoded to this session's
   specific operator account. **Fixed** — now derived from `HEDERA_OPERATOR_KEY` via
   `ethers.Wallet`, so the script works for any operator's credentials.
7. Minor wording: README's "real regulated-security contract" tightened to "a contract
   implementing ATS's regulated-security token pattern" to avoid any legal-claim misreading.
8. **Real, previously-undiscovered gap found by rerunning the suite fresh (2026-09-10),
   `fetchTokenBalance` misreading a not-yet-indexed HTS token association as a confirmed zero
   balance.** Not triggered by this fixture (an ATS bond is a contract token, not native HTS —
   see finding 2's `{contract}` asset shape), but found and fixed in the Harness fork while
   adding this fixture's first-ever test of that function against a real HTS token. Full detail:
   `docs/DECISIONS.md` ADR-0010, harness fork commit `427a36f`.
9. **Medium, reproduced live — `TX_OVERRIDES.gasLimit: 1_000_000` demanded ~2.34 HBAR just to
   *attempt* any write call**, regardless of gas actually used (the relay's
   "insufficient funds for intrinsic transaction cost" check reserves `gasLimit * gasPrice` up
   front). Alice's balance had drifted below that reservation threshold after many repeated
   suite runs across this session, failing three assertions with `INSUFFICIENT_FUNDS` — even
   though her balance (2.238 ℏ) was comfortably above what a transfer actually costs
   (confirmed via a real transaction's Mirror Node receipt: `gas_used: 438652`, ~40% of the
   limit). **Fixed**: reduced to `700_000` (~60% headroom over the highest real usage measured),
   roughly halving the effective minimum balance every actor needs to carry; funded Alice back
   up as an immediate unblock. Reran the suite three times consecutively after the fix: **6/6,
   6/6, then 5/6** — the one failure was a genuine transient Mirror Node fetch blip, correctly
   classified `chain-assertion-infra` (not a false policy verdict), confirming the infra-vs-
   violation distinction holds in practice, not just in tests.

Not fixed, accepted as documented limitations: (a) the harness has no general solution for an
action script that fails to complete (non-zero exit/timeout) distinguishing infra from a script
bug — recipe authors must use an explicit gas limit for `mustRevert` actions, as this fixture's
own `sendAndReport` does, documented in its own comment; (b) no on-chain check that an `actor`
genuinely holds/lacks the role a policy claims to test — the assertion trusts the recipe
author's labeling, same as any test fixture trusts its own setup.

## Known ATS role-naming surprises (worth documenting for anyone else building on this)

The "_MANAGER"-suffixed role does **not** gate the action of the same name — the base role does:

- `grantKyc` requires `ROLE_KYC`, not `ROLE_KYC_MANAGER`.
- `addToControlList`/`removeFromControlList` require `ROLE_CONTROL_LIST`, not
  `ROLE_CONTROL_LIST_MANAGER`.
- `pause`/`unpause` require `ROLE_PAUSER`, not `ROLE_PAUSE_MANAGER`.

Only `ROLE_FREEZE_MANAGER` follows the naming its own name suggests (there is no separate base
`ROLE_FREEZE`). Discovered empirically by decoding real revert `error_message` data — see
`src/constants.ts` for the exact role hashes used.
