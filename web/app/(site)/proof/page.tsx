import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/SectionHeader";
import { DIAMOND_ADDRESS, HARNESS_PR_URL, hashscanAddress, hashscanTx } from "@/lib/data";

export const metadata = {
  title: "Verification Ledger — PolicyProbe",
  description: "Recorded Hedera Testnet evidence and the upstream Harness contribution.",
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
  { name: "mustSucceed", body: "The confirmed transaction result is SUCCESS." },
  { name: "mustRevert", body: "The confirmed transaction result is a revert." },
  { name: "reasonContains", body: "The decoded revert reason contains the configured text, when available." },
  { name: "balanceDelta", body: "The confirmed balance change matches the configured HBAR or token delta." },
];

export default function ProofPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
      <PageHeader
        eyebrow="Verification ledger"
        title="Proof, not promises."
        description="Recorded testnet results, supported assertions, and the upstream contribution."
        className="mb-0"
      />

      <LedgerSection number="01" title="Upstream contribution">
        <dl className="divide-y divide-foreground/10">
          <Row label="Base repository">
            <ExtLink href="https://github.com/hedera-dev/hedera-harness">hedera-dev/hedera-harness:dev</ExtLink>
          </Row>
          <Row label="Pull request">
            <ExtLink href={HARNESS_PR_URL}>#74 · open against dev</ExtLink>
          </Row>
        </dl>
      </LedgerSection>

      <LedgerSection number="02" title="Hedera Testnet">
        <dl className="divide-y divide-foreground/10">
          <Row label="Network">296 (Hedera Testnet)</Row>
          <Row label="ATS bond factory">0.0.9213391</Row>
          <Row label="Bond diamond">
            <ExtLink href={hashscanAddress(DIAMOND_ADDRESS)}>{DIAMOND_ADDRESS}</ExtLink>
          </Row>
          <Row label="ISIN">USPLCYPROB86</Row>
          <Row label="Deployment tx">
            <ExtLink href={hashscanTx("0x483922db058fd105577d8087bdf449b41854e80647d756f1de4958e0a24c6aa2")}>
              0x483922db058fd105577d8087bdf449b41854e80647d756f1de4958e0a24c6aa2
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
          <Row label="ATS bond policy suite" tone="pass">6 / 6 recorded assertions matched · checked 2026-09-12</Row>
          <Row label="Whitelist disabled">
            <ExtLink href={hashscanTx("0xdcf971ccd2978dddf816fa2eb9f980578c63253ff7aa05f8bdc2219e9038877c")}>
              SUCCESS · 0xeff72…9E03
            </ExtLink>
          </Row>
          <Row label="Whitelist enabled">
            <ExtLink href={hashscanTx("0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a")}>
              CONTRACT_REVERT_EXECUTED · 0x19CD…06B8
            </ExtLink>
          </Row>
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
