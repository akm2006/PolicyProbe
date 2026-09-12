"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PolicyProbeLogo } from "../PolicyProbeLogo";
import { HederaIcon, GitHubIcon } from "../icons/EcosystemIcons";
import {
  ArrowRight,
  GitPullRequest,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const [pipelineMode, setPipelineMode] = useState<"with-pp" | "baseline">("with-pp");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState<number>(3);

  const handleSimulate = () => {
    if (running) return;
    setRunning(true);
    setStep(1);
    setTimeout(() => setStep(2), 500);
    setTimeout(() => {
      setStep(3);
      setRunning(false);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] py-14 sm:py-20">
      {/* Background ambient glow & micro-grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8259ef]/15 blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ecosystem Invariant Eyebrow */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1 text-xs font-mono text-[#c4c9dd] badge-glow">
            <HederaIcon className="h-4 w-4 text-white" />
            <span className="text-white font-medium">Built on Hedera Testnet</span>
            <span className="text-[#6e7592]">·</span>
            <span className="text-[#9aa1be]">277/277 Harness Suite Green</span>
            <span className="text-[#6e7592]">·</span>
            <span className="text-[#8259ef] font-semibold">Chain 296</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs font-mono text-[#9aa1be]">
            <span>Diamond Proxy:</span>
            <span className="text-white font-semibold">6 Live Postconditions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono leading-[1.08]">
              Deterministic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c4c9dd] to-[#8259ef]">
                Onchain Assertions
              </span> <br />
              for Hedera Harness.
            </h1>

            <p className="text-base sm:text-lg text-[#9aa1be] font-sans leading-relaxed max-w-xl">
              Verify smart contract behavioral invariants directly against Hedera Mirror Nodes in pure code. Catches silent compliance regressions that pass CLI exit code <code className="text-white font-mono bg-white/[0.06] px-1.5 py-0.5 rounded text-sm">0</code>.
            </p>

            {/* Direct Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <a
                href="#console"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#8259ef] px-4 py-2.5 font-semibold text-white transition hover:bg-[#734af9] active:scale-[0.98] shadow-[0_0_20px_rgba(130,89,239,0.35)]"
              >
                <span>Interactive Sandbox</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/hedera-dev/hedera-harness/compare/dev...manovHacksaw:hedera-harness:policyprobe/deterministic-onchain-postconditions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 font-medium text-white transition hover:bg-white/[0.08]"
              >
                <GitPullRequest className="h-3.5 w-3.5 text-[#8259ef]" />
                <span>Harness Upstream PR</span>
              </a>

              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.08] bg-transparent px-3.5 py-2.5 font-medium text-[#9aa1be] hover:text-white transition"
              >
                <span>Documentation</span>
              </Link>
            </div>

            {/* Telemetry Facts */}
            <div className="pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <div className="text-[#6e7592] text-[11px]">EVALUATION TIME</div>
                <div className="text-white font-bold text-sm">0.00ms</div>
                <div className="text-[#10b981] text-[10px]">Deterministic TS</div>
              </div>
              <div>
                <div className="text-[#6e7592] text-[11px]">EVALUATION COST</div>
                <div className="text-white font-bold text-sm">$0.000</div>
                <div className="text-[#10b981] text-[10px]">Zero LLM tokens</div>
              </div>
              <div>
                <div className="text-[#6e7592] text-[11px]">NETWORK STATUS</div>
                <div className="text-white font-bold text-sm">Testnet 296</div>
                <div className="text-[#8259ef] text-[10px]">1.4s consensus</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive Verification Engine */}
          <div className="lg:col-span-6">
            <div className="rounded-[12px] border border-white/[0.12] bg-[#0d0e14]/90 p-5 shadow-2xl backdrop-blur-xl relative">
              {/* Header Mode Switcher */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Terminal className="h-3.5 w-3.5 text-[#8259ef]" />
                  <span className="text-white font-semibold">Execution Inspector</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-[6px] border border-white/[0.06] font-mono text-[11px]">
                  <button
                    onClick={() => setPipelineMode("with-pp")}
                    className={`px-2.5 py-1 rounded-[4px] transition ${
                      pipelineMode === "with-pp"
                        ? "bg-[#8259ef] text-white font-semibold shadow-sm"
                        : "text-[#9aa1be] hover:text-white"
                    }`}
                  >
                    PolicyProbe
                  </button>
                  <button
                    onClick={() => setPipelineMode("baseline")}
                    className={`px-2.5 py-1 rounded-[4px] transition ${
                      pipelineMode === "baseline"
                        ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 font-semibold"
                        : "text-[#9aa1be] hover:text-white"
                    }`}
                  >
                    Baseline Exit Code
                  </button>
                </div>
              </div>

              {/* Scenario Context */}
              <div className="mb-4 rounded-[6px] bg-white/[0.02] border border-white/[0.06] p-3 font-mono text-xs flex items-center justify-between">
                <div>
                  <div className="text-[#6e7592] text-[10px]">ACTION UNDER TEST</div>
                  <div className="text-white font-medium">transfer(bob_unverified, 100 BOND)</div>
                </div>
                <button
                  onClick={handleSimulate}
                  disabled={running}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/[0.08] hover:bg-white/[0.14] px-2.5 py-1 text-xs text-white transition disabled:opacity-50"
                >
                  <Play className={`h-3 w-3 text-[#8259ef] ${running ? "animate-spin" : ""}`} />
                  <span>{running ? "Evaluating..." : "Re-evaluate"}</span>
                </button>
              </div>

              {/* Execution Pipeline Display */}
              <div className="space-y-3 font-mono text-xs">
                {/* Stage 1: Recipe Declaration */}
                <div className={`p-3 rounded-[6px] border transition-all ${
                  step >= 1 ? "bg-white/[0.03] border-white/[0.08]" : "opacity-40 border-transparent"
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#6e7592]">1. DECLARED INVARIANT (spec.yaml)</span>
                    <span className="text-[#8259ef]">Expected</span>
                  </div>
                  <div className="text-[#c4c9dd]">
                    expect: &#123; transactionOutcome: <span className="text-[#10b981] font-bold">&quot;mustRevert&quot;</span> &#125;
                  </div>
                </div>

                {/* Stage 2: Hedera Mirror Node Record */}
                <div className={`p-3 rounded-[6px] border transition-all ${
                  step >= 2 ? "bg-white/[0.03] border-white/[0.08]" : "opacity-40 border-transparent"
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#6e7592]">2. HEDERA TESTNET CONSENSUS</span>
                    <span className="text-[#f59e0b]">Tx 0x42c9a1...</span>
                  </div>
                  <div className="text-[#c4c9dd] flex items-center justify-between">
                    <span>EVM execution status:</span>
                    <span className="text-white bg-white/[0.08] px-1.5 py-0.5 rounded font-bold">
                      SUCCESS (Status 200, Exit 0)
                    </span>
                  </div>
                </div>

                {/* Stage 3: The Verdict */}
                <div className={`p-3.5 rounded-[6px] border transition-all ${
                  step >= 3
                    ? pipelineMode === "with-pp"
                      ? "bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]"
                      : "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                    : "opacity-40 border-transparent"
                }`}>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold uppercase">
                      3. {pipelineMode === "with-pp" ? "PolicyProbe Deterministic Evaluator" : "Baseline Exit Code Evaluator"}
                    </span>
                    <span className="font-bold">
                      {pipelineMode === "with-pp" ? "ASSERTION FAILED (PP-017)" : "FALSE POSITIVE PASS"}
                    </span>
                  </div>

                  {pipelineMode === "with-pp" ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="text-[#ef4444] font-bold flex items-center gap-1.5">
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span>Mismatch: Expected mustRevert, observed SUCCESS (200)</span>
                      </div>
                      <div className="text-[#c4c9dd] text-[11px] font-sans bg-black/40 p-2 rounded border border-white/[0.04]">
                        → Emitted structured finding to <code className="text-[#8259ef] font-mono">promptBuilder.ts</code>: <br />
                        <span className="text-[#9aa1be] font-mono text-[10px]">
                          &#123; category: &quot;chain-assertion-failure&quot;, actor: &quot;Bob&quot;, impact: &quot;+100 BOND leak&quot; &#125;
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs">
                      <div className="text-[#10b981] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>CLI exitCode is 0 $\to$ Task marked PASSED</span>
                      </div>
                      <div className="text-[#ef4444] text-[11px] font-sans bg-black/40 p-2 rounded border border-[#ef4444]/20 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-[#ef4444] shrink-0" />
                        <span>Silent compliance leak: Unverified investor received restricted bond asset.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo State Monogram Indicator */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PolicyProbeLogo size={28} state={pipelineMode === "with-pp" ? "fail" : "pass"} />
                  <div className="font-mono text-[11px] text-[#9aa1be]">
                    State Monogram:{" "}
                    <span className={pipelineMode === "with-pp" ? "text-[#ef4444] font-bold" : "text-[#10b981] font-bold"}>
                      {pipelineMode === "with-pp" ? "Sheared (Mismatch)" : "Aligned"}
                    </span>
                  </div>
                </div>

                <Link
                  href="/proof"
                  className="font-mono text-[11px] text-[#8259ef] hover:underline flex items-center gap-1"
                >
                  <span>Inspect Testnet Receipt</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
