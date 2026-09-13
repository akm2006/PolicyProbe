"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSphere } from "./AnimatedSphere";
import { HederaIcon } from "@/components/icons/EcosystemIcons";
import { stats } from "@/lib/data";
import { buttonLg, buttonOutline, buttonPrimary, cn } from "@/lib/utils";

const words = ["expected", "executed", "verified"];

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => setWordIndex((prev) => (prev + 1) % words.length), 2500);
    return () => clearInterval(interval);
  }, []);

  const reveal = (delay = "") =>
    cn("transition-all duration-700", delay, isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
        <AnimatedSphere />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div key={`h-${i}`} className="absolute h-px bg-foreground/10 left-0 right-0" style={{ top: `${12.5 * (i + 1)}%` }} />
        ))}
        {[...Array(12)].map((_, i) => (
          <div key={`v-${i}`} className="absolute w-px bg-foreground/10 top-0 bottom-0" style={{ left: `${8.33 * (i + 1)}%` }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-36 pb-16 lg:pt-44">
        <div className={cn("mb-8", reveal())}>
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            <HederaIcon className="w-4 h-4 text-foreground" />
            Hedera Testnet · Chain 296
          </span>
        </div>

        <h1
          className={cn(
            "mb-12 text-[clamp(3rem,11vw,9rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="block">Every policy</span>
          <span className="relative inline-block">
            <span key={wordIndex} className="inline-flex">
              {words[wordIndex].split("").map((char, i) => (
                <span
                  key={`${wordIndex}-${i}`}
                  className="inline-block animate-char-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
          </span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-end">
          <p className={cn("text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl", reveal("delay-200"))}>
            Exit code 0 is not proof. PolicyProbe checks what actually happened onchain.
          </p>

          <div className={cn("flex flex-col sm:flex-row items-start gap-4", reveal("delay-300"))}>
            <a href="#console" className={cn(buttonPrimary, buttonLg)}>
              Try the sandbox
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link href="/docs" className={cn(buttonOutline, buttonLg)}>
              Read the docs
            </Link>
          </div>
        </div>
      </div>

      <div className={cn("relative z-10 pb-16 transition-all duration-700 delay-500", isVisible ? "opacity-100" : "opacity-0")}>
        <div className="flex gap-16 marquee whitespace-nowrap w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16" aria-hidden={i === 1}>
              {stats.map((stat) => (
                <div key={`${stat.label}-${i}`} className="flex items-baseline gap-4">
                  <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
                  <span className="text-sm text-muted-foreground font-mono">{stat.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
