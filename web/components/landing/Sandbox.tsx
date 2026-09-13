"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Play } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PolicyProbeLogo } from "@/components/PolicyProbeLogo";
import { useInView } from "@/hooks/use-in-view";
import { hashscanAddress, hashscanTx, sandboxCases } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tab = "verdict" | "receipt" | "finding";
type Mode = "with-pp" | "baseline";

const tabs: { id: Tab; label: string }[] = [
  { id: "verdict", label: "Verdict" },
  { id: "receipt", label: "Receipt" },
  { id: "finding", label: "Finding" },
];

export function Sandbox() {
  const [selectedKey, setSelectedKey] = useState(sandboxCases[0].key);
  const [tab, setTab] = useState<Tab>("verdict");
  const [mode, setMode] = useState<Mode>("with-pp");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(3);
  const [copied, setCopied] = useState(false);
  const { ref, isVisible } = useInView<HTMLElement>();

  const active = sandboxCases.find((c) => c.key === selectedKey) ?? sandboxCases[0];
  const hasFinding = Boolean(active.findingPayload);
  const isBaseline = hasFinding && mode === "baseline";

  const runEvaluation = () => {
    if (running) return;
    setRunning(true);
    setStep(1);
    setTimeout(() => setStep(2), 500);
    setTimeout(() => {
      setStep(3);
      setRunning(false);
    }, 1000);
  };

  const selectCase = (key: string) => {
    setSelectedKey(key);
    setMode("with-pp");
    setCopied(false);
  };

  const copyText =
    tab === "receipt"
      ? active.txHash
      : tab === "finding" && active.findingPayload
        ? JSON.stringify(active.findingPayload, null, 2)
        : null;

  const handleCopy = () => {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stageClass = (n: number) => cn("transition-opacity duration-300", step >= n ? "opacity-100" : "opacity-30");

  return (
    <section id="console" ref={ref} className="relative py-24 lg:py-32 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={cn("transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
          <SectionHeader eyebrow="Sandbox" title="Real transactions." muted="Real verdicts." />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-start">
          {/* Case list */}
          <div>
            {sandboxCases.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => selectCase(c.key)}
                className={cn(
                  "w-full text-left py-5 border-b border-foreground/10 transition-all duration-500 group",
                  selectedKey === c.key ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-display group-hover:translate-x-2 transition-transform duration-300">
                      {c.label}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 font-mono text-xs shrink-0",
                      c.verdict === "PASS" ? "text-pass" : "text-fail"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", c.verdict === "PASS" ? "bg-pass" : "bg-fail")} />
                    {c.verdict}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-28 border border-foreground/10 min-w-0">
            <div className="flex items-center border-b border-foreground/10 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTab(t.id);
                    setCopied(false);
                  }}
                  className={cn(
                    "px-5 lg:px-6 py-4 text-sm font-mono transition-colors relative shrink-0",
                    tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />}
                </button>
              ))}
              <div className="flex-1" />
              {copyText && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-pass" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="px-6 lg:px-8 pt-6 pb-2 flex items-start justify-between gap-4 border-b border-foreground/10">
              <div className="min-w-0 pb-4">
                <p className="font-mono text-xs text-muted-foreground mb-1">{active.category}</p>
                <p className="text-foreground/80 leading-relaxed">{active.scenario}</p>
              </div>
              <PolicyProbeLogo
                size={28}
                className="text-foreground"
                state={isBaseline ? "pass" : active.verdict === "FAIL" ? "fail" : "pass"}
              />
            </div>

            <div className="p-6 lg:p-8 min-h-[300px] font-mono text-sm">
              {tab === "verdict" && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    {hasFinding ? (
                      <div className="inline-flex border border-foreground/10 text-xs">
                        {(["with-pp", "baseline"] as Mode[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={cn(
                              "px-3 py-2 transition-colors",
                              mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {m === "with-pp" ? "PolicyProbe" : "Baseline exit code"}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Evaluated by PolicyProbe</span>
                    )}
                    <button
                      type="button"
                      onClick={runEvaluation}
                      disabled={running}
                      className="inline-flex items-center gap-2 text-xs rounded-full border border-foreground/20 px-4 py-2 hover:bg-foreground/5 transition-colors disabled:opacity-50"
                    >
                      <Play className={cn("w-3 h-3", running && "animate-pulse")} />
                      {running ? "Evaluating…" : "Run"}
                    </button>
                  </div>

                  <div className={cn("py-4 border-b border-foreground/10", stageClass(1))}>
                    <p className="text-xs text-muted-foreground mb-1">01 · Declared</p>
                    <p>expect.transactionOutcome: &quot;{active.expected}&quot;</p>
                  </div>
                  <div className={cn("py-4 border-b border-foreground/10", stageClass(2))}>
                    <p className="text-xs text-muted-foreground mb-1">02 · Observed on Hedera</p>
                    <p className="break-words">{active.observedStatus}</p>
                  </div>
                  <div className={cn("py-4", stageClass(3))}>
                    <p className="text-xs text-muted-foreground mb-1">
                      03 · {isBaseline ? "Baseline verdict" : "PolicyProbe verdict"}
                    </p>
                    {isBaseline ? (
                      <>
                        <p className="text-pass">PASS — CLI exited 0</p>
                        <p className="mt-2 text-fail font-sans">Silent leak: an unverified investor received 100 BOND.</p>
                      </>
                    ) : active.verdict === "FAIL" ? (
                      <>
                        <p className="text-fail">FAIL — expected {active.expected}, observed SUCCESS</p>
                        <p className="mt-2 text-muted-foreground font-sans">Finding sent to promptBuilder.ts for repair.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-pass">PASS — behavior matches the recipe</p>
                        <p className="mt-2 text-muted-foreground font-sans">No findings emitted.</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {tab === "receipt" && (
                <dl className="divide-y divide-foreground/10 text-xs">
                  {[
                    ["Actor", active.actor],
                    ["Timestamp", active.consensusTimestamp],
                    ["Gas", `${active.gasUsed.toLocaleString()} units`],
                  ].map(([k, v]) => (
                    <div key={k} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="sm:text-right break-all">{v}</dd>
                    </div>
                  ))}
                  <div className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                    <dt className="text-muted-foreground">Contract</dt>
                    <dd className="sm:text-right">
                      <a
                        href={hashscanAddress(active.contract)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 break-all underline-offset-4 hover:underline"
                      >
                        {active.contract}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col gap-1">
                    <dt className="text-muted-foreground">Transaction</dt>
                    <dd>
                      <a
                        href={hashscanTx(active.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 break-all underline-offset-4 hover:underline"
                      >
                        {active.txHash}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </dd>
                  </div>
                </dl>
              )}

              {tab === "finding" &&
                (active.findingPayload ? (
                  <pre className="text-xs text-foreground/80 leading-relaxed overflow-x-auto">
                    {JSON.stringify(active.findingPayload, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground font-sans">No findings — the invariant held onchain.</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
