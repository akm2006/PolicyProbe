# AI usage disclosure

AI coding agents were used extensively to research, implement, test, review, and document this
project. Claude Code authored most of the initial Harness patch, ATS fixture, tests, and internal
documentation. OpenAI Codex later audited the repositories, fixed portability and dependency
issues, and prepared the public-facing cleanup.

The human project owner wrote the initial strategy, supplied the project objective, chose the
scope and tradeoffs, authorized testnet operations, reviewed progress, and directed the final
submission and publication decisions. The final demo narration and submission choices remain
human responsibilities.

AI-assisted work includes:

- the Harness actor and assertion schema, evidence reader, runner, finding integration, and
  related tests;
- the ATS bond deployment and action fixture, policy suite, and controlled before/after run;
- repository research, technical documentation, review, and cleanup;
- execution of disclosed Hedera testnet transactions using user-authorized credentials.

The claims do not depend on AI output alone. Reviewers can inspect the source, run the tests,
and independently verify the recorded transaction hashes through Hedera Mirror Node or HashScan.
