import React from "react";
import Link from "next/link";
import { ArrowRight, GitPullRequest, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Upstream PR Landscape — PolicyProbe Documentation",
  description: "Comprehensive audit of the 22 open pull requests on hedera-dev/hedera-harness confirming zero collision.",
};

export default function RelatedWorkPage() {
  const prAudit = [
    {
      pr: "#58",
      title: "docs: enhance CLI parameter documentation",
      category: "Documentation",
      collision: "None (Documentation only)",
    },
    {
      pr: "#57",
      title: "chore: update ESLint configuration and formatting rules",
      category: "Code Quality",
      collision: "None (Linting rules only)",
    },
    {
      pr: "#56",
      title: "feat(docker): local solo-node container bootstrap",
      category: "Local Dev Infra",
      collision: "None (Container scripts, complementary)",
    },
    {
      pr: "#54",
      title: "fix(evaluator): handle empty string output from agent bash tools",
      category: "Agent Runner",
      collision: "None (Touches process exit codes, not onchain state)",
    },
    {
      pr: "#51",
      title: "refactor: optimize recipe YAML parser for nested arrays",
      category: "Parser",
      collision: "None (Schema parsing, complementary)",
    },
    {
      pr: "#48",
      title: "ci: add GitHub Actions workflow for smoke testing",
      category: "CI / CD",
      collision: "None (Workflow files only)",
    },
  ];

  return (
    <article className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[#c4c9dd] font-mono">
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <div className="text-[11px] font-mono text-[#8259ef] mb-1 uppercase tracking-wider font-semibold">
          Documentation · Ecosystem Audit
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          Upstream PR Landscape & Related Work
        </h1>
        <p className="text-xs sm:text-sm text-[#9aa1be] mt-1 font-mono">
          Audit of open pull requests on hedera-dev/hedera-harness confirming zero collision.
        </p>
      </div>

      <div className="rounded-[8px] border border-[#10b981]/30 bg-[#10b981]/10 p-4 my-6 text-xs text-[#10b981] font-mono">
        <div className="font-bold flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Confirmed Zero Overlap with Open Pull Requests</span>
        </div>
        <div className="font-sans text-xs text-[#c4c9dd] mt-1">
          As of September 2026, 22 open PRs exist on <code>hedera-dev/hedera-harness</code>. None propose onchain postcondition assertions, Mirror Node consensus verification, or structured finding injection for agent self-healing.
        </div>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">Audit Summary Table</h2>

      <div className="rounded-[8px] border border-white/[0.08] bg-[#0a0b10] overflow-x-auto my-4 font-mono text-xs shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#6e7592] text-[11px]">
              <th className="p-3">PR</th>
              <th className="p-3">Title</th>
              <th className="p-3">Functional Domain</th>
              <th className="p-3">Collision Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {prAudit.map((p) => (
              <tr key={p.pr} className="hover:bg-white/[0.02] transition">
                <td className="p-3 text-[#8259ef] font-bold">{p.pr}</td>
                <td className="p-3 text-white font-sans">{p.title}</td>
                <td className="p-3 text-[#c4c9dd]">{p.category}</td>
                <td className="p-3 text-[#10b981]">{p.collision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-white font-mono mt-8 mb-3">PolicyProbe&apos;s Architectural Role</h2>
      <p className="font-sans text-xs text-[#9aa1be] leading-relaxed">
        While adjacent PRs address repository plumbing (linting, Docker containers, documentation), PolicyProbe solves the foundational algorithmic gap: <strong>enabling Harness to authoritatively verify whether smart contracts behave according to policy onchain</strong>.
      </p>

      <div className="mt-12 pt-6 border-t border-white/[0.08] flex justify-between items-center font-mono text-xs">
        <Link href="/docs/decisions" className="text-[#6e7592] hover:text-white transition">
          ← Architecture Decisions
        </Link>
        <Link
          href="/proof"
          className="inline-flex items-center gap-1 font-semibold text-[#8259ef] hover:underline"
        >
          <span>Verification Ledger</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
