"use client";

import type { ReactNode } from "react";
import ImageTrail from "@/components/react-bits/ImageTrail";
import { STACK, StackIcon } from "@/components/ui/stack-icons";
import { useReducedMotion } from "@/lib/motion";

const icons = STACK.map((name) => <StackIcon key={name} name={name} />);

export function TechnologyTrail({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return <ImageTrail items={icons} disabled={reducedMotion}>{children}</ImageTrail>;
}
