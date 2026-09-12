import React from "react";
import Link from "next/link";
import { PolicyProbeLogo } from "./PolicyProbeLogo";
import { HederaIcon, HashScanIcon, GitHubIcon } from "./icons/EcosystemIcons";
import { ExternalLink, GitPullRequest } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] py-14 text-xs text-[#6e7592] font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PolicyProbeLogo size={22} />
              <span className="font-semibold tracking-tight text-white font-mono text-sm">PolicyProbe</span>
            </div>
            <p className="text-[#9aa1be] font-sans text-xs leading-relaxed">
              Deterministic onchain behavioral assertions for Hedera Harness. Executed on Hedera Testnet, verified via Mirror Node records in pure code.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#c4c9dd]">
                <HederaIcon className="h-3.5 w-3.5 text-white" />
                <span>Testnet Chain 296</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 tracking-wider text-[11px] uppercase text-[#8259ef]">
              Verification Ledger
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/proof" className="hover:text-white transition flex items-center gap-1">
                  <span>Verification Ledger</span>
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="hover:text-white transition flex items-center gap-1">
                  <span>Mirror Node Cryptographic Evidence</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://hashscan.io/testnet/address/0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <HashScanIcon className="h-3 w-3 text-[#8259ef]" />
                  <span>Active ATS Diamond Facets</span>
                  <ExternalLink className="h-2.5 w-2.5 text-[#6e7592]" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 tracking-wider text-[11px] uppercase text-[#8259ef]">
              Documentation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/docs" className="hover:text-white transition">
                  Overview & Problem
                </Link>
              </li>
              <li>
                <Link href="/docs/quickstart" className="hover:text-white transition">
                  Quickstart Setup
                </Link>
              </li>
              <li>
                <Link href="/docs/recipe-spec" className="hover:text-white transition">
                  Recipe Schema Specification
                </Link>
              </li>
              <li>
                <Link href="/docs/architecture" className="hover:text-white transition">
                  Five-Stage Architecture
                </Link>
              </li>
              <li>
                <Link href="/docs/benchmark" className="hover:text-white transition">
                  Quantitative Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/docs/related-work" className="hover:text-white transition">
                  Upstream PR Landscape (22 PRs)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 tracking-wider text-[11px] uppercase text-[#8259ef]">
              Upstream Repositories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/hedera-dev/hedera-harness/compare/dev...manovHacksaw:hedera-harness:policyprobe/deterministic-onchain-postconditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition text-[#c4c9dd]"
                >
                  <GitPullRequest className="h-3.5 w-3.5 text-[#8259ef]" />
                  <span>Harness Fork PR Diff</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/manovHacksaw/PolicyProbe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <GitHubIcon className="h-3 w-3" />
                  <span>PolicyProbe Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://docs.hedera.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <HederaIcon className="h-3.5 w-3.5 text-white" />
                  <span>Official Hedera Docs</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-[#8259ef] font-semibold">PolicyProbe</span>
            <span className="text-[#4c526b]">·</span>
            <span>Expected. Executed. Verified.</span>
          </div>
          <div className="text-[#6e7592]">
            Open Source Apache-2.0 · Built for Hedera Harness
          </div>
        </div>
      </div>
    </footer>
  );
};
