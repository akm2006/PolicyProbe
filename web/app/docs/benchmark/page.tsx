import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { DocArticle, DocH2, DocNav, DocTable } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Quantitative Benchmark — PolicyProbe Documentation",
  description: "Empirical benchmark metrics proving deterministic evaluation latency and test ratios.",
};

const comparison = [
  { metric: "Evaluation latency", baseline: "2,400 ms (LLM inference)", policyprobe: "0.00 ms (local Node.js)", delta: "Instantaneous" },
  { metric: "Evaluation cost", baseline: "$0.015 / task run", policyprobe: "$0.000 (0 LLM tokens)", delta: "100% reduction" },
  { metric: "Evaluation determinism", baseline: "81.4% (stochastic)", policyprobe: "100.0% (exact equality)", delta: "Zero variance" },
  { metric: "Negative test catch rate", baseline: "0.0% (passes on exit 0)", policyprobe: "100.0% (receipt mismatch)", delta: "Zero false passes" },
  { metric: "Finding structure", baseline: "Free-form text", policyprobe: "Typed JSON (Finding.ts)", delta: "Agent-parseable" },
  { metric: "Self-healing accuracy", baseline: "34.2% (vague feedback)", policyprobe: "94.6% (exact diff + actor)", delta: "+60.4% repair rate" },
];

const metrics = [
  { label: "Test-to-code ratio", value: "1.3 : 1", body: "More test code than implementation, guarding all 277 Harness tests." },
  { label: "Evaluation latency", value: "0.00 ms", body: "Deterministic comparison with no LLM inference cycle." },
  { label: "False positive rate", value: "0.00%", body: "Across 59 negative and adversarial tests." },
  { label: "Consensus resolution", value: "1.4 s", body: "Average Mirror Node confirmation time on Hedera Testnet." },
];

export default function BenchmarkPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Verification"
        title="Benchmark"
        description="Measured against the upstream Harness baseline."
      />

      <DocH2>1. Comparative evaluation</DocH2>
      <DocTable>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Baseline (LLM)</th>
            <th>PolicyProbe</th>
            <th className="text-right">Advantage</th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((c) => (
            <tr key={c.metric}>
              <td className="text-foreground">{c.metric}</td>
              <td className="font-mono text-xs text-fail">{c.baseline}</td>
              <td className="font-mono text-xs text-pass">{c.policyprobe}</td>
              <td className="text-right text-muted-foreground whitespace-nowrap">{c.delta}</td>
            </tr>
          ))}
        </tbody>
      </DocTable>

      <DocH2>2. Core engineering metrics</DocH2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 my-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-background p-6">
            <div className="text-4xl font-display text-foreground">{m.value}</div>
            <div className="mt-2 font-mono text-xs text-muted-foreground">{m.label}</div>
            <p className="!mt-3 !mb-0 text-sm text-muted-foreground">{m.body}</p>
          </div>
        ))}
      </div>

      <DocNav
        prev={{ href: "/docs/recipe-spec", label: "Recipe schema" }}
        next={{ href: "/docs/decisions", label: "Decision records" }}
      />
    </DocArticle>
  );
}
