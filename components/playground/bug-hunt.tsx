"use client";

import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { GameCard } from "./game-card";
import { useBestScore } from "./use-best-score";
import styles from "./playground.module.css";
import bug from "./bug-hunt.module.css";

const ROUND_MS = 30_000;
const POOL = 10;
const BUG_SIZE = 44;
const HIT_RADIUS = 40;
const TONGUE_MS = 240;
const COMBO_MS = 1100;
const MAX_COMBO = 4;

type Phase = "ready" | "playing" | "over";
type Kind = "bug" | "gold" | "wasp";
type Bug = { x: number; y: number; angle: number; turn: number; speed: number; alive: boolean; caught: boolean; kind: Kind; respawnAt: number };

const POINTS: Record<Kind, number> = { bug: 1, gold: 3, wasp: -3 };
const deadBug = (): Bug => ({ x: 0, y: 0, angle: 0, turn: 0, speed: 0, alive: false, caught: false, kind: "bug", respawnAt: 0 });

export function BugHunt(): ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const frogRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const tongueRef = useRef<HTMLDivElement>(null);
  const timeBarRef = useRef<HTMLDivElement>(null);
  const bugRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bugs = useRef<Bug[]>(Array.from({ length: POOL }, deadBug));
  const size = useRef({ width: 0, height: 0 });
  const remaining = useRef(ROUND_MS);
  const busy = useRef(false);
  const scoreRef = useRef(0);
  const combo = useRef({ count: 0, at: 0 });

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [seconds, setSeconds] = useState(ROUND_MS / 1000);
  const [record, setRecord] = useState(false);
  const [best, submitBest] = useBestScore("bug-hunt");
  const reduced = useReducedMotion();
  const inView = useInView(stageRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  // Track the stage size so bugs stay inside it on any screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => {
      size.current = { width: stage.clientWidth, height: stage.clientHeight };
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const mouth = () => {
    const { width, height } = size.current;
    return { x: width / 2, y: height - 48 };
  };

  const spawn = useCallback(
    (target: Bug, elapsed: number) => {
      const { width, height } = size.current;
      const floor = height - 130;
      const side = Math.floor(Math.random() * 3);
      target.x = side === 0 ? Math.random() * width : side === 1 ? -20 : width + 20;
      target.y = side === 0 ? -20 : 40 + Math.random() * Math.max(40, floor - 70);
      // Head roughly toward the middle of the playing area.
      target.angle = Math.atan2(floor / 2 - target.y, width / 2 - target.x) + (Math.random() - 0.5) * 0.9;
      target.turn = 0;
      // Wasps only join after the first few seconds; everything speeds up as the round goes on.
      const roll = Math.random();
      target.kind = elapsed > 5000 && roll < 0.16 ? "wasp" : roll > 0.88 ? "gold" : "bug";
      const pace = 1 + (elapsed / ROUND_MS) * 0.6;
      const base = target.kind === "gold" ? 2.7 : target.kind === "wasp" ? 1.9 : 1.3 + Math.random() * 0.8;
      target.speed = base * pace * (reduced ? 0.45 : 1);
      target.alive = true;
      target.caught = false;
    },
    [reduced]
  );

  const lookAt = (x: number, y: number) => {
    const m = mouth();
    const length = Math.hypot(x - m.x, y - m.y) || 1;
    if (pupilsRef.current) pupilsRef.current.style.transform = `translate(${((x - m.x) / length) * 2.6}px, ${((y - m.y) / length) * 2.6}px)`;
  };

  const pop = (x: number, y: number, text: string, bad = false) => {
    const stage = stageRef.current;
    if (!stage) return;
    const el = document.createElement("span");
    el.className = `${bug.pop ?? ""} ${bad ? bug.popBad ?? "" : ""}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    stage.appendChild(el);
    const animation = el.animate(
      [{ transform: "translate(-50%, -50%) scale(0.8)", opacity: 1 }, { transform: "translate(-50%, -160%) scale(1)", opacity: 0 }],
      { duration: reduced ? 450 : 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    animation.onfinish = () => el.remove();
  };

  /** Score a catch: combos multiply good bugs; a wasp costs points and breaks the combo. */
  const score_ = (target: Bug, x: number, y: number) => {
    const now = performance.now();
    if (target.kind === "wasp") {
      combo.current = { count: 0, at: now };
      setStreak(0);
      scoreRef.current = Math.max(0, scoreRef.current + POINTS.wasp);
      setScore(scoreRef.current);
      pop(x, y, `${POINTS.wasp}`, true);
      if (!reduced) frogRef.current?.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
      return;
    }
    const chained = now - combo.current.at < COMBO_MS;
    const count = chained ? Math.min(MAX_COMBO, combo.current.count + 1) : 1;
    combo.current = { count, at: now };
    setStreak(count);
    const points = POINTS[target.kind] * count;
    scoreRef.current += points;
    setScore(scoreRef.current);
    pop(x, y, count > 1 ? `+${points} ×${count}` : `+${points}`);
  };

  /** Shoot the tongue at a point; if a bug is there, catch it at the tongue's furthest reach. */
  const snapAt = useCallback(
    (x: number, y: number, target: Bug | null) => {
      if (busy.current) return;
      const tongue = tongueRef.current;
      const m = mouth();
      lookAt(x, y);
      const catchIt = () => {
        if (!target) return;
        const index = bugs.current.indexOf(target);
        target.alive = false;
        target.respawnAt = performance.now() + 300 + Math.random() * 500;
        const el = bugRefs.current[index];
        if (el) el.style.visibility = "hidden";
        score_(target, x, y);
      };
      if (target) target.caught = true;
      if (reduced || !tongue) {
        catchIt();
        return;
      }
      busy.current = true;
      const angle = Math.atan2(y - m.y, x - m.x);
      tongue.style.left = `${m.x}px`;
      tongue.style.top = `${m.y}px`;
      tongue.style.width = `${Math.hypot(x - m.x, y - m.y)}px`;
      const rotate = `rotate(${angle}rad)`;
      const animation = tongue.animate(
        [
          { transform: `${rotate} scaleX(0)`, visibility: "visible" },
          { transform: `${rotate} scaleX(1)`, visibility: "visible", offset: 0.45 },
          { transform: `${rotate} scaleX(0)`, visibility: "visible" },
        ],
        { duration: TONGUE_MS, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" }
      );
      window.setTimeout(catchIt, TONGUE_MS * 0.45);
      // Free the tongue on a timer too, so a delayed animation event can never lock it.
      window.setTimeout(() => {
        busy.current = false;
      }, TONGUE_MS + 20);
      animation.onfinish = () => {
        frogRef.current?.animate([{ transform: "scale(1.08, 0.9)" }, { transform: "scale(1)" }], { duration: 260, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
      };
    },
    // pop, lookAt and score_ only read refs and setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced]
  );

  const nearestBug = (x: number, y: number, radius: number, skipWasps = false) => {
    let found: Bug | null = null;
    let distance = radius;
    for (const item of bugs.current) {
      if (!item.alive || item.caught || (skipWasps && item.kind === "wasp")) continue;
      const d = Math.hypot(item.x - x, item.y - y);
      if (d < distance) {
        distance = d;
        found = item;
      }
    }
    return found;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (phase !== "playing") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    const target = nearestBug(x, y, event.pointerType === "touch" ? HIT_RADIUS + 10 : HIT_RADIUS);
    snapAt(target ? target.x : x, target ? target.y : y, target);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (phase !== "playing" || (event.key !== " " && event.key !== "Enter")) return;
    event.preventDefault();
    const m = mouth();
    const target = nearestBug(m.x, m.y, Infinity, true);
    if (target) snapAt(target.x, target.y, target);
  };

  const start = () => {
    bugs.current.forEach((item, index) => {
      item.alive = false;
      item.caught = false;
      item.respawnAt = performance.now() + index * 200;
      const el = bugRefs.current[index];
      if (el) el.style.visibility = "hidden";
    });
    remaining.current = ROUND_MS;
    scoreRef.current = 0;
    combo.current = { count: 0, at: 0 };
    busy.current = false;
    setScore(0);
    setStreak(0);
    setSeconds(ROUND_MS / 1000);
    setRecord(false);
    setPhase("playing");
    stageRef.current?.focus({ preventScroll: true });
  };

  // The game loop: runs only during a round, and pauses the clock while the stage is off screen.
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    let last = performance.now();
    let shown = ROUND_MS / 1000;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = Math.min(now - last, 50);
      last = now;
      if (!inViewRef.current || document.hidden) return;

      remaining.current -= delta;
      const elapsed = ROUND_MS - remaining.current;
      const left = Math.max(0, Math.ceil(remaining.current / 1000));
      if (left !== shown) {
        shown = left;
        setSeconds(left);
      }
      const bar = timeBarRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${Math.max(0, remaining.current / ROUND_MS)})`;
        bar.dataset.urgent = String(remaining.current < 5000);
      }
      // A combo lapses if no catch follows in time.
      if (combo.current.count > 1 && now - combo.current.at > COMBO_MS) {
        combo.current.count = 0;
        setStreak(0);
      }
      if (remaining.current <= 0) {
        cancelAnimationFrame(raf);
        bugs.current.forEach((item, index) => {
          item.alive = false;
          const el = bugRefs.current[index];
          if (el) el.style.visibility = "hidden";
        });
        setRecord(submitBest(scoreRef.current));
        setPhase("over");
        return;
      }

      const step = delta / (1000 / 60);
      const { width, height } = size.current;
      const floor = height - 120;
      // More bugs join as the round goes on.
      const cap = 5 + Math.floor((elapsed / ROUND_MS) * (POOL - 5));
      let alive = bugs.current.filter((item) => item.alive).length;
      bugs.current.forEach((item, index) => {
        const el = bugRefs.current[index];
        if (!item.alive) {
          if (now >= item.respawnAt && alive < cap) {
            spawn(item, elapsed);
            alive += 1;
            if (el) {
              el.dataset.kind = item.kind;
              el.style.visibility = "visible";
            }
          }
          return;
        }
        if (!item.caught) {
          // A wandering walk: the heading drifts a little each frame.
          item.turn = Math.max(-0.05, Math.min(0.05, item.turn + (Math.random() - 0.5) * 0.02));
          item.angle += item.turn * step;
          item.x += Math.cos(item.angle) * item.speed * step;
          item.y += Math.sin(item.angle) * item.speed * step;
          const pad = 22;
          if (item.x < pad && Math.cos(item.angle) < 0) item.angle = Math.PI - item.angle;
          if (item.x > width - pad && Math.cos(item.angle) > 0) item.angle = Math.PI - item.angle;
          if (item.y < pad + 10 && Math.sin(item.angle) < 0) item.angle = -item.angle;
          if (item.y > floor && Math.sin(item.angle) > 0) item.angle = -item.angle;
        }
        if (el) el.style.transform = `translate3d(${item.x - BUG_SIZE / 2}px, ${item.y - BUG_SIZE / 2}px, 0) rotate(${item.angle + Math.PI / 2}rad)`;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, spawn, submitBest]);

  return (
    <GameCard
      id="bug-hunt"
      index={1}
      title="Bug hunt"
      howTo="Thirty seconds and a hungry frog. Click or tap bugs to feed it, chain quick catches for combos, grab gold bugs for 3, and leave the red wasps alone."
      stats={[
        { label: "Score", value: score },
        { label: "Time", value: `${seconds}s` },
        { label: "Best", value: best ?? "–" },
      ]}
      actions={
        <>
          <p className={styles.hint}>Keyboard: focus the stage and press Space to snap the nearest bug.</p>
          {phase === "playing" && (
            <div className={styles.buttons}>
              <button type="button" className={styles.button} onClick={start}>
                Restart
              </button>
            </div>
          )}
        </>
      }
    >
      <div
        ref={stageRef}
        className={bug.stage}
        tabIndex={0}
        role="group"
        aria-label="Bug hunt stage. Press Space to snap the nearest bug."
        data-playing={phase === "playing"}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <div className={bug.timeTrack} aria-hidden="true">
          <div ref={timeBarRef} className={bug.timeBar} />
        </div>
        {phase === "playing" && streak > 1 && (
          <span key={streak} className={bug.combo} aria-hidden="true">
            ×{streak} combo
          </span>
        )}
        {Array.from({ length: POOL }, (_, index) => (
          <div key={index} ref={(el) => { bugRefs.current[index] = el; }} className={bug.bug} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
                <path d="M9 5.5 7 3M15 5.5 17 3" />
                <path d="M6.5 11H3M6.5 15l-3 2M17.5 11H21M17.5 15l3 2" />
              </g>
              <ellipse cx="12" cy="14" rx="5.5" ry="7" fill="currentColor" />
              <circle cx="12" cy="7" r="3" fill="currentColor" />
              <path className={bug.stripes} d="M7 12.5h10M6.6 15.5h10.8M7.4 18.5h9.2" stroke="#fff" strokeWidth="1.3" />
            </svg>
          </div>
        ))}
        <div ref={tongueRef} className={bug.tongue} aria-hidden="true" />
        <div ref={frogRef} className={bug.frog} aria-hidden="true">
          <svg viewBox="0 0 64 56">
            <ellipse cx="32" cy="38" rx="26" ry="17" fill="var(--pg-frog)" />
            <circle cx="18" cy="20" r="10" fill="var(--pg-frog)" />
            <circle cx="46" cy="20" r="10" fill="var(--pg-frog)" />
            <circle cx="18" cy="19" r="6.5" fill="#fff" />
            <circle cx="46" cy="19" r="6.5" fill="#fff" />
            <g ref={pupilsRef} className={bug.pupils}>
              <circle cx="18" cy="19" r="3.2" fill="#062e24" />
              <circle cx="46" cy="19" r="3.2" fill="#062e24" />
            </g>
            <ellipse cx="32" cy="45" rx="15" ry="7.5" fill="var(--pg-frog-belly)" />
            <path d="M22 33q10 6 20 0" stroke="#062e24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {phase !== "playing" && (
          <div className={styles.overlay}>
            {phase === "ready" ? (
              <>
                <p className={styles.overlayTitle}>Feed the frog.</p>
                <ul className={bug.legend}>
                  <li><span data-kind="bug" />Bug, 1 point</li>
                  <li><span data-kind="gold" />Gold bug, 3 points</li>
                  <li><span data-kind="wasp" />Wasp, minus 3</li>
                </ul>
                <p className={styles.overlayText}>Catch bugs within a second of each other to build a combo, up to ×4.</p>
              </>
            ) : (
              <>
                <p className={styles.overlayTitle}>{record ? "New best!" : "Time's up."}</p>
                <p className={styles.overlayText}>
                  You scored <strong>{score}</strong> {score === 1 ? "point" : "points"}.{best !== null && !record ? ` Your best is ${best}.` : ""}
                </p>
              </>
            )}
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={start}>
              {phase === "ready" ? "Start hunting" : "Play again"}
            </button>
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {phase === "over" ? `Time's up. You scored ${score} points.` : ""}
        </p>
      </div>
    </GameCard>
  );
}
