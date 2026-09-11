# Related upstream work

Last reviewed against open `hedera-dev/hedera-harness` pull requests on 2026-09-12.

| PR | Scope | Relationship |
|---|---|---|
| [#39](https://github.com/hedera-dev/hedera-harness/pull/39) | Mirror Node reader and outage classification | Adjacent reliability work; no per-action expected outcome |
| [#49](https://github.com/hedera-dev/hedera-harness/pull/49) | Native SDK app environment and evidence for EVALUATE | Overlapping files; evidence still feeds semantic evaluation |
| [#50](https://github.com/hedera-dev/hedera-harness/pull/50) | Confirms recent successful payer transactions | Coarser success-only verification for one signer |
| [#55](https://github.com/hedera-dev/hedera-harness/pull/55) | Windows support | Orthogonal, but relevant to local test portability |
| [#58](https://github.com/hedera-dev/hedera-harness/pull/58) | HCS running-hash validator | Deterministic validator for a different domain |
| [#60](https://github.com/hedera-dev/hedera-harness/pull/60) | Unknown recipe-key diagnostics | Complementary schema safety |

PolicyProbe's remaining distinction is the combination of a declared action, expected success
or expected revert, optional exact balance delta, named actors, deterministic evidence, and a
typed repair finding. PRs #49 and #50 are the main rebase and integration risks because they
touch the same CHAIN surfaces.
