# ATS Bond Fixture — Real Testnet Evidence

Every transaction below is real, on Hedera testnet, independently verifiable via
`https://hashscan.io/testnet/transaction/<hash>` or the Mirror Node REST API
(`https://testnet.mirrornode.hedera.com/api/v1/contracts/results/<hash>`). None are simulated.

## Deployment

Issued through the existing ATS factory (`0.0.9213391` / `0xd1F118A40f3b02883D35909eF2517e7EDd78379d`),
not a self-deployed system — see `docs/DECISIONS.md` for why.

| Bond | Diamond address | Config | Deploy tx |
|---|---|---|---|
| **Fixed** — "Atlas Infrastructure Note 2027" | `0x19CD7866076758E3AF6C79aD7Ce725331A5606B8` | `isWhiteList: true` | `0x483922db058fd105577d8087bdf449b41854e80647d756f1de4958e0a24c6aa2` |
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

## Known ATS role-naming surprises (worth documenting for anyone else building on this)

The "_MANAGER"-suffixed role does **not** gate the action of the same name — the base role does:

- `grantKyc` requires `ROLE_KYC`, not `ROLE_KYC_MANAGER`.
- `addToControlList`/`removeFromControlList` require `ROLE_CONTROL_LIST`, not
  `ROLE_CONTROL_LIST_MANAGER`.
- `pause`/`unpause` require `ROLE_PAUSER`, not `ROLE_PAUSE_MANAGER`.

Only `ROLE_FREEZE_MANAGER` follows the naming its own name suggests (there is no separate base
`ROLE_FREEZE`). Discovered empirically by decoding real revert `error_message` data — see
`src/constants.ts` for the exact role hashes used.
