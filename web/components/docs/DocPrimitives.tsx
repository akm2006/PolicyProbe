import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="text-[15px] leading-relaxed text-foreground/80 [&_p]:my-4 [&_strong]:font-medium [&_strong]:text-foreground [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em] [&_:not(pre)>code]:bg-foreground/5 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5">
      {children}
    </article>
  );
}

export function DocH2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-display tracking-tight text-foreground mt-16 mb-4">{children}</h2>;
}

export function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "my-6 border border-foreground/10 bg-foreground/[0.02] p-5 font-mono text-xs leading-relaxed text-foreground/80 overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "pass" | "fail";
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "my-6 border-l-2 pl-5 py-1",
        tone === "pass" ? "border-pass" : tone === "fail" ? "border-fail" : "border-foreground"
      )}
    >
      <p
        className={cn(
          "!my-0 font-mono text-sm",
          tone === "pass" ? "text-pass" : tone === "fail" ? "text-fail" : "text-foreground"
        )}
      >
        {title}
      </p>
      {children && <div className="mt-2 text-muted-foreground">{children}</div>}
    </div>
  );
}

export function DocTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 border border-foreground/10 overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm [&_th]:p-3 [&_th]:font-mono [&_th]:text-xs [&_th]:font-normal [&_th]:text-muted-foreground [&_th]:border-b [&_th]:border-foreground/10 [&_td]:p-3 [&_td]:align-top [&_tbody_tr]:border-b [&_tbody_tr]:border-foreground/10 [&_tbody_tr:last-child]:border-0">
        {children}
      </table>
    </div>
  );
}

type NavLink = { href: string; label: string };

export function DocNav({ prev, next }: { prev?: NavLink; next?: NavLink }) {
  return (
    <nav className="mt-20 pt-8 border-t border-foreground/10 grid grid-cols-2 gap-6">
      <div>
        {prev && (
          <Link href={prev.href} className="group inline-flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous
            </span>
            <span className="font-display text-xl text-foreground group-hover:-translate-x-1 transition-transform">
              {prev.label}
            </span>
          </Link>
        )}
      </div>
      <div className="text-right">
        {next && (
          <Link href={next.href} className="group inline-flex flex-col items-end gap-1">
            <span className="font-mono text-xs text-muted-foreground inline-flex items-center gap-1">
              Next <ArrowRight className="w-3 h-3" />
            </span>
            <span className="font-display text-xl text-foreground group-hover:translate-x-1 transition-transform">
              {next.label}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
