"use client";

import type MatterType from "matter-js";
import { RotateCcw } from "lucide-react";
import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BACKLOG, GRAVITY_PER_STEP, LAUNCH_POWER, buildWorld, type World } from "./shippy-world";
import styles from "./shippy.module.css";

type Phase = "aim" | "drag" | "fly";
type Layout = Pick<World, "anchor" | "table" | "scale" | "shippySize"> & { blocks: { width: number; height: number }[] };

const DOTS = 8;
const STEP_MS = 1000 / 60;

export function ShippyGame(): ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const shippyRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bandRefs = useRef<(SVGLineElement | null)[]>([]);
  const worldRef = useRef<World | null>(null);
  const matterRef = useRef<typeof MatterType | null>(null);
  const phaseRef = useRef<Phase>("aim");
  const [phase, setPhase] = useState<Phase>("aim");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [left, setLeft] = useState<number>(BACKLOG.length);
  const [shots, setShots] = useState(0);
  const [round, setRound] = useState(0);
  // Build the scene the first time it is seen; pause the physics whenever it scrolls away.
  const seen = useInView(stageRef, { once: true, amount: 0.15 });
  const inView = useInView(stageRef, { amount: 0.05 });
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

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
      const world = buildWorld(M, width, height);
      worldRef.current = world;
      phaseRef.current = "aim";
      setPhase("aim");
      setLeft(BACKLOG.length);
      setShots(0);
      setLayout({
        anchor: world.anchor,
        table: world.table,
        scale: world.scale,
        shippySize: world.shippySize,
        blocks: world.blocks.map(({ width: w, height: h }) => ({ width: w, height: h })),
      });

      let flight = 0;
      let resting = 0;
      let remaining = BACKLOG.length;

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
        // The bands only stretch while Shippy is pulled back; at rest they would cross its face.
        const aiming = phaseRef.current === "drag";
        bandRefs.current.forEach((band) => {
          if (!band) return;
          band.style.visibility = aiming ? "visible" : "hidden";
          band.setAttribute("x2", String(shippy.position.x));
          band.setAttribute("y2", String(shippy.position.y));
        });

        const cleared = world.blocks.filter(({ body }) => body.position.y > world.tableTop + 4 || body.position.x > width + 40).length;
        if (BACKLOG.length - cleared !== remaining) {
          remaining = BACKLOG.length - cleared;
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
  }, [seen, round]);

  const localPoint = (event: PointerEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    return { x: event.clientX - (box?.left ?? 0), y: event.clientY - (box?.top ?? 0) };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (phaseRef.current !== "aim") return;
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
    const onTable = world.blocks.filter(({ body }) => body.position.y <= world.tableTop + 4);
    const target = onTable.reduce<(typeof onTable)[number] | undefined>((low, block) => (!low || block.body.position.y > low.body.position.y ? block : low), undefined);
    const goal = target ? target.body.position : { x: world.table.x, y: world.tableTop - 40 * world.scale };
    const vx = 17 * world.scale * (0.97 + Math.random() * 0.06);
    const steps = (goal.x - world.anchor.x) / vx;
    launch({ x: vx, y: (goal.y - world.anchor.y - 0.5 * GRAVITY_PER_STEP * steps * steps) / steps });
  };

  const won = left === 0;
  const fork = layout ? 14 * layout.scale : 0;

  return (
    <div className={styles.game}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.floor} aria-hidden="true" />
        {layout && (
          <>
            <div
              className={styles.table}
              aria-hidden="true"
              style={{ left: layout.table.x - layout.table.width / 2, top: layout.table.y - layout.table.height / 2, width: layout.table.width, height: layout.table.height }}
            />
            <svg className={styles.sling} aria-hidden="true">
              <line ref={(el) => { bandRefs.current[0] = el; }} className={styles.band} x1={layout.anchor.x - fork} y1={layout.anchor.y - 4} x2={layout.anchor.x} y2={layout.anchor.y} />
              <path className={styles.post} d={`M${layout.anchor.x} ${layout.anchor.y + 150 * layout.scale}V${layout.anchor.y + 22 * layout.scale}M${layout.anchor.x} ${layout.anchor.y + 22 * layout.scale}L${layout.anchor.x - fork} ${layout.anchor.y - 4}M${layout.anchor.x} ${layout.anchor.y + 22 * layout.scale}L${layout.anchor.x + fork} ${layout.anchor.y - 4}`} />
            </svg>
            {Array.from({ length: DOTS }, (_, index) => (
              <span key={index} ref={(el) => { dotRefs.current[index] = el; }} className={styles.dot} aria-hidden="true" />
            ))}
            {BACKLOG.map((label, index) => (
              <div
                key={label}
                ref={(el) => { blockRefs.current[index] = el; }}
                className={styles.block}
                style={{ width: layout.blocks[index]?.width, height: layout.blocks[index]?.height, fontSize: 13 * layout.scale }}
                aria-hidden="true"
              >
                {label}
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
          </>
        )}
        {won && (
          <div className={styles.won}>
            <p className={styles.wonTitle}>Stack tested.</p>
            <p>Every block cleared in {shots} {shots === 1 ? "shot" : "shots"}.</p>
          </div>
        )}
        <button type="button" className={styles.reset} aria-label="Reset the tower" onClick={() => setRound((value) => value + 1)}>
          <RotateCcw size={16} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <p className="sr-only" aria-live="polite">
          {shots === 0 ? "" : won ? `Stack tested. Every block cleared in ${shots} shots.` : `${left} of ${BACKLOG.length} blocks left.`}
        </p>
      </div>
    </div>
  );
}
