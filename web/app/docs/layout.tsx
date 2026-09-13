import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { SidebarItem, SidebarSeparator } from "@/components/docs/SidebarTree";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // data-pp-docs scopes the dark palette in globals.css: the marketing site stays light-only.
    <div data-pp-docs className="noise-overlay">
      <RootProvider theme={{ storageKey: "policyprobe-docs-theme", enableColorScheme: false }}>
        <DocsLayout
          tree={source.getPageTree()}
          sidebar={{ components: { Item: SidebarItem, Separator: SidebarSeparator } }}
          {...baseOptions()}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </div>
  );
}
