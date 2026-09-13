"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedTetrahedron } from "./AnimatedTetrahedron";
import { useInView } from "@/hooks/use-in-view";
import { HARNESS_PR_URL } from "@/lib/data";
import { buttonLg, buttonOutline, buttonPrimary, cn } from "@/lib/utils";

export function CallToAction() {
  const { ref, isVisible } = useInView<HTMLElement>(0.2);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={cn(
            "relative border border-foreground transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          onMouseMove={handleMouseMove}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                Don&apos;t trust exit codes.
                <br />
                Inspect the evidence.
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                Every assertion links to a Hedera Testnet receipt.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/proof" className={cn(buttonPrimary, buttonLg)}>
                  Verification ledger
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={HARNESS_PR_URL} target="_blank" rel="noopener noreferrer" className={cn(buttonOutline, buttonLg)}>
                  View Harness PR
                </a>
              </div>

              <p className="text-sm text-muted-foreground mt-8 font-mono">
                6/6 ATS assertions · Hedera Testnet evidence · Apache-2.0
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-center w-[500px] h-[500px] -mr-16">
              <AnimatedTetrahedron />
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
