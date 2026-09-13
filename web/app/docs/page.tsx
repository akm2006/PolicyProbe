import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { Callout, CodeBlock, DocArticle, DocH2, DocNav } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Overview — PolicyProbe Documentation",
  description: "Why AI coding agents need deterministic onchain postconditions instead of LLM semantic grading.",
};

const pillars = [
  {
    title: "Declarative invariants",
    body: (
      <>
        Written in <code>spec.yaml</code> recipes next to the actions (<code>mustRevert</code>, <code>mustSucceed</code>,{" "}
        <code>balanceDelta</code>).
      </>
    ),
  },
  {
    title: "Mirror Node evidence",
    body: "Real transaction status and balance deltas, queried from Hedera REST APIs with exponential backoff.",
  },
  {
    title: "Code-based evaluation",
    body: (
      <>
        Strict TypeScript comparison in <code>0.00ms</code>. No non-deterministic prompt grading.
      </>
    ),
  },
  {
    title: "Agent repair feedback",
    body: (
      <>
        Mismatches emit structured findings into <code>promptBuilder.ts</code> so coding agents can self-heal.
      </>
    ),
  },
];

export default function DocsOverviewPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Documentation"
        title="Overview"
        description="Deterministic onchain behavioral assertions for Hedera Harness."
      />

      <p>
        PolicyProbe extends <strong>Hedera Harness</strong> with deterministic onchain postcondition assertions: declared in
        test recipes, verified against real Mirror Node records, and evaluated in code — never by an LLM.
      </p>

      <DocH2>Why PolicyProbe</DocH2>
      <p>A successful transaction does not prove correct behavior.</p>
      <CodeBlock className="text-sm text-center">
        CLI process exits 0 <span className="mx-3 text-fail">≠</span> policy invariant is enforced
      </CodeBlock>

      <p>
        Harness evaluated agent runs through <code>GENERATE → ASSERT → SMOKE → EVALUATE</code>. In the baseline{" "}
        <code>EVALUATE</code> stage, raw terminal logs were handed to an LLM:
      </p>
      <CodeBlock>
        <div className="text-muted-foreground"># Original Harness EVALUATE prompt (src/core/evaluator.ts)</div>
        <div className="mt-1">
          &quot;Review the following execution log and determine if the agent satisfied the recipe requirements...&quot;
        </div>
      </CodeBlock>

      <Callout tone="fail" title="The failure mode: exit code 0 ≠ correct policy">
        An agent ships a contract with a broken transfer restriction. The EVM returns <code>SUCCESS (200)</code>, the CLI
        exits <code>0</code>, and the LLM marks the task <strong>PASSED</strong> — silently shipping a compliance defect.
      </Callout>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 my-8 font-mono text-xs">
        <div className="bg-background p-5 space-y-2">
          <p className="!my-0 text-fail">Baseline · LLM evaluation</p>
          <p className="!my-0 text-muted-foreground">// agent writes a defective transfer</p>
          <p className="!my-0">await bond.transfer(unverified_bob, 100);</p>
          <p className="!my-0 text-muted-foreground">// testnet result</p>
          <p className="!my-0">exitCode: 0 (SUCCESS)</p>
          <p className="!my-0 text-muted-foreground">// LLM reads stdout</p>
          <p className="!my-0 font-sans italic">&ldquo;Recipe requirements satisfied.&rdquo;</p>
          <p className="!mt-4 !mb-0 text-fail">Silent failure shipped.</p>
        </div>
        <div className="bg-background p-5 space-y-2">
          <p className="!my-0 text-pass">With PolicyProbe · code assertion</p>
          <p className="!my-0 text-muted-foreground">// recipe declares the invariant</p>
          <p className="!my-0">expect: &#123; transactionOutcome: &quot;mustRevert&quot; &#125;</p>
          <p className="!my-0 text-muted-foreground">// Mirror Node reports</p>
          <p className="!my-0">observed: SUCCESS (200)</p>
          <p className="!my-0 text-muted-foreground">// TypeScript compares in 0.00ms</p>
          <p className="!my-0">FAIL: reject-unverified-transfer (PP-017)</p>
          <p className="!mt-4 !mb-0 text-pass">Typed finding feeds agent repair.</p>
        </div>
      </div>

      <DocH2>How it works</DocH2>
      <p>
        PolicyProbe turns behavioral policy from natural language into <strong>executable postcondition invariants</strong>:
      </p>
      <div className="border-t border-foreground/10">
        {pillars.map((p, i) => (
          <div key={p.title} className="grid grid-cols-[40px_1fr] gap-4 py-5 border-b border-foreground/10">
            <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            <div>
              <h3 className="font-display text-xl text-foreground">{p.title}</h3>
              <p className="!mt-1 !mb-0 text-muted-foreground">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <DocNav next={{ href: "/docs/quickstart", label: "Quickstart" }} />
    </DocArticle>
  );
}
