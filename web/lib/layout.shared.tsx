import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { PolicyProbeLogo } from "@/components/PolicyProbeLogo";
import { REPO_URL } from "@/lib/data";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <PolicyProbeLogo size={16} className="text-fd-foreground" />
          <span className="font-display text-xl tracking-tight">PolicyProbe</span>
          <span className="font-mono text-xs font-normal text-fd-muted-foreground">docs</span>
        </>
      ),
      url: "/",
    },
    githubUrl: REPO_URL,
  };
}
