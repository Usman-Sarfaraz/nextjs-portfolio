"use client";

import { useCallback, useSyncExternalStore } from "react";

// Best scores live in localStorage; when storage is blocked they last for the visit only.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const HIGHER_WINS = (next: number, best: number): boolean => next > best;

/**
 * The best score for a game. `better` decides whether a new score beats the stored one
 * (higher is better by default; pass `(a, b) => a < b` for "fewest shots").
 */
export function useBestScore(
  key: string,
  better: (next: number, best: number) => boolean = HIGHER_WINS
): [number | null, (score: number) => boolean] {
  const storageKey = `playground:${key}`;
  const raw = useSyncExternalStore(
    subscribe,
    () => read(storageKey),
    () => null
  );
  const best = raw === null ? null : Number(raw);

  const submit = useCallback(
    (score: number) => {
      const current = read(storageKey);
      if (current !== null && !better(score, Number(current))) return false;
      const value = String(score);
      memory.set(storageKey, value);
      try {
        window.localStorage.setItem(storageKey, value);
      } catch {
        // Blocked storage: the in-memory copy still updates.
      }
      listeners.forEach((listener) => listener());
      return true;
    },
    [storageKey, better]
  );

  return [best, submit];
}
