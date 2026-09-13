import React from "react";
import { PageHeader } from "@/components/SectionHeader";
import { DocArticle, DocNav } from "@/components/docs/DocPrimitives";

export const metadata = {
  title: "Architecture Decision Records — PolicyProbe Documentation",
  description: "Complete log of ADR-0001 through ADR-0010 governing PolicyProbe's architectural evolution.",
};

const adrs = [
  {
    id: "ADR-0001",
    title: "Branch off hedera-harness:dev",
    summary: "Pin the upstream base to hedera-dev/hedera-harness:dev @ 4bfa099 rather than main, for compatibility with active development.",
  },
  {
    id: "ADR-0002",
    title: "Sibling directory repository topology",
    summary: "hedera-harness holds pure upstream engine changes; PolicyProbe holds fixtures, docs, and the web console.",
  },
  {
    id: "ADR-0003",
    title: "Deterministic code assertions over LLM evaluation",
    summary: "Replace semantic LLM review in EVALUATE with typed postcondition assertions (mustSucceed, mustRevert, balanceDelta).",
  },
  {
    id: "ADR-0004",
    title: "Isolated feature branching",
    summary: "Keep policyprobe/deterministic-onchain-postconditions scoped with clean history until the upstream PR merges.",
  },
  {
    id: "ADR-0005",
    title: "Multi-actor ephemeral account provisioning",
    summary: "Distinct keypairs for Alice, Bob, Carol, and an attacker, with automated funding and post-run dust sweeps.",
  },
  {
    id: "ADR-0006",
    title: "ISO 6166 ISIN checksum conformance",
    summary: "Asset Tokenization Studio validates ISIN Luhn checksums; USPLCYPROB86 guarantees deployment success.",
  },
  {
    id: "ADR-0007",
    title: "Strict 3-state Mirror Node polling",
    summary: "Found / not-found / infra-error distinction eliminates false positives from consensus propagation latency.",
  },
  {
    id: "ADR-0008",
    title: "Strict upstream decoupling",
    summary: "No project-specific strings or coupling in the upstream PR — purely generic Harness verification primitives.",
  },
  {
    id: "ADR-0009",
    title: "Repair loop integration in promptBuilder.ts",
    summary: "Assertion failures become structured findings injected into the agent prompt builder for automated repair.",
  },
  {
    id: "ADR-0010",
    title: "Colocate the web verification console",
    summary: "Host the Next.js verification and evidence console in the primary repository as an integrated explorer.",
  },
];

export default function DecisionsPage() {
  return (
    <DocArticle>
      <PageHeader
        eyebrow="Governance"
        title="Decision records"
        description="Architectural decisions recorded throughout development."
      />

      <div className="border-t border-foreground/10">
        {adrs.map((adr) => (
          <div key={adr.id} className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-2 sm:gap-6 py-6 border-b border-foreground/10">
            <div className="font-mono text-xs text-muted-foreground pt-1.5">
              {adr.id}
              <span className="block mt-1 text-pass">Accepted</span>
            </div>
            <div>
              <h3 className="font-display text-2xl text-foreground">{adr.title}</h3>
              <p className="!mt-1 !mb-0 text-muted-foreground">{adr.summary}</p>
            </div>
          </div>
        ))}
      </div>

      <DocNav
        prev={{ href: "/docs/benchmark", label: "Benchmark" }}
        next={{ href: "/docs/related-work", label: "Related work" }}
      />
    </DocArticle>
  );
}
