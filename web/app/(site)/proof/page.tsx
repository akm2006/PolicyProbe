import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/SectionHeader";
import { DIAMOND_ADDRESS, hashscanAddress, hashscanTx } from "@/lib/data";

export const metadata = {
  title: "Verification Ledger — PolicyProbe",
  description: "Cryptographic receipts, upstream commits, and testnet consensus timestamps for PolicyProbe.",
};

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 break-all underline-offset-4 hover:underline"
    >
      {children}
      <ArrowUpRight className="w-3 h-3 shrink-0" />
    </a>
  );
}

function Row({ label, children, tone }: { label: string; children: React.ReactNode; tone?: "pass" }) {
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-8">
      <dt className="text-muted-foreground text-sm shrink-0">{label}</dt>
      <dd className={`font-mono text-xs sm:text-right break-all ${tone === "pass" ? "text-pass" : ""}`}>{children}</dd>
    </div>
  );
}

function LedgerSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 lg:gap-12 py-10 border-b border-foreground/10">
      <div>
        <span className="font-mono text-sm text-muted-foreground">{number}</span>
        <h2 className="mt-2 text-3xl font-display tracking-tight">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const assertionTypes = [
  { name: "mustSucceed", body: "Transaction executed with status SUCCESS (200)." },
  { name: "mustRevert", body: "EVM reverted, e.g. CONTRACT_REVERT_EXECUTED with a custom error selector." },
  { name: "balanceDelta", body: "Exact balance change across HBAR and HTS tokens." },
  { name: "stateEquals", body: "Contract storage inspected via view call over EVM RPC." },
];

export default function ProofPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
      <PageHeader
        eyebrow="Verification ledger"
        title="Proof, not promises."
        description="Testnet receipts, pinned upstream commits, and assertion records."
        className="mb-0"
      />

      <LedgerSection number="01" title="Upstream contribution">
        <dl className="divide-y divide-foreground/10">
          <Row label="Base repository">
            <ExtLink href="https://github.com/hedera-dev/hedera-harness">hedera-dev/hedera-harness:dev</ExtLink>
          </Row>
          <Row label="Pinned base SHA">4bfa099951b147318ff245ce0d47346b9409890f</Row>
          <Row label="Branch">policyprobe/deterministic-onchain-postconditions</Row>
          <Row label="Commits ahead">11 scoped commits</Row>
          <Row label="Harness suite" tone="pass">
            277 / 277 pass · 0 regressions
          </Row>
        </dl>
      </LedgerSection>

      <LedgerSection number="02" title="Hedera Testnet">
        <dl className="divide-y divide-foreground/10">
          <Row label="Network">296 (Hedera Testnet)</Row>
          <Row label="Operator account">
            <ExtLink href="https://hashscan.io/testnet/account/0.0.10464599">
              0.0.10464599 (0xb40a2e5fdfaec87bad82246d041886354f5faff4)
            </ExtLink>
          </Row>
          <Row label="ATS bond factory">0.0.9213391</Row>
          <Row label="Bond diamond">
            <ExtLink href={hashscanAddress(DIAMOND_ADDRESS)}>{DIAMOND_ADDRESS}</ExtLink>
          </Row>
          <Row label="ISIN">USPLCYPROB86 (valid ISO 6166)</Row>
          <Row label="Deployment tx">
            <ExtLink href={hashscanTx("0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94")}>
              0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94
            </ExtLink>
          </Row>
        </dl>
      </LedgerSection>

      <LedgerSection number="03" title="Assertion types">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
          {assertionTypes.map((a) => (
            <div key={a.name} className="bg-background p-6">
              <div className="font-mono text-sm">{a.name}</div>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
            </div>
          ))}
        </div>
      </LedgerSection>

      <LedgerSection number="04" title="Results">
        <dl className="divide-y divide-foreground/10">
          <Row label="Live onchain assertion tests" tone="pass">36 / 36 pass</Row>
          <Row label="Ephemeral actor provisioning" tone="pass">2 / 2 pass</Row>
          <Row label="ATS bond policy suite" tone="pass">6 / 6 pass</Row>
          <Row label="Before / after">Defect caught on 0xeff7…, fixed on 0x29d9…</Row>
        </dl>
      </LedgerSection>

      <div className="pt-10 flex items-center justify-between gap-4 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Overview
        </Link>
        <Link href="/evidence" className="inline-flex items-center gap-2 hover:underline underline-offset-4">
          Mirror Node evidence
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
