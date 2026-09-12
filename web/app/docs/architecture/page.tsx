import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, CheckCircle2, Cpu } from "lucide-react";

export const metadata = {
  title: "Pipeline Architecture — PolicyProbe Documentation",
  description: "Internal architecture of the Harness 4-stage lifecycle and PolicyProbe postcondition engine.",
};

export default function ArchitecturePage() {
  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c7c7c7] font-sans">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#734AF9] mb-1 uppercase tracking-wider">
          Documentation · Engine Internals
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          Harness Pipeline Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#9B9B9B] mt-1 font-mono">
          End-to-end trace from recipe definition to autonomous agent repair.
        </p>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">1. Architectural Flow</h2>
      
      <div className="rounded-[8px] bg-[#050505] p-5 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-[#c7c7c7] overflow-x-auto leading-relaxed">
{`+-----------------------------------------------------------------------+
| 1. RECIPE PARSER (spec.yaml)                                          |
|    Parses actors, preconditions, test actions, and postconditions.    |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 2. ACTOR PROVISIONER                                                  |
|    Creates ephemeral keypairs for Alice, Bob, Carol; funds via HBAR.  |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 3. SMOKE STAGE (Hedera SDK Execution)                                 |
|    Submits signed transactions to Hedera Testnet (Chain ID 296).      |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 4. MIRROR NODE READER (with 3-State Exponential Backoff)             |
|    Polls https://testnet.mirrornode.hedera.com/api/v1/transactions    |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| 5. DETERMINISTIC EVALUATOR (TypeScript Comparator)                    |
|    Compares observed status vs expected (mustRevert / mustSucceed).   |
+-----------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            | (PASS)                                    | (FAIL)
            v                                           v
+-----------------------+              +--------------------------------+
| SUITE MARKED GREEN    |              | STRUCTURED FINDING EMITTED     |
| Zero findings emitted |              | Piped into promptBuilder.ts    |
+-----------------------+              | Coding agent repairs contract  |
                                       +--------------------------------+`}
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">2. The 3-State Mirror Node Trichotomy (ADR-0007)</h2>
      <p>
        Because Hedera consensus transactions propagate to Mirror Nodes within 1–3 seconds, querying too quickly yields HTTP <code>404</code>. PolicyProbe handles this with an exponential backoff reader:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-[#c7c7c7] leading-relaxed">
        <div className="text-[#6B6B6B]"># Mirror Node Polling Engine (src/chain/mirrorClient.ts)</div>
        <div className="text-white mt-1">const pollIntervals = [300, 600, 1200, 2400]; // ms</div>
        <div className="text-white">for (const delay of pollIntervals) &#123;</div>
        <div className="text-[#c7c7c7] pl-4">const receipt = await fetchTransaction(txId);</div>
        <div className="text-[#22C55E] pl-4">if (receipt) return &#123; state: &quot;FOUND&quot;, receipt &#125;;</div>
        <div className="text-[#c7c7c7] pl-4">await sleep(delay);</div>
        <div className="text-white">&#125;</div>
        <div className="text-[#EF4444]">return &#123; state: &quot;INFRASTRUCTURE_ERROR&quot;, reason: &quot;Mirror node timeout&quot; &#125;;</div>
      </div>

      <p className="text-xs text-[#9B9B9B]">
        This prevents transient network latency from being misreported as an application failure, honoring the core Harness philosophy that infrastructure failures must never pollute test results.
      </p>

      <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center font-mono text-xs">
        <Link href="/docs/quickstart" className="text-[#6B6B6B] hover:text-white">
          ← Quickstart
        </Link>
        <Link
          href="/docs/recipe-spec"
          className="inline-flex items-center gap-1 font-semibold text-[#734AF9] hover:underline"
        >
          <span>YAML Recipe Specification</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
