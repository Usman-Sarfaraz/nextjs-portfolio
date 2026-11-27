"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export const BUG_IDS = ["hero", "projects-top", "projects-end", "services", "why-me", "about", "contact"] as const;
export type BugId = (typeof BUG_IDS)[number];

/** Shoots the frog's tongue at a target and resolves when the tongue reaches it. */
export type SnapHandler = (target: DOMRect) => Promise<void>;

type BugHuntValue = {
  caught: ReadonlySet<BugId>;
  total: number;
  /** Increments on every catch in this visit, so the frog can react to each one. */
  catches: number;
  catchBug: (id: BugId, element: HTMLElement) => void;
  reset: () => void;
  registerSnap: (handler: SnapHandler | null) => void;
};

// Progress lives in localStorage so it survives reloads. When storage is blocked
// (private mode), the in-memory copy keeps it for this visit only.
const STORAGE_KEY = "bug-hunt:v1";
const EMPTY = "[]";
const listeners = new Set<() => void>();
let memory = EMPTY;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function getServerSnapshot(): string {
  return EMPTY;
}

function parse(raw: string): Set<BugId> {
  try {
    const ids: unknown = JSON.parse(raw);
    return new Set(Array.isArray(ids) ? ids.filter((id): id is BugId => BUG_IDS.includes(id)) : []);
  } catch {
    return new Set();
  }
}

function save(ids: ReadonlySet<BugId>): void {
  memory = JSON.stringify([...ids]);
  try {
    window.localStorage.setItem(STORAGE_KEY, memory);
  } catch {
    // Blocked storage: the in-memory copy above still updates.
  }
  listeners.forEach((listener) => listener());
}

const BugHuntContext = createContext<BugHuntValue | null>(null);

export function BugHuntProvider({ children }: { children: ReactNode }): ReactNode {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const caught = useMemo(() => parse(raw), [raw]);
  const [catches, setCatches] = useState(0);
  const snapRef = useRef<SnapHandler | null>(null);
  const pending = useRef(new Set<BugId>());

  const catchBug = useCallback((id: BugId, element: HTMLElement) => {
    if (pending.current.has(id)) return;
    pending.current.add(id);
    const snap = snapRef.current;
    const reached = snap ? snap(element.getBoundingClientRect()) : Promise.resolve();
    void reached.then(() => {
      pending.current.delete(id);
      save(parse(getSnapshot()).add(id));
      setCatches((count) => count + 1);
    });
  }, []);

  const reset = useCallback(() => save(new Set()), []);

  const registerSnap = useCallback((handler: SnapHandler | null) => {
    snapRef.current = handler;
  }, []);

  const value = useMemo(
    () => ({ caught, total: BUG_IDS.length, catches, catchBug, reset, registerSnap }),
    [caught, catches, catchBug, reset, registerSnap]
  );

  return <BugHuntContext.Provider value={value}>{children}</BugHuntContext.Provider>;
}

export function useBugHunt(): BugHuntValue {
  const value = useContext(BugHuntContext);
  if (!value) throw new Error("useBugHunt must be used inside BugHuntProvider");
  return value;
}
