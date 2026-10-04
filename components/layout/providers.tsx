"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PortfolioClickSpark } from "@/components/ui/portfolio-click-spark";
import { ThemeProvider } from "next-themes";
import { SiteLoader } from "@/components/layout/site-loader";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReducedMotionProvider>
        <SiteLoader><SmoothScroll><PortfolioClickSpark>{children}</PortfolioClickSpark></SmoothScroll></SiteLoader>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
