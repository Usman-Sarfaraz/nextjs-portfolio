"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const HeroRevealContext = createContext({ textFinished: true, finishText: () => {} });

export function HeroRevealSequence({ children }: { children: ReactNode }) {
  const [textFinished, setTextFinished] = useState(false);
  return (
    <HeroRevealContext.Provider value={{ textFinished, finishText: () => setTextFinished(true) }}>
      {children}
    </HeroRevealContext.Provider>
  );
}

export function useHeroRevealSequence() { return useContext(HeroRevealContext); }
