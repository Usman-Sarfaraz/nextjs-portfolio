"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { PortfolioClickSpark } from "@/components/ui/portfolio-click-spark";
import { ThemeProvider } from "next-themes";
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
        <SmoothScroll><PortfolioClickSpark>{children}</PortfolioClickSpark></SmoothScroll>
      </ReducedMotionProvider>
    </ThemeProvider>
  );
}
