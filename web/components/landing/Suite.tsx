"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { useInView } from "@/hooks/use-in-view";
import { hashscanTx, policies } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Suite() {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const { ref, isVisible } = useInView<HTMLElement>();

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <section id="matrix" ref={ref} className="relative py-24 lg:py-32 border-t border-foreground/10 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={cn("transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <SectionHeader eyebrow="Conformance suite" title="Six policies." muted="Recorded on Hedera Testnet." />
        </div>

        <div className="border-t border-foreground/10">
          {policies.map((p, index) => (
            <div
              key={p.id}
              className={cn(
                "group grid grid-cols-1 lg:grid-cols-[100px_minmax(0,1fr)_auto] gap-4 lg:gap-12 py-8 lg:py-10 border-b border-foreground/10 lg:items-center transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="font-mono text-sm text-muted-foreground">{p.id}</span>

              <div className="min-w-0">
                <h3 className="text-2xl lg:text-3xl font-display break-words group-hover:translate-x-2 transition-transform duration-500">
                  {p.name}
                </h3>
                <p className="mt-2 text-muted-foreground">{p.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
                <span className="text-muted-foreground">
                  {p.expected} → <span className="text-foreground">{p.observed}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-pass">
                  <span className="w-1.5 h-1.5 rounded-full bg-pass" />
                  {p.result}
                </span>
                <span className="text-muted-foreground">{p.consensusGas.toLocaleString("en-US")} gas</span>
                <span className="inline-flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleCopy(p.txHash)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Copy ${p.id} transaction hash`}
                  >
                    {copiedTx === p.txHash ? <Check className="w-4 h-4 text-pass" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={hashscanTx(p.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                  >
                    HashScan
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
