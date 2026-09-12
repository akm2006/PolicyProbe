import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Quickstart Setup — PolicyProbe Documentation",
  description: "Step-by-step developer guide for setting up the sibling repositories, running the Harness suite, and executing testnet fixtures.",
};

export default function QuickstartPage() {
  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c7c7c7] font-sans">
      <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#734AF9] mb-1 uppercase tracking-wider">
          Documentation · Getting Started
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          Quickstart Setup Guide
        </h1>
        <p className="text-xs sm:text-sm text-[#9B9B9B] mt-1 font-mono">
          Run the full test suite and verify live Hedera Testnet policies in under 5 minutes.
        </p>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">1. Prerequisites</h2>
      <ul className="list-disc pl-5 space-y-1 text-xs my-3 text-[#c7c7c7]">
        <li><strong>Node.js:</strong> v20.x, v22.x, or later (Node 22.16.0 verified).</li>
        <li><strong>Package Manager:</strong> npm v10+ or pnpm v9+.</li>
        <li><strong>Git:</strong> Installed and configured.</li>
        <li><strong>Hedera Testnet Account:</strong> Operator account ID and DER/ECDSA private key (funded with at least 50 ℏ via <a href="https://portal.hedera.com" target="_blank" rel="noopener noreferrer" className="text-[#734AF9] underline">portal.hedera.com</a>).</li>
      </ul>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">2. Sibling Repository Layout (ADR-0002)</h2>
      <p>
        PolicyProbe adheres to a strict two-repository architecture. Clone both repositories into the same parent folder:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-white leading-relaxed">
        <div className="text-[#6B6B6B]"># Clone the upstream Harness fork</div>
        <div>git clone https://github.com/manovHacksaw/hedera-harness.git</div>
        <div>cd hedera-harness</div>
        <div>git checkout policyprobe/deterministic-onchain-postconditions</div>
        <div>npm install</div>
        <br />
        <div className="text-[#6B6B6B]"># In a sibling folder, clone PolicyProbe</div>
        <div>cd ..</div>
        <div>git clone https://github.com/manovHacksaw/PolicyProbe.git</div>
        <div>cd PolicyProbe</div>
        <div>npm install</div>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">3. Verify the Upstream Harness Test Suite</h2>
      <p>
        Verify that all core engine tests and postcondition assertion tests pass with zero regressions:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-white">
        <div>cd ../hedera-harness</div>
        <div>npm test</div>
      </div>

      <div className="rounded-[6px] bg-[#121212] border border-[#22C55E]/30 p-3 my-3 font-mono text-xs text-[#22C55E] flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Output: 277 passing (100% green, 0 regressions, 0 warnings)</span>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">4. Execute Live Hedera Testnet Assertions</h2>
      <p>
        Save your operator credentials outside git (e.g. in <code>~/.hedera-testnet.env</code>) and run the live assertion suite:
      </p>

      <div className="rounded-[8px] bg-[#050505] p-4 font-mono text-xs border border-[rgba(255,255,255,0.08)] my-4 text-white">
        <div className="text-[#6B6B6B]"># Execute live testnet assertions against Hedera Mirror Node</div>
        <div>cd ../PolicyProbe</div>
        <div>npm run test:chain-assertion</div>
        <br />
        <div className="text-[#6B6B6B]"># Execute live ATS bond policy suite</div>
        <div>cd fixtures/ats-bond</div>
        <div>node run-policy-suite.mjs</div>
      </div>

      <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.08)] flex justify-between items-center font-mono text-xs">
        <Link href="/docs" className="text-[#6B6B6B] hover:text-white">
          ← Overview
        </Link>
        <Link
          href="/docs/architecture"
          className="inline-flex items-center gap-1 font-semibold text-[#734AF9] hover:underline"
        >
          <span>Harness Pipeline Architecture</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
