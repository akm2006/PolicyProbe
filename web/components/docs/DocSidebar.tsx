"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocGroup {
  title: string;
  items: { label: string; href: string; badge?: string }[];
}

const docGroups: DocGroup[] = [
  {
    title: "Getting started",
    items: [
      { label: "Overview", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Engine",
    items: [
      { label: "Architecture", href: "/docs/architecture" },
      { label: "Recipe schema", href: "/docs/recipe-spec" },
    ],
  },
  {
    title: "Verification",
    items: [
      { label: "Benchmark", href: "/docs/benchmark", badge: "1.3:1" },
      { label: "Verification ledger", href: "/proof" },
      { label: "Mirror Node evidence", href: "/evidence" },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Decision records", href: "/docs/decisions", badge: "10" },
      { label: "Related work", href: "/docs/related-work", badge: "22 PRs" },
    ],
  },
];

export function DocSidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const filteredGroups = docGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-28 lg:self-start">
      <div className="relative mb-8">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter docs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-b border-foreground/10 py-2 pl-6 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-8">
        {filteredGroups.map((g) => (
          <div key={g.title}>
            <div className="font-mono text-xs text-muted-foreground mb-3">{g.title}</div>
            <ul className="space-y-1 border-l border-foreground/10">
              {g.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "-ml-px flex items-center justify-between gap-2 border-l pl-4 py-1.5 text-sm transition-colors",
                        isActive
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                      {item.badge && <span className="font-mono text-[10px] text-muted-foreground">{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {filteredGroups.length === 0 && <p className="text-sm text-muted-foreground">No matching pages.</p>}
      </div>
    </aside>
  );
}
