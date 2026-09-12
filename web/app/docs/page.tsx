import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, CheckCircle2, Terminal } from "lucide-react";

export const metadata = {
  title: "Overview — PolicyProbe Documentation",
  description: "Why AI coding agents need deterministic onchain postconditions instead of LLM semantic grading.",
};

export default function DocsOverviewPage() {
  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c7c7c7] font-sans">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#734AF9] mb-1 uppercase tracking-wider">
          Documentation · Introduction
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          PolicyProbe Overview
        </h1>
        <p className="text-xs sm:text-sm text-[#9B9B9B] mt-1 font-mono">
          Deterministic onchain behavioral assertions for Hedera Harness.
        </p>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">1. Executive Summary</h2>
      <p>
        PolicyProbe extends <strong>Hedera Harness</strong> with deterministic onchain postcondition assertions. Declared in test recipes, verified against real Mirror Node records, and evaluated in code—never by an LLM.
      </p>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">2. The Ground-Truth Gap in Autonomous Agent Tooling</h2>
      <p>
        Hedera Harness originally evaluated agent task runs through a four-stage pipeline: <code>GENERATE → ASSERT → SMOKE → EVALUATE</code>. In the baseline implementation of <code>EVALUATE</code>, Harness passed raw terminal execution logs to an LLM evaluator prompt:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-[#9B9B9B] leading-relaxed">
        <div className="text-[#6B6B6B]"># Original Harness EVALUATE prompt (src/core/evaluator.ts)</div>
        <div className="text-[#EF4444] mt-1">
          &quot;Review the following execution log and determine if the agent satisfied the recipe requirements...&quot;
        </div>
      </div>

      <div className="rounded-[8px] border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 my-6 text-xs text-[#EF4444] font-mono">
        <div className="font-bold flex items-center gap-2 mb-1">
          <ShieldAlert className="h-4 w-4" />
          <span>The Fatal Failure Mode: exit code 0 ≠ correct policy</span>
        </div>
        <div className="font-sans text-xs text-[#c7c7c7] mt-1">
          When an autonomous agent generates a smart contract with a defective transfer restriction (e.g. an unverified investor receiving a restricted bond), the EVM executes the transaction with status <code>SUCCESS (200)</code>. The CLI process exits with code <code>0</code>. The LLM reading the log marks the task as <strong>PASSED</strong>, silently shipping a critical compliance defect.
        </div>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">3. How PolicyProbe Solves It</h2>
      <p>
        PolicyProbe converts behavioral policy from natural language descriptions into <strong>executable postcondition invariants</strong>:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 font-mono text-xs">
        <div className="rounded-[8px] bg-[#0B0B0B] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="text-[#734AF9] font-bold mb-1">1. Declarative Invariants</div>
          <p className="text-[#9B9B9B] font-sans text-xs">
            Authored in <code>spec.yaml</code> recipes alongside action definitions (<code>mustRevert</code>, <code>mustSucceed</code>, <code>balanceDelta</code>).
          </p>
        </div>

        <div className="rounded-[8px] bg-[#0B0B0B] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="text-[#734AF9] font-bold mb-1">2. Mirror Node Evidence</div>
          <p className="text-[#9B9B9B] font-sans text-xs">
            Queried via Hedera REST APIs with exponential backoff, capturing real transaction status and balance deltas.
          </p>
        </div>

        <div className="rounded-[8px] bg-[#0B0B0B] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="text-[#734AF9] font-bold mb-1">3. Code-Based Evaluation</div>
          <p className="text-[#9B9B9B] font-sans text-xs">
            Evaluated by strict TypeScript comparison functions in <code>0.00ms</code>. Zero non-deterministic prompt evaluations.
          </p>
        </div>

        <div className="rounded-[8px] bg-[#0B0B0B] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="text-[#734AF9] font-bold mb-1">4. Agent Repair Feedback</div>
          <p className="text-[#9B9B9B] font-sans text-xs">
            Mismatches emit structured findings directly into <code>promptBuilder.ts</code>, allowing coding agents to self-heal.
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center font-mono text-xs">
        <span className="text-[#6B6B6B]">Next section</span>
        <Link
          href="/docs/quickstart"
          className="inline-flex items-center gap-1 font-semibold text-[#734AF9] hover:underline"
        >
          <span>Quickstart Setup Guide</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
