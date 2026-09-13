"use client";

import { usePathname } from "next/navigation";
import type * as PageTree from "fumadocs-core/page-tree";
import {
  SidebarItem as BaseSidebarItem,
  SidebarSeparator as BaseSidebarSeparator,
} from "fumadocs-ui/components/sidebar/base";
import { cn } from "@/lib/utils";

/*
 * Page-tree renderers for the docs sidebar. Fumadocs' defaults draw filled, rounded items;
 * these keep PolicyProbe's transparent rail: mono section labels and a hairline that darkens
 * beside the active page.
 */

export function SidebarSeparator({ item }: { item: PageTree.Separator }) {
  return (
    <BaseSidebarSeparator className="mt-7 mb-2 font-mono text-xs text-fd-muted-foreground first:mt-1">
      {item.name}
    </BaseSidebarSeparator>
  );
}

export function SidebarItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const active = !item.external && trimSlash(pathname) === trimSlash(item.url);

  return (
    <BaseSidebarItem
      href={item.url}
      external={item.external}
      active={active}
      className={cn(
        "relative flex items-center gap-2 py-1.5 ps-4 pe-2 text-sm transition-colors [&_svg]:size-3.5",
        // The rail also spans the 2px gap above each item so the list reads as one line.
        "before:absolute before:-top-0.5 before:bottom-0 before:start-0 before:w-px before:content-['']",
        active
          ? "text-fd-foreground before:bg-fd-foreground"
          : "text-fd-muted-foreground before:bg-fd-foreground/10 hover:text-fd-foreground"
      )}
    >
      {item.name}
    </BaseSidebarItem>
  );
}

function trimSlash(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}
