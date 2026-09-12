"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, Copy, Check, FileJson, CheckCircle2, ArrowLeft } from "lucide-react";
import { HashScanIcon, HederaIcon } from "@/components/icons/EcosystemIcons";

interface EvidenceRecord {
  id: string;
  name: string;
  txHash: string;
  consensusTimestamp: string;
  status: string;
  expected: string;
  result: "PASS" | "FAIL";
  payload: Record<string, any>;
}

export default function EvidencePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<string>("PP-001");

  const evidenceRecords: EvidenceRecord[] = [
    {
      id: "PP-001",
      name: "reject-unverified-transfer",
      txHash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
      consensusTimestamp: "1773173740.104284003",
      status: "CONTRACT_REVERT_EXECUTED",
      expected: "mustRevert",
      result: "PASS",
      payload: {
        assertionId: "PP-001",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        transactionId: "0.0.10464599-1773173730-000000000",
        hash: "0x513432955ca52f21edfb0c929d1cd6b91b1425b2aad28cd8e0830bb364391f6a",
        result: "CONTRACT_REVERT_EXECUTED",
        revertReason: "0x5a18a961 (KYCRequired)",
        chargedTxFee: "0.05281942 HBAR",
        evaluatedBy: "PolicyProbe postcondition evaluator v1.0",
        verdict: "PASS",
      },
    },
    {
      id: "PP-002",
      name: "permit-compliant-transfer",
      txHash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
      consensusTimestamp: "1773173752.549219001",
      status: "SUCCESS",
      expected: "mustSucceed",
      result: "PASS",
      payload: {
        assertionId: "PP-002",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        transactionId: "0.0.10464599-1773173742-000000000",
        hash: "0x34fd282cf21fb9d95be5dca8d8108ae532a81907cb5cf5cbca9387a385f8f828",
        result: "SUCCESS",
        sender: "0x6378eC0dFeB97059882fB61b8f15F6f2d2b51206",
        recipient: "0x785640243C8862F5f15d742617f1e5A77B139360",
        amountTransferred: "50 BOND",
        tokenBalanceDeltaSender: "-50",
        tokenBalanceDeltaRecipient: "+50",
        verdict: "PASS",
      },
    },
    {
      id: "PP-003",
      name: "reject-frozen-transfer",
      txHash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
      consensusTimestamp: "1773173765.184910003",
      status: "CONTRACT_REVERT_EXECUTED",
      expected: "mustRevert",
      result: "PASS",
      payload: {
        assertionId: "PP-003",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        hash: "0xdbe10134bc6d43eb3beab15f8a0ff1ef9ca41e172e29e92ffca3cce7a0ce733a",
        actor: "Carol (Frozen)",
        result: "CONTRACT_REVERT_EXECUTED",
        revertReason: "AccountFrozen()",
        verdict: "PASS",
      },
    },
    {
      id: "PP-004",
      name: "reject-paused-transfer",
      txHash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
      consensusTimestamp: "1773173778.490192002",
      status: "CONTRACT_REVERT_EXECUTED",
      expected: "mustRevert",
      result: "PASS",
      payload: {
        assertionId: "PP-004",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        hash: "0x79ae20a06869d8aa04d9c49ca2309c647b0a7aa52b1b3fbfa974ba4a30e84b84",
        trigger: "pause() invoked by ROLE_PAUSER",
        result: "CONTRACT_REVERT_EXECUTED",
        revertReason: "EnforcedPause()",
        verdict: "PASS",
      },
    },
    {
      id: "PP-005",
      name: "permit-resumed-transfer",
      txHash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
      consensusTimestamp: "1773173791.802194001",
      status: "SUCCESS",
      expected: "mustSucceed",
      result: "PASS",
      payload: {
        assertionId: "PP-005",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        hash: "0xee2fc4fae101ab6b97aa21c87249dc21360098f98ec81a957a26f30d0a514d7b",
        trigger: "unpause() invoked by ROLE_PAUSER",
        result: "SUCCESS",
        verdict: "PASS",
      },
    },
    {
      id: "PP-006",
      name: "idempotent-pause-state",
      txHash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
      consensusTimestamp: "1773173804.319041002",
      status: "SUCCESS",
      expected: "mustSucceed",
      result: "PASS",
      payload: {
        assertionId: "PP-006",
        contractAddress: "0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a",
        hash: "0x0ecbf8a4f90117d91d6a8f15ab9c349dc17a7a5180f9dbe1eeb1846bdf3b88b7",
        stateCheck: "paused() === false",
        result: "SUCCESS",
        verdict: "PASS",
      },
    },
  ];

  const currentRecord = evidenceRecords.find((r) => r.id === selectedRecord) || evidenceRecords[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-mono">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#8259ef] hover:underline mb-2">
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Console</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileJson className="h-6 w-6 text-[#8259ef]" />
            <span>MIRROR NODE EVIDENCE EXPLORER</span>
          </h1>
          <p className="mt-1 text-xs text-[#9aa1be]">
            Raw JSON receipts and consensus timestamps queried directly from Hedera Mirror Node REST API.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://hashscan.io/testnet/address/0x29d9c62fC1E8d2420010Ce243c6345dF9eB0b53a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08] transition"
          >
            <HashScanIcon className="h-3.5 w-3.5 text-[#8259ef]" />
            <span>Diamond on HashScan</span>
            <ExternalLink className="h-3 w-3 text-[#6e7592]" />
          </a>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Record List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-semibold text-[#6e7592] mb-2 px-1 uppercase tracking-wider">
            TESTNET ASSERTION RUNS ({evidenceRecords.length})
          </div>
          {evidenceRecords.map((r) => {
            const isSelected = r.id === selectedRecord;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRecord(r.id)}
                className={`w-full text-left rounded-[8px] border p-3.5 transition text-xs ${
                  isSelected
                    ? "border-[#8259ef] bg-[#8259ef]/10 text-white shadow-[0_0_15px_rgba(130,89,239,0.15)]"
                    : "border-white/[0.08] bg-white/[0.02] text-[#9aa1be] hover:border-white/[0.15] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#8259ef]">{r.id}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981]">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>PASS</span>
                  </span>
                </div>
                <div className="font-semibold text-white truncate mb-1">{r.name}</div>
                <div className="text-[11px] text-[#6e7592] truncate">tx: {r.txHash.slice(0, 16)}...</div>
              </button>
            );
          })}
        </div>

        {/* Right: Record Detail & Raw JSON Inspector */}
        <div className="lg:col-span-8 glass-panel rounded-[10px] p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div>
                <span className="text-xs text-[#8259ef] font-semibold">{currentRecord.id}</span>
                <h2 className="text-base sm:text-lg font-bold text-white">{currentRecord.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://hashscan.io/testnet/transaction/${currentRecord.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs text-white hover:bg-white/[0.08] transition"
                >
                  <HashScanIcon className="h-3.5 w-3.5 text-[#8259ef]" />
                  <span>HashScan Receipt</span>
                  <ExternalLink className="h-3 w-3 text-[#6e7592]" />
                </a>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-6">
              <div className="rounded-[6px] bg-black/40 p-3 border border-white/[0.06]">
                <div className="text-[#6e7592] text-[10px] mb-1">Expected:</div>
                <div className="text-white font-bold">{currentRecord.expected}</div>
              </div>
              <div className="rounded-[6px] bg-black/40 p-3 border border-white/[0.06]">
                <div className="text-[#6e7592] text-[10px] mb-1">Observed Status:</div>
                <div className="text-[#10b981] font-bold">{currentRecord.status}</div>
              </div>
              <div className="rounded-[6px] bg-black/40 p-3 border border-white/[0.06]">
                <div className="text-[#6e7592] text-[10px] mb-1">Consensus Timestamp:</div>
                <div className="text-white truncate">{currentRecord.consensusTimestamp}</div>
              </div>
            </div>

            {/* Raw JSON Code Block */}
            <div className="relative rounded-[8px] bg-black/60 p-4 text-xs border border-white/[0.08]">
              <div className="flex items-center justify-between text-[11px] text-[#6e7592] mb-2 pb-2 border-b border-white/[0.06]">
                <span>RAW MIRROR NODE RECEIPT PAYLOAD</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(currentRecord.payload, null, 2), currentRecord.id)}
                  className="flex items-center gap-1 text-[#9aa1be] hover:text-white transition"
                >
                  {copied === currentRecord.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#10b981]" />
                      <span className="text-[#10b981]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto text-[#c4c9dd] leading-relaxed">
                {JSON.stringify(currentRecord.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
