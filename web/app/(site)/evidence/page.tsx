"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { PageHeader } from "@/components/SectionHeader";
import { DIAMOND_ADDRESS, evidenceRecords, hashscanAddress, hashscanTx } from "@/lib/data";
import { buttonOutline, buttonSm, cn } from "@/lib/utils";

export default function EvidencePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<string>("PP-001");

  const currentRecord = evidenceRecords.find((r) => r.id === selectedRecord) || evidenceRecords[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-foreground/10 mb-12">
        <PageHeader
          eyebrow="Evidence explorer"
          title="Recorded evidence."
          description="Normalized summaries of Hedera Mirror Node results, rechecked on 2026-09-12. Each HashScan link opens the corresponding transaction."
          className="border-0 mb-0"
        />
        <a
          href={hashscanAddress(DIAMOND_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonOutline, buttonSm, "mb-10 self-start lg:self-auto")}
        >
          Diamond on HashScan
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-start">
        <div>
          <div className="font-mono text-xs text-muted-foreground mb-2">
            {evidenceRecords.length} testnet assertion runs
          </div>
          {evidenceRecords.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRecord(r.id)}
              className={cn(
                "w-full text-left py-5 border-b border-foreground/10 transition-all duration-500 group",
                r.id === selectedRecord ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-2xl font-display truncate group-hover:translate-x-2 transition-transform duration-300">
                    {r.name}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.id} · tx {r.txHash.slice(0, 12)}…
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-xs text-pass shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-pass" />
                  {r.result}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 border border-foreground/10 min-w-0">
          <div className="px-6 lg:px-8 py-5 border-b border-foreground/10 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-xs text-muted-foreground">{currentRecord.id}</span>
              <h2 className="text-2xl font-display break-words">{currentRecord.name}</h2>
            </div>
            <a
              href={hashscanTx(currentRecord.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm hover:underline underline-offset-4"
            >
              HashScan receipt
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-foreground/10 border-b border-foreground/10">
            {[
              ["Expected", currentRecord.expected, ""],
              ["Observed", currentRecord.status, "text-pass"],
              ["Timestamp", currentRecord.consensusTimestamp, ""],
            ].map(([label, value, tone]) => (
              <div key={label} className="bg-background px-6 py-4 min-w-0">
                <div className="font-mono text-xs text-muted-foreground mb-1">{label}</div>
                <div className={cn("font-mono break-all", label === "Timestamp" ? "text-[10px] tracking-tight" : "text-xs", tone)}>{value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-6 lg:px-8 py-3 border-b border-foreground/10">
            <span className="font-mono text-xs text-muted-foreground">evidence.json · normalized snapshot</span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(currentRecord.payload, null, 2), currentRecord.id)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied === currentRecord.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-pass" />
                  <span className="text-pass">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-6 lg:p-8 font-mono text-xs leading-relaxed text-foreground/80 overflow-x-auto bg-foreground/[0.01]">
            {JSON.stringify(currentRecord.payload, null, 2)}
          </pre>
        </div>
      </div>

      <div className="pt-16 flex items-center justify-between gap-4 text-sm">
        <Link href="/proof" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Verification ledger
        </Link>
        <Link href="/#console" className="hover:underline underline-offset-4">
          Open the sandbox →
        </Link>
      </div>
    </div>
  );
}
