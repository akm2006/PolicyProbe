import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { CodeBlock, DocArticle, DocH2, DocNav, DocTable } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Recipe Specification — PolicyProbe Documentation",
  description: "Complete TypeScript interfaces and YAML recipe schema for chainValidation postconditions.",
};

const fields = [
  { field: "name", type: "string", required: true, description: "Unique invariant identifier (e.g. reject-unverified-transfer)." },
  { field: "actionRef", type: "string", required: true, description: "Path expression to the action's transaction receipt." },
  { field: "expect.transactionOutcome", type: "string", required: false, description: "mustSucceed (status 200) or mustRevert (revert executed)." },
  { field: "expect.balanceDelta", type: "object", required: false, description: "Exact numeric token or HBAR delta expected across the action." },
  { field: "expect.errorCode", type: "string", required: false, description: "EVM custom 4-byte selector (e.g. 0x5a18a961)." },
];

export default function RecipeSpecPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Engine"
        title="Recipe schema"
        description="TypeScript interfaces and declarative YAML schema for postcondition assertions."
      />

      <DocH2>1. TypeScript interfaces</DocH2>
      <p>Typed interfaces implemented directly in the Harness fork:</p>
      <CodeBlock>
        <pre>
          <span className="text-muted-foreground">{"// src/types/postconditions.ts\n"}</span>
          {`export interface PostconditionAssertion {
  name: string;
  actionRef: string; `}
          <span className="text-muted-foreground">{`// e.g. "actions[1].txHash"`}</span>
          {`
  expect: {
    transactionOutcome?: "mustSucceed" | "mustRevert";
    balanceDelta?: {
      account: string;
      expectedDelta: number | string;
      tokenId?: string;
    };
    stateEquals?: {
      contract: string;
      method: string;
      expectedValue: any;
    };
    errorCode?: string;
  };
}`}
        </pre>
      </CodeBlock>

      <DocH2>2. YAML schema reference</DocH2>
      <DocTable>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.field}>
              <td className="font-mono text-xs text-foreground whitespace-nowrap">{f.field}</td>
              <td className="font-mono text-xs text-muted-foreground">{f.type}</td>
              <td className="font-mono text-xs">{f.required ? "Yes" : "Optional"}</td>
              <td className="text-muted-foreground">{f.description}</td>
            </tr>
          ))}
        </tbody>
      </DocTable>

      <DocNav
        prev={{ href: "/docs/architecture", label: "Architecture" }}
        next={{ href: "/docs/benchmark", label: "Benchmark" }}
      />
    </DocArticle>
  );
}
