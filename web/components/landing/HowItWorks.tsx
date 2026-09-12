import React from "react";
import { FileCode, Play, Radio, Scale, Wrench } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "DECLARE",
      subtitle: "spec.yaml",
      icon: FileCode,
      description: "Declare required onchain invariant alongside test actions.",
      snippet: `expect:\n  transactionOutcome: "mustRevert"\n  errorCode: "0x5a18a961"`,
    },
    {
      num: "02",
      title: "EXECUTE",
      subtitle: "Hedera SDK",
      icon: Play,
      description: "Provision ephemeral testnet actors and broadcast signed tx.",
      snippet: `const tx = await contract\n  .connect(bob)\n  .transfer(alice, 100);`,
    },
    {
      num: "03",
      title: "OBSERVE",
      subtitle: "Mirror REST",
      icon: Radio,
      description: "Poll Hedera Mirror Node with 3-state exponential backoff.",
      snippet: `GET /api/v1/contracts/results/\n  0x42c9a1...ede0d1b976`,
    },
    {
      num: "04",
      title: "COMPARE",
      subtitle: "TypeScript",
      icon: Scale,
      description: "Strict deterministic evaluation in 0.00ms. Zero LLM prompt tokens.",
      snippet: `if (expected !== observed) {\n  emitFinding(assertionId);\n}`,
    },
    {
      num: "05",
      title: "REPAIR",
      subtitle: "promptBuilder",
      icon: Wrench,
      description: "Structured findings injected into agent context for self-healing.",
      snippet: `promptBuilder.injectFinding({\n  category: "compliance-leak"\n});`,
    },
  ];

  return (
    <section className="border-b border-white/[0.08] bg-[#050608] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-[#8259ef] mb-1 uppercase tracking-wider font-semibold">
            PIPELINE ARCHITECTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            How It Works: Five Discrete Stages
          </h2>
          <p className="text-xs sm:text-sm text-[#9aa1be] mt-2 font-mono">
            From declarative YAML recipe to autonomous agent self-healing. Pure code at every step.
          </p>
        </div>

        {/* 5-Step Horizontal Grid with code snippets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover rounded-[10px] p-4 flex flex-col justify-between font-mono text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[#6e7592] mb-3">
                  <span className="font-bold text-sm text-[#8259ef]">{s.num}</span>
                  <s.icon className="h-4 w-4 text-[#9aa1be]" />
                </div>
                <div className="font-bold text-white text-sm tracking-wider mb-0.5">{s.title}</div>
                <div className="text-[10px] text-[#8259ef] mb-2">{s.subtitle}</div>
                <p className="text-[#9aa1be] text-xs font-sans leading-relaxed mb-3">{s.description}</p>
              </div>

              <div>
                {/* Code Snippet */}
                <div className="rounded-[6px] bg-black/60 p-2.5 border border-white/[0.06] text-[10px] text-[#c4c9dd] overflow-x-auto leading-tight font-mono">
                  <pre>{s.snippet}</pre>
                </div>
                <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] text-[#6e7592]">
                  Stage {idx + 1} of 5
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
