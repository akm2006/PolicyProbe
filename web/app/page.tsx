import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { TelemetryBar } from "@/components/landing/TelemetryBar";
import { ProblemEquation } from "@/components/landing/ProblemEquation";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProofPlayground } from "@/components/landing/ProofPlayground";
import { PolicyMatrix } from "@/components/landing/PolicyMatrix";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { ArrowRight, GitPullRequest, FileCheck, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero with Execution Inspector */}
      <HeroSection />

      {/* 2. Real-Time Telemetry Bar */}
      <TelemetryBar />

      {/* 3. The Ground-Truth Equation (exit code 0 ≠ policy is correct) */}
      <ProblemEquation />

      {/* 4. Five Functional Pipeline Stages (DECLARE -> EXECUTE -> OBSERVE -> COMPARE -> REPAIR) */}
      <HowItWorks />

      {/* 5. Interactive Assertion Sandbox */}
      <ProofPlayground />

      {/* 6. Full 6-Policy ATS Conformance Suite */}
      <PolicyMatrix />

      {/* 7. Bento Grid Architecture Invariants */}
      <BentoGrid />

      {/* 8. Verification & Upstream PR Navigation Banner */}
      <section className="border-b border-white/[0.08] bg-[#050608] py-14 sm:py-16 font-mono text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[10px] border border-white/[0.1] bg-white/[0.02] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[#8259ef] text-[11px] uppercase tracking-wider mb-1 font-semibold">
                VERIFICATION LEDGER · UPSTREAM INTEGRATION
              </div>
              <div className="text-white font-bold text-base sm:text-lg">
                Inspect Upstream Diff & Verified Testnet Evidence
              </div>
              <div className="text-[#9aa1be] mt-1 font-sans text-xs">
                hedera-dev/hedera-harness:dev @ 4bfa099 · 11 scoped commits · 277/277 tests passing
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/proof"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#8259ef] px-4 py-2 font-semibold text-white transition hover:bg-[#734af9]"
              >
                <FileCheck className="h-4 w-4" />
                <span>Verification Ledger</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <a
                href="https://github.com/hedera-dev/hedera-harness/compare/dev...manovHacksaw:hedera-harness:policyprobe/deterministic-onchain-postconditions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.1] bg-white/[0.04] px-4 py-2 font-medium text-white transition hover:bg-white/[0.08]"
              >
                <GitPullRequest className="h-3.5 w-3.5 text-[#8259ef]" />
                <span>Harness PR</span>
              </a>

              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.06] bg-transparent px-4 py-2 text-[#9aa1be] hover:text-white transition"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
