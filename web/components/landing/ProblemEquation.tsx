import React from "react";
import { XCircle, CheckCircle2, ShieldAlert, Code2, ArrowRight } from "lucide-react";

export const ProblemEquation: React.FC = () => {
  return (
    <section className="border-b border-white/[0.08] bg-[#07080c] py-16 sm:py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* The Stark Mathematical Equation */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-1 text-xs font-mono text-[#ef4444] mb-4">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>THE GROUND-TRUTH GAP</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-mono leading-tight">
            A successful transaction does not prove correct behavior.
          </h2>

          <div className="mt-6 inline-flex items-center rounded-[8px] border border-white/[0.12] bg-[#0c0d12] px-6 py-3 font-mono text-sm sm:text-base shadow-lg">
            <span className="text-[#9aa1be]">CLI process exits 0</span>
            <span className="mx-4 text-[#ef4444] font-bold text-lg">≠</span>
            <span className="text-white font-bold">Policy invariant is enforced</span>
          </div>
        </div>

        {/* Side-by-Side Architectural Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto font-mono text-xs">
          {/* Card A: Baseline LLM Grading */}
          <div className="rounded-[10px] border border-[#ef4444]/30 bg-[#0c0d14] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between border-b border-[#ef4444]/20 pb-3 mb-4">
                <span className="font-bold text-[#ef4444] text-xs">BASELINE HARNESS: LLM Semantic Evaluation</span>
                <span className="rounded bg-[#ef4444]/20 px-2 py-0.5 text-[10px] text-[#ef4444] font-bold">UNRELIABLE</span>
              </div>

              <div className="space-y-2 text-[#9aa1be]">
                <div className="text-[#6e7592] font-mono text-[11px]">// 1. Coding agent writes defective contract method:</div>
                <div className="text-white bg-black/40 p-2 rounded border border-white/[0.04]">
                  await bond.transfer(unverified_bob, 100);
                </div>
                <div className="text-[#6e7592] font-mono text-[11px]">// 2. Transaction executes on Hedera Testnet:</div>
                <div className="text-[#10b981] font-mono">exitCode: 0 (Status 200 SUCCESS)</div>
                <div className="text-[#6e7592] font-mono text-[11px]">// 3. LLM reads terminal stdout:</div>
                <div className="rounded bg-black/50 p-3 text-[#c4c9dd] border border-white/[0.06] font-sans text-xs italic">
                  &ldquo;The transfer function was invoked and succeeded with exit code 0. Recipe requirements satisfied.&rdquo;
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#ef4444]/20 text-[#ef4444] font-bold flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>SILENT FAILURE: Regulatory breach shipped to production.</span>
            </div>
          </div>

          {/* Card B: PolicyProbe Deterministic Assertion */}
          <div className="rounded-[10px] border border-[#10b981]/30 bg-[#0c120e] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between border-b border-[#10b981]/20 pb-3 mb-4">
                <span className="font-bold text-[#10b981] text-xs">WITH POLICYPROBE: Deterministic Assertion</span>
                <span className="rounded bg-[#10b981]/20 px-2 py-0.5 text-[10px] text-[#10b981] font-bold">DETERMINISTIC</span>
              </div>

              <div className="space-y-2 text-[#9aa1be]">
                <div className="text-[#6e7592] font-mono text-[11px]">// 1. Recipe declares required state invariant:</div>
                <div className="text-white bg-black/40 p-2 rounded border border-white/[0.04]">
                  expect: &#123; transactionOutcome: &quot;mustRevert&quot; &#125;
                </div>
                <div className="text-[#6e7592] font-mono text-[11px]">// 2. Mirror Node reports real execution outcome:</div>
                <div className="text-[#ef4444] font-mono">observed: SUCCESS (Status 200)</div>
                <div className="text-[#6e7592] font-mono text-[11px]">// 3. Pure TypeScript evaluator compares in 0.00ms:</div>
                <div className="rounded bg-black/50 p-3 text-[#c4c9dd] border border-white/[0.06] font-mono text-xs">
                  <span className="text-[#ef4444] font-bold">FAIL</span>: reject-unverified-transfer<br />
                  <span className="text-[#8259ef]">finding</span>: POLICY_POSTCONDITION_FAILED (PP-017)
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#10b981]/20 text-[#10b981] font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>DETERMINISTIC CATCH: Typed finding feeds agent self-healing.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
