# Security policy

## Reporting a vulnerability

Please report vulnerabilities privately to the repository owner through the contact options on
the [manovHacksaw GitHub profile](https://github.com/manovHacksaw). Do not open a public issue
for credential exposure or an exploitable security flaw.

Include the affected version or commit, reproduction steps, impact, and any suggested fix.
Public disclosure should wait until a fix is available.

## Credential handling

This project runs testnet transactions and creates temporary signer accounts. Never commit
operator keys, `.env` files, `.actors.json`, chain-signer files, or Harness run artifacts.
Rotate any key that has been pasted into chat, logs, issue text, or another third-party system.
