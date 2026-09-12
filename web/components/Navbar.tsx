"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PolicyProbeLogo } from "./PolicyProbeLogo";
import { HederaIcon, GitHubIcon } from "./icons/EcosystemIcons";
import { GitPullRequest } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/" },
    { label: "Sandbox", href: "/#console" },
    { label: "Suite", href: "/#matrix" },
    { label: "Docs", href: "/docs" },
    { label: "Verification", href: "/proof" },
    { label: "Evidence", href: "/evidence" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050608]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Hedera Testnet Network Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
            <PolicyProbeLogo size={24} interactive={true} />
            <span className="font-semibold tracking-tight text-white font-mono text-sm">PolicyProbe</span>
          </Link>

          {/* Official Hedera Badge: Authentic White Mark + Status Beacon */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-[#c4c9dd] whitespace-nowrap">
            <HederaIcon className="h-4 w-4 text-white shrink-0" />
            <span className="text-white font-medium">Hedera Testnet</span>
            <span className="text-[#6e7592]">·</span>
            <span className="text-[#8259ef]">296</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0" />
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium font-mono shrink-0">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                ? false
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-[#9aa1be] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://github.com/hedera-dev/hedera-harness/compare/dev...manovHacksaw:hedera-harness:policyprobe/deterministic-onchain-postconditions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-[6px] border border-[#8259ef]/30 bg-[#8259ef]/10 px-2.5 py-1 text-xs font-mono text-[#c4c9dd] transition hover:border-[#8259ef] hover:text-white hover:bg-[#8259ef]/20 whitespace-nowrap"
          >
            <GitPullRequest className="h-3.5 w-3.5 text-[#8259ef] shrink-0" />
            <span className="hidden sm:inline">Harness Upstream PR</span>
            <span className="sm:hidden">PR</span>
          </a>

          <a
            href="https://github.com/manovHacksaw/PolicyProbe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-[6px] border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-white transition hover:bg-white/[0.08] whitespace-nowrap"
          >
            <GitHubIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
