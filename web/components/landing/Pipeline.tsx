"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { useInView } from "@/hooks/use-in-view";
import { pipelineSteps } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Pipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const { ref, isVisible } = useInView<HTMLElement>();

  useEffect(() => {
    const interval = setInterval(() => setActiveStep((prev) => (prev + 1) % pipelineSteps.length), 5000);
    return () => clearInterval(interval);
  }, [activeStep]);

  const step = pipelineSteps[activeStep];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden scroll-mt-24"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className={cn("transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <SectionHeader inverted eyebrow="How it works" title="Five steps." muted="Pure code at every one." />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 lg:items-center">
          <div>
            {pipelineSteps.map((s, index) => (
              <button
                key={s.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={cn(
                  "w-full text-left py-6 border-b border-background/10 transition-all duration-500 group",
                  activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-background/30 w-10 shrink-0">{s.number}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-display mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {s.title}
                    </h3>
                    <p className="text-background/60 leading-relaxed">{s.description}</p>
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div key={activeStep} className="h-full bg-background w-0 progress-fill" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="w-full min-w-0">
            <div className="border border-background/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">{step.file}</span>
              </div>

              <div className="p-6 lg:p-8 font-mono text-sm min-h-[220px] overflow-x-auto">
                <pre className="text-background/70">
                  {step.code.split("\n").map((line, lineIndex) => (
                    <div
                      key={`${activeStep}-${lineIndex}`}
                      className="leading-loose code-line-reveal"
                      style={{ animationDelay: `${lineIndex * 80}ms` }}
                    >
                      <span className="text-background/20 select-none w-8 inline-block">{lineIndex + 1}</span>
                      <span className="inline-flex">
                        {line.split("").map((char, charIndex) => (
                          <span
                            key={`${activeStep}-${lineIndex}-${charIndex}`}
                            className="code-char-reveal"
                            style={{ animationDelay: `${lineIndex * 80 + charIndex * 15}ms` }}
                          >
                            {char === " " ? " " : char}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              <div className="px-6 py-4 border-t border-background/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-pass animate-pulse" />
                <span className="text-xs font-mono text-background/40">
                  Step {activeStep + 1} of {pipelineSteps.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
