import React from "react";
import { DocSidebar } from "@/components/docs/DocSidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-24 flex flex-col lg:flex-row gap-12 lg:gap-20">
      <DocSidebar />
      <div className="flex-1 min-w-0 max-w-3xl">{children}</div>
    </div>
  );
}
