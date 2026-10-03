"use client";

import { type ReactNode } from "react";
import LogoLoop from "@/components/react-bits/LogoLoop";

import { STACK, StackIcon } from "@/components/ui/stack-icons";

const logos = STACK.map((name) => ({
  title: name,
  node: (
    <span className="inline-flex items-center gap-3 whitespace-nowrap text-lg font-semibold tracking-tight text-current/80 sm:text-xl">
      <StackIcon name={name} />
      <span>{name}</span>
    </span>
  ),
}));

export function StackMarquee(): ReactNode {
  return (
    <div className="min-w-0 flex-1">
      <LogoLoop
        logos={logos}
        speed={65}
        direction="left"
        logoHeight={32}
        gap={48}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        className="hero-stack-logo-loop"
        ariaLabel="Technology stack"
      />
    </div>
  );
}
