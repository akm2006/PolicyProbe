import React from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, GitBranch, ShieldCheck, Database, Layers } from "lucide-react";
import { HederaIcon, HashScanIcon } from "@/components/icons/EcosystemIcons";

export const metadata = {
  title: "Verification Ledger — PolicyProbe",
  description: "Cryptographic receipts, upstream commits, and testnet consensus timestamps for PolicyProbe.",
};

export default function ProofPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 font-mono">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-8 mb-10">
        <div className="text-xs text-[#8259ef] mb-2 uppercase tracking-wider font-semibold">
          ONCHAIN AUDIT & REPOSITORY PROOFS
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
          VERIFICATION LEDGER
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#9aa1be] font-mono">
          Verifiable Hedera Testnet consensus receipts, pinned upstream commit hashes, and deterministic assertion records.
        </p>
      </div>

      {/* Verification Ledger Table */}
      <div className="space-y-8 text-xs">
        {/* Section 1: Upstream Contribution */}
        <div className="glass-panel rounded-[10px] p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-[#8259ef]" />
            <span>1. Upstream Harness Contribution</span>
          </h2>
          <div className="divide-y divide-white/[0.06]">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Upstream Base Repository:</span>
              <a
                href="https://github.com/hedera-dev/hedera-harness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#8259ef] transition flex items-center gap-1"
              >
                <span>hedera-dev/hedera-harness:dev</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Pinned Base SHA:</span>
              <span className="text-white font-mono">4bfa099951b147318ff245ce0d47346b9409890f</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Contribution Branch:</span>
              <span className="text-[#8259ef] font-mono">policyprobe/deterministic-onchain-postconditions</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Commits Ahead:</span>
              <span className="text-white">11 scoped commits (Zero proprietary branding)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Full Harness Suite:</span>
              <span className="text-[#10b981] font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>277 / 277 PASS (100% green, 0 regressions)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Hedera Testnet Execution */}
        <div className="glass-panel rounded-[10px] p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="h-4 w-4 text-[#8259ef]" />
            <span>2. Live Hedera Testnet Environment</span>
          </h2>
          <div className="divide-y divide-white/[0.06]">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Chain ID & Network:</span>
              <span className="text-white flex items-center gap-1.5">
                <HederaIcon className="h-4 w-4 text-white" />
                <span>296 (Hedera Testnet)</span>
              </span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Deployer / Operator Account:</span>
              <a
                href="https://hashscan.io/testnet/account/0.0.10464599"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#8259ef] transition flex items-center gap-1"
              >
                <span>0.0.10464599 (0xb40a2e5fdfaec87bad82246d041886354f5faff4)</span>
                <HashScanIcon className="h-3 w-3 text-[#8259ef]" />
              </a>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">ATS Bond Factory:</span>
              <span className="text-white">0.0.9213391</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Deployed Bond Diamond:</span>
              <a
                href="https://hashscan.io/testnet/address/0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8259ef] hover:underline flex items-center gap-1"
              >
                <span>0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a</span>
                <HashScanIcon className="h-3 w-3 text-[#8259ef]" />
              </a>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Deployed ISIN:</span>
              <span className="text-white font-mono">USPLCYPROB86 (Valid ISO 6166 checksum)</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Deployment Transaction:</span>
              <a
                href="https://hashscan.io/testnet/transaction/0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#8259ef] transition flex items-center gap-1"
              >
                <span className="truncate max-w-xs sm:max-w-md">0xc2b8cc004f862abeec6dd455df92ff5feaa602cdbdf53e2d8c4f3bc0711d2d94</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 3: Invariant Assertions Supported */}
        <div className="glass-panel rounded-[10px] p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#8259ef]" />
            <span>3. Supported Deterministic Postconditions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">mustSucceed</div>
              <div className="text-[#9aa1be] font-sans">
                Asserts that the transaction executed with status SUCCESS (status code 200).
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">mustRevert</div>
              <div className="text-[#9aa1be] font-sans">
                Asserts that the EVM reverted execution (e.g. CONTRACT_REVERT_EXECUTED with custom error selector).
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">balanceDelta</div>
              <div className="text-[#9aa1be] font-sans">
                Verifies exact numeric balance changes before and after execution across HBAR and HTS tokens.
              </div>
            </div>
            <div className="p-3.5 rounded-[8px] bg-white/[0.02] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">stateEquals</div>
              <div className="text-[#9aa1be] font-sans">
                Direct view call inspection of smart contract storage variables via EVM RPC.
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Quantitative Verification */}
        <div className="glass-panel rounded-[10px] p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#8259ef]" />
            <span>4. Quantitative Verification Summary</span>
          </h2>
          <div className="divide-y divide-white/[0.06]">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Live Onchain Assertion Evidence Tests:</span>
              <span className="text-[#10b981] font-bold">36 / 36 PASS</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Ephemeral Actor Key Provisioning Tests:</span>
              <span className="text-[#10b981] font-bold">2 / 2 PASS</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">ATS Bond Policy Conformance Suite:</span>
              <span className="text-[#10b981] font-bold">6 / 6 PASS</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-[#6e7592]">Before/After Demonstration:</span>
              <span className="text-[#10b981] font-bold">
                Caught policy defect on 0xeff7... then fixed on 0x29d9...
              </span>
            </div>
          </div>
        </div>

        {/* Navigation back */}
        <div className="pt-4 flex items-center justify-between text-xs">
          <Link href="/" className="text-[#8259ef] hover:underline">
            ← Back to Overview
          </Link>
          <Link href="/evidence" className="text-white hover:underline">
            Inspect Full Mirror Node JSON Evidence →
          </Link>
        </div>
      </div>
    </div>
  );
}
