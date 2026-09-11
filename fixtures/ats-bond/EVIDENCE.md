# ATS bond testnet evidence

The records below are real Hedera testnet transactions. They can be checked through HashScan or
the Hedera testnet Mirror Node contract-results API. Results were re-read from Mirror Node on
2026-09-12; no private keys are included.

## Contracts

The bonds were issued through the existing ATS factory `0.0.9213391`
(`0xd1F118A40f3b02883D35909eF2517e7EDd78379d`).

| Configuration | Diamond address | Deployment transaction |
|---|---|---|
| Whitelist enabled, recorded policy suite | `0x19CD7866076758E3AF6C79aD7Ce725331A5606B8` | [`0x483922…c6aa2`](https://hashscan.io/testnet/transaction/0x483922db058fd105577d8087bdf449b41854e80647d756f1de4958e0a24c6aa2) |
| Whitelist enabled, fresh prepared deployment | `0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a` | [`0xc2b8cc…d2d94`](https://hashscan.io/testnet/transaction/0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94) |
| Whitelist disabled, comparison case | `0xeff72A209498C890e3583702bD7818570a5c9E03` | [`0x44db45…49387`](https://hashscan.io/testnet/transaction/0x44db454238b929e18a287c908d05bb4473cd94588ba8fc9022dd5bffc1749387) |

## Test actors

| Actor | Account ID | Setup |
|---|---|---|
| Alice | `0.0.10432566` | verified investor |
| Bob | `0.0.10432567` | verified before the positive transfer |
| Carol | `0.0.10432568` | verified, then frozen by the compliance actor |
| Attacker | `0.0.10432569` | never whitelisted and granted no role |

Actor keys are local in ignored `.actors.json` files and are not part of this evidence.

## Six-policy run

`run-policy-suite.mjs` evaluated the whitelist-enabled bond at
`0x19CD7866076758E3AF6C79aD7Ce725331A5606B8`: **6 of 6 assertions passed**.

| Assertion | Expected outcome | EVM transaction | Mirror Node result |
|---|---|---|---|
| `reject-unverified-transfer` | revert | [`0x513432…91f6a`](https://hashscan.io/testnet/transaction/0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a) | `CONTRACT_REVERT_EXECUTED` |
| `verified-transfer-succeeds` | success | [`0xaf9d20…d4e7e`](https://hashscan.io/testnet/transaction/0xaf9d207c5caf18ba1fbd789cf851567a43149b8ee9540d953c9a5250986d4e7e) | `SUCCESS` |
| `attacker-cannot-freeze` | revert | [`0xc8ade9…6bc7`](https://hashscan.io/testnet/transaction/0xc8ade9fb73e8ed65119fe7e699047ec645da54087551594e189a4bb1a9316bc7) | `CONTRACT_REVERT_EXECUTED` |
| `frozen-holder-cannot-transfer` | revert | [`0x411665…2a31`](https://hashscan.io/testnet/transaction/0x41166503c2f8a5665d14538b5f3aa0ccdb6e08087e0fd5ecc3e8583205752a31) | `CONTRACT_REVERT_EXECUTED` |
| `compliance-can-pause` | success | [`0x555bd0…4cd1`](https://hashscan.io/testnet/transaction/0x555bd0e8f4fa7c338f552ad2213a333f6162510efebb35d8dd2964c4b9544cd1) | `SUCCESS` |
| `paused-asset-blocks-transfer` | revert | [`0xaa0264…f737`](https://hashscan.io/testnet/transaction/0xaa02643a27c9b1b30a608d3b78838b8aef5e4fa1b7dda4a67b23bd0d7ccaf737) | `CONTRACT_REVERT_EXECUTED` |

## Before/after comparison

`run-before-after-demo.mjs` uses the same assertion, actor, and action for both contracts.

- With whitelist enforcement disabled, action hash
  [`0xdcf971…8877c`](https://hashscan.io/testnet/transaction/0xdcf971ccd2978dddf816fa2eb9f980578c63253ff7aa05f8bdc2219e9038877c)
  returned `SUCCESS`. The engine emitted `chain-assertion:reject-unverified-transfer` because the
  declared outcome was `mustRevert`.
- With whitelist enforcement enabled, action hash
  [`0x513432…91f6a`](https://hashscan.io/testnet/transaction/0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a)
  returned `CONTRACT_REVERT_EXECUTED`, so the assertion passed.

## Reproduction notes

- ATS actions use EVM transaction hashes, so the Harness evidence reader supports both EVM
  hashes and native Hedera transaction IDs.
- Expected-revert scripts specify an explicit gas limit so ethers broadcasts the transaction
  instead of stopping at gas estimation. `sendAndReport` prints the transaction hash even when
  `tx.wait()` reports a mined revert.
- Standard Solidity `Error(string)` data can be decoded generically. ATS custom errors require
  the ATS ABI, so this fixture asserts their outcome without `reasonContains`.
- The setup script is idempotent except for issuance, which mints additional units when rerun.
- The policy suite unpauses the bond at the end so subsequent runs start from usable state.
