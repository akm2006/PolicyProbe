import React from "react";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";

export const metadata = {
  title: "Recipe Specification — PolicyProbe Documentation",
  description: "Complete TypeScript interfaces and YAML recipe schema for chainValidation postconditions.",
};

export default function RecipeSpecPage() {
  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c7c7c7] font-sans">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#734AF9] mb-1 uppercase tracking-wider">
          Documentation · Specification
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          Recipe Schema Specification
        </h1>
        <p className="text-xs sm:text-sm text-[#9B9B9B] mt-1 font-mono">
          TypeScript interfaces and declarative YAML schema for postcondition assertions.
        </p>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">1. TypeScript Interfaces</h2>
      <p>
        PolicyProbe defines typed interfaces implemented directly in the Harness fork:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-[#c7c7c7] overflow-x-auto leading-relaxed">
        <span className="text-[#6B6B6B]">// src/types/postconditions.ts</span><br />
        <span className="text-[#734AF9]">export interface</span> <span className="text-white">PostconditionAssertion</span> &#123;<br />
        &nbsp;&nbsp;<span className="text-white">name</span>: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;<span className="text-white">actionRef</span>: <span className="text-[#22C55E]">string</span>; <span className="text-[#6B6B6B]">// e.g. &quot;actions[1].txHash&quot;</span><br />
        &nbsp;&nbsp;<span className="text-white">expect</span>: &#123;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">transactionOutcome</span>?: <span className="text-[#22C55E]">&quot;mustSucceed&quot; | &quot;mustRevert&quot;</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">balanceDelta</span>?: &#123;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">account</span>: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">expectedDelta</span>: <span className="text-[#22C55E]">number | string</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">tokenId</span>?: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&#125;;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">stateEquals</span>?: &#123;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">contract</span>: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">method</span>: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">expectedValue</span>: <span className="text-[#22C55E]">any</span>;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&#125;;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white">errorCode</span>?: <span className="text-[#22C55E]">string</span>;<br />
        &nbsp;&nbsp;&#125;;<br />
        &#125;
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">2. YAML Schema Reference</h2>

      <div className="rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] overflow-x-auto my-4 font-mono text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[#121212] text-[#9B9B9B]">
              <th className="p-3">Field</th>
              <th className="p-3">Type</th>
              <th className="p-3">Required</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            <tr>
              <td className="p-3 text-white font-bold">name</td>
              <td className="p-3 text-[#734AF9]">string</td>
              <td className="p-3 text-[#22C55E]">Yes</td>
              <td className="p-3 text-[#9B9B9B]">Unique invariant identifier (e.g. reject-unverified-transfer).</td>
            </tr>
            <tr>
              <td className="p-3 text-white font-bold">actionRef</td>
              <td className="p-3 text-[#734AF9]">string</td>
              <td className="p-3 text-[#22C55E]">Yes</td>
              <td className="p-3 text-[#9B9B9B]">Path expression to the action&apos;s transaction receipt.</td>
            </tr>
            <tr>
              <td className="p-3 text-white font-bold">expect.transactionOutcome</td>
              <td className="p-3 text-[#734AF9]">string</td>
              <td className="p-3 text-[#9B9B9B]">Optional</td>
              <td className="p-3 text-[#9B9B9B]">mustSucceed (status 200) or mustRevert (revert executed).</td>
            </tr>
            <tr>
              <td className="p-3 text-white font-bold">expect.balanceDelta</td>
              <td className="p-3 text-[#734AF9]">object</td>
              <td className="p-3 text-[#9B9B9B]">Optional</td>
              <td className="p-3 text-[#9B9B9B]">Exact numeric token or HBAR delta expected across the action.</td>
            </tr>
            <tr>
              <td className="p-3 text-white font-bold">expect.errorCode</td>
              <td className="p-3 text-[#734AF9]">string</td>
              <td className="p-3 text-[#9B9B9B]">Optional</td>
              <td className="p-3 text-[#9B9B9B]">EVM custom 4-byte selector (e.g. 0x5a18a961).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center font-mono text-xs">
        <Link href="/docs/architecture" className="text-[#6B6B6B] hover:text-white">
          ← Architecture
        </Link>
        <Link
          href="/docs/benchmark"
          className="inline-flex items-center gap-1 font-semibold text-[#734AF9] hover:underline"
        >
          <span>Quantitative Benchmark</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
