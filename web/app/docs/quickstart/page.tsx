import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { Callout, CodeBlock, DocArticle, DocH2, DocNav } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Quickstart Setup — PolicyProbe Documentation",
  description:
    "Step-by-step developer guide for setting up the sibling repositories, running the Harness suite, and executing testnet fixtures.",
};

export default function QuickstartPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Getting started"
        title="Quickstart"
        description="Run the full test suite and verify live Hedera Testnet policies in under 5 minutes."
      />

      <DocH2>1. Prerequisites</DocH2>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>
          <strong>Node.js:</strong> v20.x, v22.x, or later (Node 22.16.0 verified).
        </li>
        <li>
          <strong>Package manager:</strong> npm v10+ or pnpm v9+.
        </li>
        <li>
          <strong>Git:</strong> installed and configured.
        </li>
        <li>
          <strong>Hedera Testnet account:</strong> operator account ID and DER/ECDSA private key, funded with at least 50 ℏ
          via{" "}
          <a
            href="https://portal.hedera.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            portal.hedera.com
          </a>
          .
        </li>
      </ul>

      <DocH2>2. Sibling repository layout</DocH2>
      <p>PolicyProbe uses a two-repository layout (ADR-0002). Clone both into the same parent folder:</p>
      <CodeBlock>
        <div className="text-muted-foreground"># Clone the upstream Harness fork</div>
        <div>git clone https://github.com/manovHacksaw/hedera-harness.git</div>
        <div>cd hedera-harness</div>
        <div>git checkout policyprobe/deterministic-onchain-postconditions</div>
        <div>npm install</div>
        <br />
        <div className="text-muted-foreground"># In a sibling folder, clone PolicyProbe</div>
        <div>cd ..</div>
        <div>git clone https://github.com/manovHacksaw/PolicyProbe.git</div>
        <div>cd PolicyProbe</div>
        <div>npm install</div>
      </CodeBlock>

      <DocH2>3. Verify the Harness test suite</DocH2>
      <p>Confirm all engine and postcondition tests pass with zero regressions:</p>
      <CodeBlock>
        <div>cd ../hedera-harness</div>
        <div>npm test</div>
      </CodeBlock>
      <Callout tone="pass" title="277 passing — 0 regressions, 0 warnings" />

      <DocH2>4. Run live testnet assertions</DocH2>
      <p>
        Keep operator credentials outside git (e.g. <code>~/.hedera-testnet.env</code>) and run the live suite:
      </p>
      <CodeBlock>
        <div className="text-muted-foreground"># Live testnet assertions against the Mirror Node</div>
        <div>cd ../PolicyProbe</div>
        <div>npm run test:chain-assertion</div>
        <br />
        <div className="text-muted-foreground"># Live ATS bond policy suite</div>
        <div>cd fixtures/ats-bond</div>
        <div>node run-policy-suite.mjs</div>
      </CodeBlock>

      <DocNav prev={{ href: "/docs", label: "Overview" }} next={{ href: "/docs/architecture", label: "Architecture" }} />
    </DocArticle>
  );
}
