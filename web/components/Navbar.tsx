"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PolicyProbeLogo } from "./PolicyProbeLogo";
import { HARNESS_PR_URL, REPO_URL } from "@/lib/data";
import { buttonOutline, buttonPrimary, cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Sandbox", href: "/#console" },
  { label: "Suite", href: "/#matrix" },
  { label: "Docs", href: "/docs" },
  { label: "Verification", href: "/proof" },
  { label: "Evidence", href: "/evidence" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500",
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      )}
    >
      <nav
        className={cn(
          "relative z-50 mx-auto transition-all duration-500",
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500 px-6 lg:px-8",
            isScrolled ? "h-14" : "h-20"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
            <PolicyProbeLogo size={isScrolled ? 16 : 20} interactive className="text-foreground" />
            <span
              className={cn(
                "font-display tracking-tight transition-all duration-500",
                isScrolled ? "text-xl" : "text-2xl"
              )}
            >
              PolicyProbe
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors duration-300 relative group",
                  isActive(item.href) ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300",
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-foreground/70 hover:text-foreground transition-all duration-500",
                isScrolled ? "text-xs" : "text-sm"
              )}
            >
              GitHub
            </a>
            <a
              href={HARNESS_PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonPrimary, "transition-all duration-500", isScrolled ? "h-8 px-4 text-xs" : "h-9 px-6 text-sm")}
            >
              Harness PR
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-background z-40 transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-6">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500",
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div
            className={cn(
              "flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500",
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonOutline, "flex-1 h-14 text-base")}
            >
              GitHub
            </a>
            <a
              href={HARNESS_PR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonPrimary, "flex-1 h-14 text-base")}
            >
              Harness PR
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
