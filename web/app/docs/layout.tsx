import React from "react";
import { DocSidebar } from "@/components/docs/DocSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col lg:flex-row">
      <DocSidebar />
      <div className="flex-1 px-4 py-10 sm:px-8 lg:px-12 max-w-4xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
