"use client";

import React, { useState } from "react";
import { HashScanIcon } from "../icons/EcosystemIcons";
import { CheckCircle2, ExternalLink, Copy, Check, Table, ShieldCheck } from "lucide-react";

interface PolicyItem {
  id: string;
  name: string;
  description: string;
  expected: string;
  observed: string;
  result: "PASS";
  txHash: string;
  consensusGas: number;
}

export const PolicyMatrix: React.FC = () => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const policies: PolicyItem[] = [
    {
      id: "PP-001",
      name: "reject-unverified-transfer",
      description: "Transfer to non-whitelisted investor must revert immediately (0x5a18a961)",
      expected: "mustRevert",
      observed: "CONTRACT_REVERT_EXECUTED",
      result: "PASS",
      txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
      consensusGas: 27810,
    },
    {
      id: "PP-002",
      name: "permit-compliant-transfer",
      description: "Transfer between KYC-verified Alice and Bob must succeed with balance delta",
      expected: "mustSucceed",
      observed: "SUCCESS (Status 200)",
      result: "PASS",
      txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
      consensusGas: 53180,
    },
    {
      id: "PP-003",
      name: "reject-frozen-transfer",
      description: "Transfer from sanctioned/frozen Carol must revert (AccountFrozen)",
      expected: "mustRevert",
      observed: "CONTRACT_REVERT_EXECUTED",
      result: "PASS",
      txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
      consensusGas: 26450,
    },
    {
      id: "PP-004",
      name: "reject-paused-transfer",
      description: "All token transfers must revert when emergency pause is active (EnforcedPause)",
      expected: "mustRevert",
      observed: "CONTRACT_REVERT_EXECUTED",
      result: "PASS",
      txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
      consensusGas: 25900,
    },
    {
      id: "PP-005",
      name: "permit-resumed-transfer",
      description: "Compliant transfers resume normally once unpaused by admin role",
      expected: "mustSucceed",
      observed: "SUCCESS (Status 200)",
      result: "PASS",
      txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
      consensusGas: 52900,
    },
    {
      id: "PP-006",
      name: "idempotent-pause-state",
      description: "Secondary pause check does not trigger inconsistent reversion",
      expected: "mustSucceed",
      observed: "SUCCESS (Status 200)",
      result: "PASS",
      txHash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
      consensusGas: 24320,
    },
  ];

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <section id="matrix" className="border-b border-white/[0.08] bg-[#07080c] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs font-mono text-[#c4c9dd] mb-3">
            <Table className="h-3.5 w-3.5 text-[#8259ef]" />
            <span>CONFORMANCE MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Full 6-Policy ATS Conformance Suite
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9aa1be] font-mono leading-relaxed">
            Every invariant is evaluated by real TypeScript assertion code against real Hedera Mirror Node transaction receipts mined on Hedera Testnet (Chain ID 296).
          </p>
        </div>

        {/* Evidence Table */}
        <div className="rounded-[12px] border border-white/[0.1] bg-[#0a0b10] overflow-x-auto shadow-2xl">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#6e7592] text-[11px]">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">INVARIANT / RULE</th>
                <th className="py-3 px-4 font-semibold">DESCRIPTION</th>
                <th className="py-3 px-4 font-semibold">EXPECTED</th>
                <th className="py-3 px-4 font-semibold">OBSERVED ONCHAIN</th>
                <th className="py-3 px-4 font-semibold">GAS</th>
                <th className="py-3 px-4 font-semibold">VERDICT</th>
                <th className="py-3 px-4 font-semibold text-right">PROOF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4 text-[#8259ef] font-bold">{p.id}</td>
                  <td className="py-3 px-4 text-white font-medium">{p.name}</td>
                  <td className="py-3 px-4 text-[#9aa1be] max-w-xs font-sans text-xs">{p.description}</td>
                  <td className="py-3 px-4 text-[#c4c9dd]">{p.expected}</td>
                  <td className="py-3 px-4 text-white">
                    <span className="bg-white/[0.04] px-1.5 py-0.5 rounded text-[11px]">
                      {p.observed}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6e7592]">{p.consensusGas.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded bg-[#10b981]/15 px-2 py-0.5 text-[11px] font-bold text-[#10b981] border border-[#10b981]/30">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{p.result}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopy(p.txHash)}
                        className="p-1 rounded hover:bg-white/[0.08] text-[#6e7592] hover:text-white transition"
                        title="Copy Tx Hash"
                      >
                        {copiedTx === p.txHash ? (
                          <Check className="h-3.5 w-3.5 text-[#10b981]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <a
                        href={`https://hashscan.io/testnet/transaction/${p.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 p-1 rounded hover:bg-white/[0.08] text-[#8259ef] hover:text-white transition"
                        title="View on HashScan"
                      >
                        <HashScanIcon className="h-3.5 w-3.5 text-[#8259ef]" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
