"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Rocket, Layers, Code, BarChart, FileText, GitPullRequest, Search } from "lucide-react";

interface DocGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const DocSidebar: React.FC = () => {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const docGroups: DocGroup[] = [
    {
      title: "Getting Started",
      items: [
        { label: "Overview & Problem", href: "/docs", icon: BookOpen },
        { label: "Quickstart Setup", href: "/docs/quickstart", icon: Rocket },
      ],
    },
    {
      title: "Engine Architecture",
      items: [
        { label: "Harness 4-Stage Pipeline", href: "/docs/architecture", icon: Layers },
        { label: "Recipe Schema (YAML)", href: "/docs/recipe-spec", icon: Code },
      ],
    },
    {
      title: "Verification & Metrics",
      items: [
        { label: "Quantitative Benchmark", href: "/docs/benchmark", icon: BarChart, badge: "1.3:1 Ratio" },
        { label: "Verification Ledger", href: "/proof", icon: FileText },
        { label: "Mirror Node Evidence", href: "/evidence", icon: Layers },
      ],
    },
    {
      title: "Governance & Ecosystem",
      items: [
        { label: "ADR Log (10 Decisions)", href: "/docs/decisions", icon: FileText },
        { label: "Upstream PR Landscape", href: "/docs/related-work", icon: GitPullRequest, badge: "22 PRs" },
      ],
    },
  ];

  const filteredGroups = docGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#050608]/70 backdrop-blur-md p-4 lg:p-6 font-mono">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6e7592]" />
        <input
          type="text"
          placeholder="Filter docs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[6px] border border-white/[0.08] bg-white/[0.03] py-1.5 pl-8 pr-3 text-xs text-white placeholder-[#6e7592] focus:border-[#8259ef] focus:outline-none transition"
        />
      </div>

      {/* Nav groups */}
      <div className="space-y-6">
        {filteredGroups.map((g, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7592] mb-2 px-2">
              {g.title}
            </div>
            <ul className="space-y-1">
              {g.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between rounded-[6px] px-2.5 py-1.5 text-xs transition ${
                        isActive
                          ? "bg-[#8259ef]/15 font-semibold text-white border border-[#8259ef]/30"
                          : "text-[#9aa1be] hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#8259ef]" : "text-[#6e7592]"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded bg-white/[0.06] border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-[#c4c9dd]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};
