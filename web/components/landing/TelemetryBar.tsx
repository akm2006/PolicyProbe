import React from "react";
import { HederaIcon, DiamondIcon } from "../icons/EcosystemIcons";
import { ExternalLink, ShieldCheck, Zap, Activity } from "lucide-react";

export const TelemetryBar: React.FC = () => {
  const metrics = [
    {
      label: "ATS COMPLIANCE POLICIES",
      value: "6 / 6",
      status: "PASS",
      subtext: "Cryptographically verified onchain",
      icon: ShieldCheck,
      color: "text-[#10b981]",
    },
    {
      label: "FALSE POSITIVE RATE",
      value: "0.00%",
      status: "59 Negative Tests",
      subtext: "Zero hallucinated passes across negative tests",
      icon: Activity,
      color: "text-[#10b981]",
    },
    {
      label: "CONSENSUS RESOLUTION",
      value: "1.4s",
      status: "Mirror REST",
      subtext: "Hedera consensus polling latency",
      icon: Zap,
      color: "text-[#8259ef]",
    },
    {
      label: "ACTIVE BOND DIAMOND",
      value: "0x29d9...b53a",
      status: "Hedera 296",
      subtext: "ISIN: USPLCYPROB86 (ISO 6166)",
      icon: DiamondIcon,
      href: "https://hashscan.io/testnet/address/0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      color: "text-white",
    },
  ];

  return (
    <section className="border-b border-white/[0.08] bg-[#08090c]/70 backdrop-blur-md py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-[8px] p-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between text-[#6e7592] mb-2 text-[10px] tracking-wider">
                <span>{m.label}</span>
                <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
              </div>

              <div className="flex items-baseline gap-2">
                {m.href ? (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold tracking-tight text-white hover:text-[#8259ef] transition flex items-center gap-1.5"
                  >
                    <span>{m.value}</span>
                    <ExternalLink className="h-3 w-3 text-[#6e7592]" />
                  </a>
                ) : (
                  <span className="text-xl font-bold tracking-tight text-white">
                    {m.value}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-[#8259ef]">
                  {m.status}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-[#9aa1be] font-sans">{m.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
