"use client";

import type MatterType from "matter-js";
import { ArrowUpRight, MoveLeft, RotateCcw } from "lucide-react";
import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import type { Body } from "matter-js";
import { GRAVITY_PER_STEP, LAUNCH_POWER, aimVelocity, buildWorld, targetCount, type PieceKind, type World } from "./shippy-world";
import styles from "./shippy.module.css";

type Phase = "aim" | "drag" | "fly";
type Layout = Pick<World, "anchor" | "tables" | "scale" | "shippySize"> & { blocks: { label: string; kind: PieceKind; width: number; height: number }[] };

export type ShippyProgress = { left: number; total: number; shots: number };

type ShippyGameProps = {
  /** Index into LEVELS; the footer plays level 0. */
  level?: number;
  /** "footer" sits on the dark footer band; "card" fills a playground card. */
  variant?: "footer" | "card";
  /** Side padding for the scene; defaults to the page gutter (footer). */
  gutter?: number | undefined;
  /** Play the one-time pull-back demo on first view. */
  demo?: boolean;
  showReset?: boolean;
  showWon?: boolean;
  onProgress?: (progress: ShippyProgress) => void;
  /** A link shown below the game's floor, faded in once the scene is in view (the footer points to the playground). */
  cornerLink?: { href: string; label: string; lead?: string } | undefined;
  footerStart?: ReactNode;
  footerEnd?: ReactNode;
};


const DOTS = 8;
/** Relative speed (px per step at scale 1) at which a hit squashes a bug. */
const SQUASH = 6;
const TRAIL = 12;
const STEP_MS = 1000 / 60;
/** The one-time pull-back demo: a short pause, then about two seconds of pulling back and settling. */
const DEMO_DELAY = 45;
const DEMO_FRAMES = 120;

export function ShippyGame({ level = 0, variant = "footer", gutter, demo = true, showReset = true, showWon = true, onProgress, cornerLink, footerStart, footerEnd }: ShippyGameProps = {}): ReactNode {
  const total = targetCount(level);
  const stageRef = useRef<HTMLDivElement>(null);
  const shippyRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bandRefs = useRef<(SVGLineElement | null)[]>([]);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const worldRef = useRef<World | null>(null);
  /** Targets already cleared (knocked off or squashed), so the aim skips them. */
  const clearedRef = useRef(new Set<Body>());
  const matterRef = useRef<typeof MatterType | null>(null);
  const phaseRef = useRef<Phase>("aim");
  const [phase, setPhase] = useState<Phase>("aim");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [left, setLeft] = useState<number>(total);
  const [shots, setShots] = useState(0);
  const [round, setRound] = useState(0);
  // Build the scene the first time it is seen; pause the physics whenever it scrolls away.
  const seen = useInView(stageRef, { once: true, amount: 0.15 });
  const inView = useInView(stageRef, { amount: 0.05 });
  const inViewRef = useRef(inView);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const demoDoneRef = useRef(!demo);
  /** How many aimed shots each block has taken, so the aim can move on from a stubborn one. */
  const aimed = useRef(new WeakMap<object, number>());
  useEffect(() => {
    inViewRef.current = inView;
    reducedRef.current = reduced;
  }, [inView, reduced]);

  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const showDots = useCallback((velocity: { x: number; y: number } | null) => {
    const world = worldRef.current;
    dotRefs.current.forEach((dot, index) => {
      if (!dot) return;
      if (!velocity || !world) {
        dot.style.visibility = "hidden";
        return;
      }
      const n = (index + 1) * 5;
      const { x, y } = world.shippy.position;
      dot.style.visibility = "visible";
      dot.style.transform = `translate3d(${x + velocity.x * n}px, ${y + velocity.y * n + 0.5 * GRAVITY_PER_STEP * n * n}px, 0)`;
    });
  }, []);

  const launch = useCallback(
    (velocity: { x: number; y: number }) => {
      const world = worldRef.current;
      const M = matterRef.current;
      if (!world || !M) return;
      M.Body.setStatic(world.shippy, false);
      M.Body.setVelocity(world.shippy, velocity);
      M.Body.setAngularVelocity(world.shippy, 0.06);
      showDots(null);
      setShots((count) => count + 1);
      changePhase("fly");
    },
    [changePhase, showDots]
  );

  useEffect(() => {
    if (!seen) return;
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    let raf = 0;
    let observer: ResizeObserver | undefined;

    void import("matter-js").then((M) => {
      if (cancelled) return;
      matterRef.current = M;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const world = buildWorld(M, width, height, { level, gutter });
      worldRef.current = world;
      phaseRef.current = "aim";
      setPhase("aim");
      setLeft(world.targets.length);
      clearedRef.current = new Set();
      setShots(0);
      setLayout({
        anchor: world.anchor,
        tables: world.tables,
        scale: world.scale,
        shippySize: world.shippySize,
        blocks: world.blocks.map(({ label, kind, width: w, height: h }) => ({ label, kind, width: w, height: h })),
      });

      // A "+1" floats up wherever a block leaves its table.
      const popAt = (x: number, y: number) => {
        const el = document.createElement("span");
        el.className = styles.pop ?? "";
        el.textContent = "+1";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        stage.appendChild(el);
        const animation = el.animate(
          [{ transform: "translate(-50%, -50%) scale(0.7)", opacity: 1 }, { transform: "translate(-50%, -190%) scale(1)", opacity: 0 }],
          { duration: reducedRef.current ? 400 : 800, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        );
        animation.onfinish = () => el.remove();
      };
      const cleared = clearedRef.current;
      // A bug hit hard enough (by Shippy, a falling plank, a toppling pillar) is squashed on the spot.
      const bugs = new Set(world.targets.filter((block) => block.kind === "bug").map((block) => block.body));
      const squashed = new Set<Body>();
      M.Events.on(world.engine, "collisionStart", (event) => {
        event.pairs.forEach(({ bodyA, bodyB }) => {
          for (const [bug, other] of [[bodyA, bodyB], [bodyB, bodyA]] as const) {
            if (!bugs.has(bug) || squashed.has(bug)) continue;
            const impact = Math.hypot(bug.velocity.x - other.velocity.x, bug.velocity.y - other.velocity.y);
            if (impact > SQUASH * world.scale) squashed.add(bug);
          }
        });
      });
      const trail: { x: number; y: number }[] = [];

      let flight = 0;
      let resting = 0;
      let remaining = world.targets.length;
      let demoFrame = 0;

      const tick = (): void => {
        raf = requestAnimationFrame(tick);
        if (!inViewRef.current) return;
        M.Engine.update(world.engine, STEP_MS);

        world.blocks.forEach((block, index) => {
          const el = blockRefs.current[index];
          const { x, y } = block.body.position;
          if (el) el.style.transform = `translate3d(${x - block.width / 2}px, ${y - block.height / 2}px, 0) rotate(${block.body.angle}rad)`;
        });
        const { shippy, anchor, shippySize } = world;
        const half = shippySize / 2;
        if (shippyRef.current) {
          shippyRef.current.style.transform = `translate3d(${shippy.position.x - half}px, ${shippy.position.y - half}px, 0) rotate(${shippy.angle}rad)`;
        }
        // First view only: Shippy acts out one pull-back so visitors see it can be dragged.
        let demoing = false;
        if (!demoDoneRef.current && phaseRef.current === "aim") {
          if (reducedRef.current) {
            demoDoneRef.current = true;
          } else {
            demoFrame += 1;
            const t = (demoFrame - DEMO_DELAY) / DEMO_FRAMES;
            if (t >= 1) {
              demoDoneRef.current = true;
              M.Body.setPosition(shippy, anchor);
              showDots(null);
            } else if (t > 0) {
              demoing = true;
              const pull = Math.sin(Math.PI * t) ** 2;
              const dx = -0.8 * world.maxPull * pull;
              const dy = 0.42 * world.maxPull * pull;
              M.Body.setPosition(shippy, { x: anchor.x + dx, y: anchor.y + dy });
              showDots(pull > 0.2 ? { x: -dx * LAUNCH_POWER, y: -dy * LAUNCH_POWER } : null);
            }
          }
        }

        // The bands only stretch while Shippy is pulled back; at rest they would cross its face.
        const aiming = phaseRef.current === "drag" || demoing;
        bandRefs.current.forEach((band) => {
          if (!band) return;
          band.style.visibility = aiming ? "visible" : "hidden";
          band.setAttribute("x2", String(shippy.position.x));
          band.setAttribute("y2", String(shippy.position.y));
        });

        world.targets.forEach((block) => {
          const { body } = block;
          if (cleared.has(body)) return;
          const off = body.position.y > world.tableTop + 4 || body.position.x > width + 40;
          if (!off && !squashed.has(body)) return;
          cleared.add(body);
          if (squashed.has(body)) {
            M.Composite.remove(world.engine.world, body);
            const el = blockRefs.current[world.blocks.indexOf(block)];
            if (el) el.style.visibility = "hidden";
          }
          if (body.position.x < width) popAt(body.position.x, Math.min(body.position.y, world.tableTop) - 24 * world.scale);
        });

        // A fading trail behind Shippy while it flies.
        if (phaseRef.current === "fly" && !reducedRef.current) {
          if (flight % 2 === 0) {
            trail.push({ x: shippy.position.x, y: shippy.position.y });
            if (trail.length > TRAIL) trail.shift();
          }
        } else if (trail.length) {
          trail.length = 0;
        }
        trailRefs.current.forEach((dot, index) => {
          if (!dot) return;
          const point = trail[index];
          if (!point) {
            dot.style.visibility = "hidden";
            return;
          }
          dot.style.visibility = "visible";
          dot.style.opacity = String(((index + 1) / trail.length) * 0.45);
          dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
        });
        if (world.targets.length - cleared.size !== remaining) {
          remaining = world.targets.length - cleared.size;
          setLeft(remaining);
        }

        if (phaseRef.current === "fly") {
          flight += 1;
          resting = shippy.speed < 0.3 && flight > 40 ? resting + 1 : 0;
          const gone = shippy.position.x > width + 80 || shippy.position.y > height + 80;
          if (resting > 30 || gone || flight > 360) {
            M.Body.setStatic(shippy, true);
            M.Body.setAngle(shippy, 0);
            M.Body.setPosition(shippy, anchor);
            flight = 0;
            resting = 0;
            phaseRef.current = "aim";
            setPhase("aim");
          }
        }
      };
      tick();

      // A big width change rebuilds the scene so it fits the new stage.
      observer = new ResizeObserver(() => {
        if (Math.abs(stage.clientWidth - width) > 40) setRound((value) => value + 1);
      });
      observer.observe(stage);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      const world = worldRef.current;
      if (world && matterRef.current) matterRef.current.Engine.clear(world.engine);
      worldRef.current = null;
    };
  }, [seen, round, showDots, level, gutter]);

  const localPoint = (event: PointerEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    return { x: event.clientX - (box?.left ?? 0), y: event.clientY - (box?.top ?? 0) };
  };

  // Any real interaction ends the pull-back demo and returns Shippy to the sling.
  const stopDemo = () => {
    const world = worldRef.current;
    if (demoDoneRef.current || !world || !matterRef.current) return;
    demoDoneRef.current = true;
    matterRef.current.Body.setPosition(world.shippy, world.anchor);
    showDots(null);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== "aim") return;
    stopDemo();
    event.currentTarget.setPointerCapture(event.pointerId);
    changePhase("drag");
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const world = worldRef.current;
    const M = matterRef.current;
    if (phaseRef.current !== "drag" || !world || !M) return;
    const point = localPoint(event);
    const dx = point.x - world.anchor.x;
    const dy = point.y - world.anchor.y;
    const pull = Math.min(world.maxPull, Math.hypot(dx, dy)) / (Math.hypot(dx, dy) || 1);
    M.Body.setPosition(world.shippy, { x: world.anchor.x + dx * pull, y: world.anchor.y + dy * pull });
    showDots({ x: -dx * pull * LAUNCH_POWER, y: -dy * pull * LAUNCH_POWER });
  };

  const onPointerUp = () => {
    const world = worldRef.current;
    const M = matterRef.current;
    if (phaseRef.current !== "drag" || !world || !M) return;
    const dx = world.shippy.position.x - world.anchor.x;
    const dy = world.shippy.position.y - world.anchor.y;
    if (Math.hypot(dx, dy) < 14) {
      M.Body.setPosition(world.shippy, world.anchor);
      showDots(null);
      changePhase("aim");
      return;
    }
    launch({ x: -dx * LAUNCH_POWER, y: -dy * LAUNCH_POWER });
  };

  // Keyboard users press Enter on Shippy for a shot aimed at the lowest problem still on the table.
  const launchAimed = () => {
    const world = worldRef.current;
    if (!world || phaseRef.current !== "aim") return;
    stopDemo();
    // Work front to back: aim at the lowest block of the nearest tower, so shots never have to pass through one.
    const onTable = world.targets.filter(({ body }) => !clearedRef.current.has(body) && body.position.y <= world.tableTop + 4);
    const nearest = Math.min(...onTable.map(({ body }) => body.position.x));
    const front = onTable.filter(({ body }) => body.position.x < nearest + 90 * world.scale);
    let target = front.reduce<(typeof front)[number] | undefined>((low, block) => (!low || block.body.position.y > low.body.position.y ? block : low), undefined);
    // A block wedged on a table edge can shrug off shots; after two tries, go for the top of the pile instead.
    if (target && (aimed.current.get(target.body) ?? 0) >= 2) {
      target = onTable.reduce<(typeof onTable)[number] | undefined>((high, block) => (!high || block.body.position.y < high.body.position.y ? block : high), undefined);
    }
    if (target) aimed.current.set(target.body, (aimed.current.get(target.body) ?? 0) + 1);
    // Aim a little above the centre so the shot clears the table edge.
    const goal = target
      ? { x: target.body.position.x, y: target.body.position.y - target.height * 0.25 }
      : { x: world.tables[0]?.x ?? world.anchor.x, y: world.tableTop - 40 * world.scale };
    launch(aimVelocity(world.anchor, goal, world.scale));
  };

  useEffect(() => {
    onProgress?.({ left, total, shots });
  }, [left, total, shots, onProgress]);

  const won = left === 0;
  const fork = layout ? 14 * layout.scale : 0;

  return (
    <div className={`${styles.game} ${variant === "card" ? styles.card : ""}`}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.floor} aria-hidden="true" />
        {layout && (
          <>
            {layout.tables.map((table) => (
              <div
                key={table.x}
                className={styles.table}
                aria-hidden="true"
                style={{ left: table.x - table.width / 2, top: table.y - table.height / 2, width: table.width, height: table.height }}
              />
            ))}
            <svg className={styles.sling} aria-hidden="true">
              <line ref={(el) => { bandRefs.current[0] = el; }} className={styles.band} x1={layout.anchor.x - fork} y1={layout.anchor.y - 4} x2={layout.anchor.x} y2={layout.anchor.y} />
              <path className={styles.post} d={`M${layout.anchor.x} ${layout.anchor.y + 150 * layout.scale}V${layout.anchor.y + 22 * layout.scale}M${layout.anchor.x} ${layout.anchor.y + 22 * layout.scale}L${layout.anchor.x - fork} ${layout.anchor.y - 4}M${layout.anchor.x} ${layout.anchor.y + 22 * layout.scale}L${layout.anchor.x + fork} ${layout.anchor.y - 4}`} />
            </svg>
            {Array.from({ length: TRAIL }, (_, index) => (
              <span key={`trail-${index}`} ref={(el) => { trailRefs.current[index] = el; }} className={styles.trail} aria-hidden="true" />
            ))}
            {Array.from({ length: DOTS }, (_, index) => (
              <span key={index} ref={(el) => { dotRefs.current[index] = el; }} className={styles.dot} aria-hidden="true" />
            ))}
            {layout.blocks.map(({ label, kind, width: w, height: h }, index) => (
              <div
                key={`${kind}-${index}`}
                ref={(el) => { blockRefs.current[index] = el; }}
                className={`${styles.block} ${styles[kind] ?? ""}`}
                style={{ width: w, height: h, fontSize: (kind === "plank" ? 11 : 13) * layout.scale }}
                aria-hidden="true"
              >
                {kind === "bug" ? (
                  <svg viewBox="0 0 24 24">
                    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
                      <path d="M9 5.5 7 3M15 5.5 17 3M6.5 11H3M6.5 15l-3 2M17.5 11H21M17.5 15l3 2" />
                    </g>
                    <ellipse cx="12" cy="14" rx="5.5" ry="7" fill="currentColor" />
                    <circle cx="12" cy="7" r="3" fill="currentColor" />
                  </svg>
                ) : (
                  label
                )}
              </div>
            ))}
            <div
              ref={shippyRef}
              className={styles.shippy}
              data-phase={phase}
              style={{ width: layout.shippySize, height: layout.shippySize } as CSSProperties}
              role="button"
              tabIndex={0}
              aria-label="Shippy. Press Enter to fling it at the stack"
              aria-disabled={phase !== "aim"}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                launchAimed();
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <svg viewBox="0 0 40 40">
                <rect width="40" height="40" rx="9" fill="var(--shippy-body)" />
                <path d="M9 13l8 3M31 13l-8 3" stroke="var(--shippy-face)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="14" cy="21" r="3.6" fill="var(--shippy-eye)" />
                <circle cx="26" cy="21" r="3.6" fill="var(--shippy-eye)" />
                <circle cx="15" cy="21.5" r="1.8" fill="var(--shippy-pupil)" />
                <circle cx="27" cy="21.5" r="1.8" fill="var(--shippy-pupil)" />
                <path d="M15 30h10" stroke="var(--shippy-face)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <svg className={styles.sling} aria-hidden="true">
              <line ref={(el) => { bandRefs.current[1] = el; }} className={styles.band} x1={layout.anchor.x + fork} y1={layout.anchor.y - 4} x2={layout.anchor.x} y2={layout.anchor.y} />
            </svg>
            {shots === 0 && (
              <p className={styles.hint} style={{ left: layout.anchor.x, top: layout.anchor.y - layout.shippySize / 2 - 14 }} aria-hidden="true">
                <MoveLeft size={14} strokeWidth={2} aria-hidden="true" />
                Pull back, let go
              </p>
            )}
          </>
        )}
        {won && showWon && (
          <div className={styles.won}>
            <p className={styles.wonTitle}>Stack tested.</p>
            <p>Every block cleared in {shots} {shots === 1 ? "shot" : "shots"}.</p>
          </div>
        )}
        {showReset && layout && layout.tables[0] && left < total && (
          <button type="button" className={styles.reset} style={{ left: layout.tables[0].x, top: layout.tables[0].y }} aria-label="Reset the tower" onClick={() => setRound((value) => value + 1)}>
            <RotateCcw size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
        )}
        <p className="sr-only" aria-live="polite">
          {shots === 0 ? "" : won ? `Stack tested. Every block cleared in ${shots} shots.` : `${left} of ${total} blocks left.`}
        </p>
      </div>
      {(cornerLink || footerStart || footerEnd) && (
        <div className={styles.footerRow}>
          <div className={styles.footerDetail}>{footerStart}</div>
          {cornerLink && seen && (
            // A full page load on purpose: the home page's GSAP pinning and smooth scroll are set up per load.
            <a className={styles.cornerLink} href={cornerLink.href}>
              {cornerLink.lead && <span className={styles.cornerLead}>{cornerLink.lead}</span>}
              <span className={styles.cornerLabel}>{cornerLink.label}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <div className={`${styles.footerDetail} ${styles.footerEnd}`}>{footerEnd}</div>
        </div>
      )}
    </div>
  );
}
