import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./landing/AnimatedWave";
import { PolicyProbeLogo } from "./PolicyProbeLogo";
import { DIAMOND_ADDRESS, HARNESS_PR_URL, REPO_URL, hashscanAddress } from "@/lib/data";

type FooterLink = { name: string; href: string; external?: boolean };

const footerLinks: Record<string, FooterLink[]> = {
  Verification: [
    { name: "Verification Ledger", href: "/proof" },
    { name: "Evidence Explorer", href: "/evidence" },
    { name: "Diamond on HashScan", href: hashscanAddress(DIAMOND_ADDRESS), external: true },
  ],
  Source: [
    { name: "Harness PR", href: HARNESS_PR_URL, external: true },
    { name: "PolicyProbe repo", href: REPO_URL, external: true },
    { name: "Hedera docs", href: "https://docs.hedera.com", external: true },
  ],
};

const linkClass =
  "text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group";

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10">
      <div className="absolute inset-x-0 top-0 h-40 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="py-10 lg:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-8">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <PolicyProbeLogo size={20} className="text-foreground" />
              <span className="text-2xl font-display">PolicyProbe</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Expected. Executed. Verified.
              <br />
              Deterministic onchain assertions for Hedera Harness.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-medium mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-5 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>PolicyProbe · Apache-2.0</p>
          <span>Hedera Testnet · receipts checked 2026-09-12</span>
        </div>
      </div>
    </footer>
  );
}
