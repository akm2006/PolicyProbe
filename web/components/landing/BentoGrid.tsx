import React from "react";
import { Users, Code, Activity, Wrench, Diamond, GitFork, ShieldCheck } from "lucide-react";

export const BentoGrid: React.FC = () => {
  const cards = [
    {
      title: "Multi-Actor Ephemeral Key Isolation",
      tag: "INFRASTRUCTURE",
      icon: Users,
      description:
        "Generates isolated private keys for Alice (compliant), Bob (secondary buyer), Carol (frozen), and Attacker (unauthorized). Automatically funded from operator balance on Hedera Testnet and swept back to 0 after evaluation.",
      detail: "Zero shared keys · Automatic dust sweep · Ephemeral actors",
    },
    {
      title: "Code Evaluation vs. LLM Checklist",
      tag: "DETERMINISM",
      icon: Code,
      description:
        "Harness's baseline EVALUATE stage asked an LLM to read execution output and decide if tests passed. PolicyProbe introduces typed TypeScript comparator functions executed directly by Node.js in 0.00ms.",
      detail: "Zero hallucinations · 100% reproducible · Cryptographic receipts",
    },
    {
      title: "3-State Mirror Node Reader",
      tag: "CONSENSUS INTEGRITY",
      icon: Activity,
      description:
        "Enforces a strict trichotomy (found / not-found / infra-error) with exponential backoff. Distinguishes genuine onchain reverts from transient Mirror Node latency, eliminating false-positive test suite failures.",
      detail: "1.4s consensus resolution · Exponential backoff · Zero false alarms",
    },
    {
      title: "Autonomous Agent Repair Loop",
      tag: "AGENT ALIGNMENT",
      icon: Wrench,
      description:
        "When an onchain assertion fails, PolicyProbe produces a structured finding payload (finding.category = 'chain-assertion-failure'). It pipes into Harness's promptBuilder.ts, giving coding agents the exact testnet diff required to self-heal.",
      detail: "Structured JSON finding · Actionable failure diff · Autonomous fix",
    },
    {
      title: "ATS Diamond Facet Integration",
      tag: "ASSET TOKENIZATION",
      icon: Diamond,
      description:
        "Deep integration with Hedera's Asset Tokenization Studio Diamond proxy (ERC-2535). Validates fine-grained facet state across AccessControlFacet, PauseFacet, FreezeFacet, and KYCFacet on live testnet.",
      detail: "EIP-2535 Diamond · ISO 6166 ISIN · 6 Compliance Invariants",
    },
    {
      title: "Zero Upstream Contamination",
      tag: "OPEN SOURCE",
      icon: GitFork,
      description:
        "All 11 commits in the hedera-harness fork are purely generic. Zero proprietary coupling, no downstream lock-in, and maintainer-grade open-source engineering.",
      detail: "277/277 Harness tests green · 11 scoped commits · Generic primitives",
    },
  ];

  return (
    <section className="border-b border-white/[0.08] bg-[#050608] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs font-mono text-[#c4c9dd] mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-[#8259ef]" />
            <span>ENGINEERING INVARIANTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Architecture Designed From Verification Outward
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9aa1be] font-mono leading-relaxed">
            PolicyProbe adds deterministic autorun verification into Hedera Harness without modifying core consensus rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover flex flex-col justify-between rounded-[12px] p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/[0.08] bg-white/[0.04] text-[#8259ef]">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-[#6e7592] border border-white/[0.06] px-2 py-0.5 rounded">
                    {c.tag}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-2 font-mono">{c.title}</h3>
                <p className="text-xs text-[#9aa1be] leading-relaxed mb-6 font-sans">{c.description}</p>
              </div>

              <div className="border-t border-white/[0.06] pt-3 text-[11px] font-mono text-[#8259ef]">
                {c.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
