"use client";

import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "@/lib/motion";
import ClickSpark from "@/components/react-bits/ClickSpark";

export function PortfolioClickSpark({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  return (
    <ClickSpark
      disabled={reducedMotion}
      sparkColor={resolvedTheme === "dark" ? "#6ee7b7" : "#065f46"}
      sparkSize={8}
      sparkRadius={22}
      sparkCount={8}
      duration={450}
    >
      {children}
    </ClickSpark>
  );
}
