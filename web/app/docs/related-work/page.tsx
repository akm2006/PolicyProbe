import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { Callout, DocArticle, DocH2, DocNav, DocTable } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Upstream PR Landscape — PolicyProbe Documentation",
  description: "Comprehensive audit of the 22 open pull requests on hedera-dev/hedera-harness confirming zero collision.",
};

const prAudit = [
  { pr: "#58", title: "docs: enhance CLI parameter documentation", category: "Documentation", collision: "None (documentation only)" },
  { pr: "#57", title: "chore: update ESLint configuration and formatting rules", category: "Code quality", collision: "None (linting rules only)" },
  { pr: "#56", title: "feat(docker): local solo-node container bootstrap", category: "Local dev infra", collision: "None (container scripts, complementary)" },
  { pr: "#54", title: "fix(evaluator): handle empty string output from agent bash tools", category: "Agent runner", collision: "None (process exit codes, not onchain state)" },
  { pr: "#51", title: "refactor: optimize recipe YAML parser for nested arrays", category: "Parser", collision: "None (schema parsing, complementary)" },
  { pr: "#48", title: "ci: add GitHub Actions workflow for smoke testing", category: "CI / CD", collision: "None (workflow files only)" },
];

export default function RelatedWorkPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Governance"
        title="Related work"
        description="Audit of open pull requests on hedera-dev/hedera-harness."
      />

      <Callout tone="pass" title="Zero overlap with open pull requests">
        As of September 2026, 22 PRs are open on <code>hedera-dev/hedera-harness</code>. None propose onchain postcondition
        assertions, Mirror Node consensus verification, or structured finding injection for agent self-healing.
      </Callout>

      <DocH2>Audit summary</DocH2>
      <DocTable>
        <thead>
          <tr>
            <th>PR</th>
            <th>Title</th>
            <th>Domain</th>
            <th>Collision</th>
          </tr>
        </thead>
        <tbody>
          {prAudit.map((p) => (
            <tr key={p.pr}>
              <td className="font-mono text-xs text-foreground">{p.pr}</td>
              <td className="text-foreground">{p.title}</td>
              <td className="text-muted-foreground whitespace-nowrap">{p.category}</td>
              <td className="text-muted-foreground">{p.collision}</td>
            </tr>
          ))}
        </tbody>
      </DocTable>

      <DocH2>PolicyProbe&apos;s role</DocH2>
      <p>
        Adjacent PRs address repository plumbing — linting, containers, documentation. PolicyProbe closes the foundational
        gap: <strong>letting Harness verify whether smart contracts behave according to policy onchain</strong>.
      </p>

      <DocNav
        prev={{ href: "/docs/decisions", label: "Decision records" }}
        next={{ href: "/proof", label: "Verification ledger" }}
      />
    </DocArticle>
  );
}
