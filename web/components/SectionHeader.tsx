import React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  inverted = false,
  className,
}: {
  children: React.ReactNode;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-sm font-mono",
        inverted ? "text-background/50" : "text-muted-foreground",
        className
      )}
    >
      <span className={cn("w-8 h-px", inverted ? "bg-background/30" : "bg-foreground/30")} />
      {children}
    </span>
  );
}

interface HeaderProps {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  muted?: React.ReactNode;
  description?: React.ReactNode;
  inverted?: boolean;
  className?: string;
}

export function SectionHeader({ eyebrow, title, muted, description, inverted, className }: HeaderProps) {
  return (
    <div className={cn("mb-16 lg:mb-20", className)}>
      <Eyebrow inverted={inverted} className="mb-6">
        {eyebrow}
      </Eyebrow>
      <h2 className="text-4xl lg:text-6xl font-display tracking-tight">
        {title}
        {muted && (
          <>
            <br />
            <span className={inverted ? "text-background/50" : "text-muted-foreground"}>{muted}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 text-lg max-w-2xl leading-relaxed",
            inverted ? "text-background/60" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, className }: Omit<HeaderProps, "muted" | "inverted">) {
  return (
    <header className={cn("pb-10 mb-12 border-b border-foreground/10", className)}>
      <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
      <h1 className="text-4xl lg:text-6xl font-display tracking-tight">{title}</h1>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
      )}
    </header>
  );
}
