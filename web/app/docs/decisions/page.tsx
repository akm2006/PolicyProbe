import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export const metadata = {
  title: "Architecture Decision Records — PolicyProbe Documentation",
  description: "Complete log of ADR-0001 through ADR-0010 governing PolicyProbe's architectural evolution.",
};

export default function DecisionsPage() {
  const adrs = [
    {
      id: "ADR-0001",
      title: "Branching Off hedera-harness:dev",
      status: "ACCEPTED",
      summary: "Pin upstream base to hedera-dev/hedera-harness:dev @ 4bfa099 rather than main to ensure compatibility with active development.",
    },
    {
      id: "ADR-0002",
      title: "Sibling Directory Repository Topology",
      status: "ACCEPTED",
      summary: "Strict two-repo structure: hedera-harness contains pure upstream engine changes, while Policy-Probe contains test fixtures, docs, and the web console.",
    },
    {
      id: "ADR-0003",
      title: "Deterministic Code Assertions Over LLM Evaluation",
      status: "ACCEPTED",
      summary: "Replace semantic LLM review in EVALUATE with typed TypeScript postcondition assertions (mustSucceed, mustRevert, balanceDelta).",
    },
    {
      id: "ADR-0004",
      title: "Isolated Feature Branching Strategy",
      status: "ACCEPTED",
      summary: "Maintain scoped branch policyprobe/deterministic-onchain-postconditions with clean commit history until ready for upstream PR merge.",
    },
    {
      id: "ADR-0005",
      title: "Multi-Actor Ephemeral Account Provisioning",
      status: "ACCEPTED",
      summary: "Provision distinct keypairs for Alice, Bob, Carol, and Attacker with automated testnet funding and post-run dust sweeps.",
    },
    {
      id: "ADR-0006",
      title: "ISO 6166 ISIN Checksum Conformance",
      status: "ACCEPTED",
      summary: "Asset Tokenization Studio enforces strict Luhn checksum validation on ISINs. Implemented USPLCYPROB86 to ensure deployment success.",
    },
    {
      id: "ADR-0007",
      title: "Strict 3-State Mirror Node Polling Trichotomy",
      status: "ACCEPTED",
      summary: "Enforce found / not-found / infra-error distinction to eliminate false positives caused by consensus propagation latency.",
    },
    {
      id: "ADR-0008",
      title: "Strict Upstream Decoupling & Generic Primitives",
      status: "ACCEPTED",
      summary: "Maintainer-grade upstream pull request: zero proprietary strings or project-specific coupling, purely generic Harness verification infrastructure.",
    },
    {
      id: "ADR-0009",
      title: "Repair Loop Integration in promptBuilder.ts",
      status: "ACCEPTED",
      summary: "Format assertion failures as structured findings that seamlessly inject into Harness's agent prompt builder for automated repair.",
    },
    {
      id: "ADR-0010",
      title: "Colocate Web Verification Console in Policy-Probe/console",
      status: "ACCEPTED",
      summary: "House the Next.js verification and evidence console within the primary repository to provide an integrated explorer for testnet assertion runs.",
    },
  ];

  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c4c9dd] font-mono">
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#8259ef] mb-1 uppercase tracking-wider font-semibold">
          Documentation · Governance
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          Architecture Decision Records (ADRs)
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa1be] mt-1 font-mono">
          Immutable log of architectural decisions recorded throughout the development lifecycle.
        </p>
      </div>

      <div className="space-y-4 my-6">
        {adrs.map((adr) => (
          <div
            key={adr.id}
            className="rounded-[8px] glass-panel p-5 font-mono text-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#8259ef] text-sm">{adr.id}</span>
              <span className="rounded bg-[#10b981]/15 px-2 py-0.5 text-[10px] font-bold text-[#10b981] border border-[#10b981]/30">
                {adr.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 font-mono">{adr.title}</h3>
            <p className="text-xs text-[#9aa1be] font-sans leading-relaxed">{adr.summary}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-white/[0.08] flex justify-between items-center font-mono text-xs">
        <Link href="/docs/benchmark" className="text-[#6e7592] hover:text-white transition">
          ← Benchmark
        </Link>
        <Link
          href="/docs/related-work"
          className="inline-flex items-center gap-1 font-semibold text-[#8259ef] hover:underline"
        >
          <span>Upstream PR Landscape</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
