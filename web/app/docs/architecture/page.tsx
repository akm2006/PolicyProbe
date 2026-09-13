import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { CodeBlock, DocArticle, DocH2, DocNav } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Pipeline Architecture — PolicyProbe Documentation",
  description: "Internal architecture of the Harness 4-stage lifecycle and PolicyProbe postcondition engine.",
};

const invariants = [
  {
    title: "Multi-actor ephemeral key isolation",
    body: "Isolated keys for Alice (compliant), Bob (buyer), Carol (frozen), and an attacker — funded from the operator and swept back to zero after each run.",
  },
  {
    title: "Code evaluation, not an LLM checklist",
    body: "The baseline EVALUATE stage asked an LLM whether tests passed. PolicyProbe uses typed TypeScript comparators executed by Node.js in 0.00ms.",
  },
  {
    title: "3-state Mirror Node reader",
    body: "A strict found / not-found / infra-error trichotomy with exponential backoff separates genuine reverts from propagation latency.",
  },
  {
    title: "Autonomous repair loop",
    body: "Failed assertions produce a structured finding (category chain-assertion-failure) piped into promptBuilder.ts with the exact testnet diff.",
  },
  {
    title: "ATS diamond facet integration",
    body: "Validates AccessControlFacet, PauseFacet, FreezeFacet, and KYCFacet state on the Asset Tokenization Studio ERC-2535 diamond.",
  },
  {
    title: "Zero upstream contamination",
    body: "All 11 commits in the hedera-harness fork are generic primitives — no project branding, no downstream lock-in.",
  },
];

export default function ArchitecturePage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Engine"
        title="Architecture"
        description="End-to-end trace from recipe definition to autonomous agent repair."
      />

      <DocH2>1. Architectural flow</DocH2>
      <CodeBlock>
        <pre>{`+-----------------------------------------------------------------------+
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
                                       +--------------------------------+`}</pre>
      </CodeBlock>

      <DocH2>2. The 3-state Mirror Node trichotomy</DocH2>
      <p>
        Hedera transactions reach Mirror Nodes within 1–3 seconds, so querying too early returns HTTP <code>404</code>.
        PolicyProbe handles this with an exponential backoff reader (ADR-0007):
      </p>
      <CodeBlock>
        <div className="text-muted-foreground"># Mirror Node polling engine (src/chain/mirrorClient.ts)</div>
        <div className="mt-1">const pollIntervals = [300, 600, 1200, 2400]; // ms</div>
        <div>for (const delay of pollIntervals) &#123;</div>
        <div className="pl-4">const receipt = await fetchTransaction(txId);</div>
        <div className="pl-4 text-pass">if (receipt) return &#123; state: &quot;FOUND&quot;, receipt &#125;;</div>
        <div className="pl-4">await sleep(delay);</div>
        <div>&#125;</div>
        <div className="text-fail">return &#123; state: &quot;INFRASTRUCTURE_ERROR&quot;, reason: &quot;Mirror node timeout&quot; &#125;;</div>
      </CodeBlock>
      <p className="text-muted-foreground">
        Transient network latency is never misreported as an application failure — infrastructure failures must not pollute
        test results.
      </p>

      <DocH2>3. Design invariants</DocH2>
      <div className="border-t border-foreground/10">
        {invariants.map((item, i) => (
          <div key={item.title} className="grid grid-cols-[40px_1fr] gap-4 py-5 border-b border-foreground/10">
            <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
            <div>
              <h3 className="font-display text-xl text-foreground">{item.title}</h3>
              <p className="!mt-1 !mb-0 text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <DocNav
        prev={{ href: "/docs/quickstart", label: "Quickstart" }}
        next={{ href: "/docs/recipe-spec", label: "Recipe schema" }}
      />
    </DocArticle>
  );
}
