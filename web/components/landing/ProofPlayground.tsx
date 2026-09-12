"use client";

import React, { useState } from "react";
import { PolicyProbeLogo } from "../PolicyProbeLogo";
import { HederaIcon, HashScanIcon, DiamondIcon } from "../icons/EcosystemIcons";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Cpu,
  Layers,
  Code2,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface PolicyCase {
  id: string;
  name: string;
  category: string;
  scenario: string;
  expected: "mustRevert" | "mustSucceed";
  observedStatus: string;
  verdict: "PASS" | "FAIL";
  actor: string;
  txHash: string;
  contract: string;
  consensusTimestamp: string;
  gasUsed: number;
  findingPayload?: Record<string, any>;
}

export const ProofPlayground: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("PP-001-FAIL");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const testCases: Record<string, PolicyCase> = {
    "PP-001-FAIL": {
      id: "PP-FINDING-017",
      name: "reject-unverified-transfer (Unhardened)",
      category: "KYC Compliance Leak",
      scenario: "Unverified investor Bob (KYC=false) attempts transfer of 100 BOND",
      expected: "mustRevert",
      observedStatus: "SUCCESS (Status 200, Exit 0)",
      verdict: "FAIL",
      actor: "0x7856...9360 (Bob, Unverified)",
      txHash: "0x42c9a1e96c61008006a0f7a3d2c381dc883ef1089ba6790d26dda1ede0d1b976",
      contract: "0xeff72A1F8CE6d2a45d045d6540c7499690d79669",
      consensusTimestamp: "1773173730.000000000",
      gasUsed: 46219,
      findingPayload: {
        findingId: "PP-FINDING-017",
        rule: "reject-unverified-transfer",
        targetContract: "0xeff72A1F8CE6d2a45d045d6540c7499690d79669",
        expectedOutcome: "mustRevert",
        observedOutcome: "SUCCESS (200)",
        actor: "Bob (KYC = false)",
        leakDetected: "+100 BOND credited to unauthorized recipient",
        actionableFix: "Enforce KYC_CONTROL_LIST modifier in AccessControlFacet before transfer",
        injectedTo: "promptBuilder.ts",
      },
    },
    "PP-001-PASS": {
      id: "PP-001",
      name: "reject-unverified-transfer (Hardened)",
      category: "KYC Enforcement",
      scenario: "Unverified investor Bob attempts transfer on hardened ATS diamond",
      expected: "mustRevert",
      observedStatus: "CONTRACT_REVERT_EXECUTED (0x5a18a961)",
      verdict: "PASS",
      actor: "0x7856...9360 (Bob, Unverified)",
      txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
      contract: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      consensusTimestamp: "1773173740.104284003",
      gasUsed: 27810,
    },
    "PP-002": {
      id: "PP-002",
      name: "permit-compliant-transfer",
      category: "Authorized Flow",
      scenario: "Compliant transfer between verified Alice and verified Bob",
      expected: "mustSucceed",
      observedStatus: "SUCCESS (Status 200)",
      verdict: "PASS",
      actor: "Alice (0x6378...1206) → Bob (0x7856...9360)",
      txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
      contract: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      consensusTimestamp: "1773173752.549219001",
      gasUsed: 53180,
    },
    "PP-003": {
      id: "PP-003",
      name: "reject-frozen-transfer",
      category: "Sanctions / Frozen",
      scenario: "Sanctioned investor Carol attempts transfer while frozen",
      expected: "mustRevert",
      observedStatus: "CONTRACT_REVERT_EXECUTED (AccountFrozen)",
      verdict: "PASS",
      actor: "0x9182...4410 (Carol, Frozen)",
      txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
      contract: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      consensusTimestamp: "1773173765.184910003",
      gasUsed: 26450,
    },
    "PP-004": {
      id: "PP-004",
      name: "reject-paused-transfer",
      category: "Emergency Circuit Breaker",
      scenario: "All bond transfers rejected during emergency pause",
      expected: "mustRevert",
      observedStatus: "CONTRACT_REVERT_EXECUTED (EnforcedPause)",
      verdict: "PASS",
      actor: "0x6378...1206 (Alice)",
      txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
      contract: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      consensusTimestamp: "1773173778.490192002",
      gasUsed: 25900,
    },
    "PP-005": {
      id: "PP-005",
      name: "permit-resumed-transfer",
      category: "Post-Pause Recovery",
      scenario: "Compliant transfers resume normally after admin unpauses",
      expected: "mustSucceed",
      observedStatus: "SUCCESS (Status 200)",
      verdict: "PASS",
      actor: "Alice → Bob",
      txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
      contract: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
      consensusTimestamp: "1773173790.817291001",
      gasUsed: 52900,
    },
  };

  const activeCase = testCases[selectedCaseId];

  return (
    <section id="console" className="border-b border-white/[0.08] bg-[#050608] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#8259ef] mb-1 uppercase tracking-wider font-semibold">
              INTERACTIVE POSTCONDITION ENGINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              Live Testnet Assertion Sandbox
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#9aa1be] font-mono">
              Inspect declared invariants vs real Hedera Mirror Node consensus receipts for ATS Diamond <code className="text-white font-bold">0x29d9...b53a</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9aa1be]">
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-ping" />
            <span>Hedera Testnet REST:</span>
            <span className="text-white font-semibold">ONLINE (1.4s polling)</span>
          </div>
        </div>

        {/* Verification Console Frame */}
        <div className="rounded-[12px] border border-white/[0.12] bg-[#0a0b10] overflow-hidden shadow-2xl">
          {/* Top Selector Bar */}
          <div className="border-b border-white/[0.08] bg-white/[0.02] p-2 sm:p-3 overflow-x-auto flex items-center gap-2">
            <button
              onClick={() => setSelectedCaseId("PP-001-FAIL")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-001-FAIL"
                  ? "bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Unhardened Leak (FAIL)</span>
            </button>

            <button
              onClick={() => setSelectedCaseId("PP-001-PASS")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-001-PASS"
                  ? "bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Hardened KYC (PASS)</span>
            </button>

            <div className="h-4 w-px bg-white/[0.1] mx-1 shrink-0" />

            <button
              onClick={() => setSelectedCaseId("PP-002")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-002"
                  ? "bg-[#8259ef]/20 border border-[#8259ef]/40 text-white font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Compliant Transfer</span>
            </button>

            <button
              onClick={() => setSelectedCaseId("PP-003")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-003"
                  ? "bg-[#8259ef]/20 border border-[#8259ef]/40 text-white font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Sanctioned Freeze</span>
            </button>

            <button
              onClick={() => setSelectedCaseId("PP-004")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-004"
                  ? "bg-[#8259ef]/20 border border-[#8259ef]/40 text-white font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Emergency Pause</span>
            </button>

            <button
              onClick={() => setSelectedCaseId("PP-005")}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono font-medium transition shrink-0 flex items-center gap-1.5 ${
                selectedCaseId === "PP-005"
                  ? "bg-[#8259ef]/20 border border-[#8259ef]/40 text-white font-bold"
                  : "text-[#9aa1be] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <span>Pause Recovery</span>
            </button>
          </div>

          {/* Console Body */}
          <div className="p-6 sm:p-8 font-mono text-xs space-y-6">
            {/* Context Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {activeCase.name}
                  </span>
                  <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-[#8259ef]">
                    {activeCase.category}
                  </span>
                </div>
                <p className="text-[#9aa1be] text-xs font-sans mt-1">
                  {activeCase.scenario}
                </p>
              </div>

              {/* Verdict Indicator */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-bold border ${
                    activeCase.verdict === "FAIL"
                      ? "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30"
                      : "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30"
                  }`}
                >
                  {activeCase.verdict === "FAIL" ? (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>ASSERTION FAIL</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>ASSERTION PASS</span>
                    </>
                  )}
                </div>

                <div className="p-1.5 rounded-[8px] bg-white/[0.04] border border-white/[0.08]">
                  <PolicyProbeLogo
                    size={36}
                    state={activeCase.verdict === "FAIL" ? "fail" : "pass"}
                  />
                </div>
              </div>
            </div>

            {/* Expected vs Observed Comparator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Expected Invariant */}
              <div className="rounded-[8px] border border-white/[0.08] bg-white/[0.02] p-4 space-y-2.5">
                <div className="text-[10px] text-[#6e7592] uppercase tracking-wider font-semibold">
                  DECLARED RECIPE INVARIANT (spec.yaml)
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-[#9aa1be]">Required Outcome:</span>
                  <span className="text-white font-bold">{activeCase.expected}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-[#9aa1be]">Target Actor:</span>
                  <span className="text-white">{activeCase.actor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9aa1be]">Evaluation Method:</span>
                  <span className="text-[#10b981] font-semibold">TypeScript strict assert (0.00ms)</span>
                </div>
              </div>

              {/* Box 2: Observed Mirror Node Execution */}
              <div className="rounded-[8px] border border-white/[0.08] bg-white/[0.02] p-4 space-y-2.5">
                <div className="text-[10px] text-[#8259ef] uppercase tracking-wider font-semibold flex items-center justify-between">
                  <span>HEDERA MIRROR NODE RECEIPT</span>
                  <span className="text-[#6e7592] font-normal">{activeCase.consensusTimestamp}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-[#9aa1be]">Observed Outcome:</span>
                  <span
                    className={`font-bold ${
                      activeCase.verdict === "FAIL" ? "text-[#ef4444]" : "text-[#10b981]"
                    }`}
                  >
                    {activeCase.observedStatus}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-[#9aa1be]">Consensus Gas:</span>
                  <span className="text-white">{activeCase.gasUsed.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9aa1be]">EVM Exit Code:</span>
                  <span className="text-white">0 (CLI process clean exit)</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Receipts Bar */}
            <div className="rounded-[8px] bg-black/40 p-4 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-[10px] text-[#6e7592] uppercase tracking-wider font-semibold">
                <span>ONCHAIN CRYPTOGRAPHIC PROOF</span>
                <span className="text-[#8259ef]">HEDERA TESTNET 296</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <div className="text-[#6e7592] text-[10px] mb-1">TARGET DIAMOND CONTRACT:</div>
                  <div className="flex items-center justify-between rounded bg-white/[0.03] p-2.5 border border-white/[0.06]">
                    <span className="truncate text-white font-mono">{activeCase.contract}</span>
                    <a
                      href={`https://hashscan.io/testnet/address/${activeCase.contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#8259ef] hover:text-white transition flex items-center gap-1 shrink-0"
                    >
                      <HashScanIcon className="h-3 w-3 text-[#8259ef]" />
                      <span className="text-[10px]">HashScan</span>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-[#6e7592] text-[10px] mb-1">CONSENSUS TRANSACTION HASH:</div>
                  <div className="flex items-center justify-between rounded bg-white/[0.03] p-2.5 border border-white/[0.06]">
                    <span className="truncate text-white font-mono">{activeCase.txHash}</span>
                    <a
                      href={`https://hashscan.io/testnet/transaction/${activeCase.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[#8259ef] hover:text-white transition flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-[10px]">Verify</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Finding Payload (Harness Self-Healing Loop) */}
            {activeCase.findingPayload ? (
              <div className="rounded-[8px] bg-[#0e0e14] border border-[#ef4444]/30 p-4">
                <div className="flex items-center justify-between text-[11px] mb-2 pb-2 border-b border-[#ef4444]/20 text-[#ef4444] font-bold">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>STRUCTURED FINDING INJECTED INTO promptBuilder.ts</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(activeCase.findingPayload, null, 2),
                        "finding"
                      )
                    }
                    className="flex items-center gap-1 text-[10px] text-[#9aa1be] hover:text-white transition"
                  >
                    {copied === "finding" ? (
                      <>
                        <Check className="h-3 w-3 text-[#10b981]" />
                        <span className="text-[#10b981]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Finding JSON</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] text-[#c4c9dd] overflow-x-auto leading-relaxed">
                  {JSON.stringify(activeCase.findingPayload, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="rounded-[8px] bg-[#0c140e] border border-[#10b981]/30 p-4 text-[11px] text-[#10b981] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    <strong className="text-white">INVARIANT CONFORMANT:</strong> Hedera EVM reverted as declared in recipe. Zero findings emitted; agent task exited cleanly.
                  </span>
                </div>
                <span className="rounded bg-[#10b981]/20 px-2 py-0.5 text-[10px] font-bold shrink-0">
                  SUITE GREEN
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
