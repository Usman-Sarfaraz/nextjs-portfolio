"use client";

import type MatterType from "matter-js";
import type { Body, Engine } from "matter-js";
import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";
import { GameCard } from "./game-card";
import { useBestScore } from "./use-best-score";
import styles from "./playground.module.css";
import tower from "./stack-tower.module.css";

const STACK = ["React", "Next.js", "TypeScript", "Vue.js", "Nuxt", "Tailwind CSS", "GSAP", "Vite", "Node.js", "Git", "HTML", "CSS"];
const MAX_BLOCKS = 60;
const COOLDOWN_MS = 650;
const STEP_MS = 1000 / 60;

type Phase = "ready" | "playing" | "over";
type Piece = { body: Body; label: string; width: number; height: number; counted: boolean };
type Game = { M: typeof MatterType; engine: Engine; baseTop: number; baseWidth: number; pieces: Piece[]; scale: number };

export function StackTower(): ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const game = useRef<Game | null>(null);
  const mover = useRef({ x: 0, direction: 1, readyAt: 0, label: STACK[0]!, width: 0 });
  const camera = useRef(0);
  const scoreRef = useRef(0);
  const nextLabel = useRef(0);
  const perfect = useRef({ streak: 0, best: 0 });

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [pieces, setPieces] = useState<{ label: string; width: number; height: number }[]>([]);
  const [base, setBase] = useState<{ width: number; top: number } | null>(null);
  const [next, setNext] = useState({ label: STACK[0]!, width: 0 });
  const [scale, setScale] = useState(1);
  const [record, setRecord] = useState(false);
  const [perfects, setPerfects] = useState(0);
  const [best, submitBest] = useBestScore("stack-tower");
  const reduced = useReducedMotion();
  const inView = useInView(stageRef, { amount: 0.3 });
  const inViewRef = useRef(inView);
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  const widthOf = (label: string, scale: number) => (label.length * 8 + 40) * scale;

  const queueNext = useCallback((scale: number) => {
    const label = STACK[nextLabel.current % STACK.length]!;
    nextLabel.current += 1;
    mover.current.label = label;
    mover.current.width = widthOf(label, scale);
    setNext({ label, width: mover.current.width });
  }, []);

  const start = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    const M = await import("matter-js");
    if (game.current) M.Engine.clear(game.current.engine);

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const scale = Math.min(1, Math.max(0.7, width / 900));
    const engine = M.Engine.create({ enableSleeping: true });
    engine.positionIterations = 10;
    const baseWidth = Math.min(280 * scale, width * 0.5);
    const baseTop = height - 56;
    M.Composite.add(engine.world, M.Bodies.rectangle(width / 2, baseTop + 200, baseWidth, 400, { isStatic: true, friction: 1 }));

    game.current = { M, engine, baseTop, baseWidth, pieces: [], scale };
    camera.current = 0;
    scoreRef.current = 0;
    perfect.current = { streak: 0, best: 0 };
    setPerfects(0);
    nextLabel.current = 0;
    mover.current = { x: width / 2 - baseWidth * 0.5, direction: 1, readyAt: performance.now() + 300, label: STACK[0]!, width: 0 };
    queueNext(scale);
    setPieces([]);
    setBase({ width: baseWidth, top: baseTop });
    setScale(scale);
    setScore(0);
    setRecord(false);
    setPhase("playing");
    stage.focus({ preventScroll: true });
  };

  const popAt = (x: number, y: number, text: string) => {
    const stage = stageRef.current;
    if (!stage) return;
    const el = document.createElement("span");
    el.className = tower.pop ?? "";
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    stage.appendChild(el);
    const animation = el.animate(
      [{ transform: "translate(-50%, -50%) scale(0.7)", opacity: 1 }, { transform: "translate(-50%, -170%) scale(1)", opacity: 0 }],
      { duration: reduced ? 450 : 850, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    animation.onfinish = () => el.remove();
  };

  const towerTop = (current: Game) =>
    current.pieces.reduce((top, piece) => (piece.counted ? Math.min(top, piece.body.position.y - piece.height / 2) : top), current.baseTop);

  const drop = useCallback(() => {
    const current = game.current;
    if (!current || phase !== "playing" || performance.now() < mover.current.readyAt || current.pieces.length >= MAX_BLOCKS) return;
    const { M, scale } = current;
    const height = 34 * scale;
    const y = towerTop(current) - 150 * scale;
    // A drop lined up with the block below (or the base's centre) snaps true and counts as perfect.
    const resting = current.pieces.filter((piece) => piece.counted);
    const below = resting.reduce<Piece | undefined>((top, piece) => (!top || piece.body.position.y < top.body.position.y ? piece : top), undefined);
    const stage = stageRef.current;
    const targetX = below ? below.body.position.x : (stage?.clientWidth ?? 0) / 2;
    let x = mover.current.x;
    if (Math.abs(x - targetX) < 9 * scale) {
      x = targetX;
      perfect.current.streak += 1;
      perfect.current.best = Math.max(perfect.current.best, perfect.current.streak);
      setPerfects(perfect.current.best);
      popAt(x, y - camera.current, perfect.current.streak > 1 ? `Perfect ×${perfect.current.streak}` : "Perfect");
    } else {
      perfect.current.streak = 0;
    }
    const body = M.Bodies.rectangle(x, y, mover.current.width, height, {
      chamfer: { radius: 6 * scale },
      friction: 0.9,
      frictionStatic: 1,
      restitution: 0,
      density: 0.002,
    });
    M.Composite.add(current.engine.world, body);
    current.pieces.push({ body, label: mover.current.label, width: mover.current.width, height, counted: false });
    setPieces(current.pieces.map(({ label, width, height: h }) => ({ label, width, height: h })));
    mover.current.readyAt = performance.now() + COOLDOWN_MS;
    queueNext(scale);
    // popAt only touches the DOM and refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, queueNext]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (phase === "playing") drop();
  };

  // The game loop: physics, the sliding block, the rising camera and the fall check.
  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const current = game.current;
      const stage = stageRef.current;
      if (!current || !stage || !inViewRef.current || document.hidden) return;
      const { M, engine, pieces: list, baseTop, scale } = current;
      M.Engine.update(engine, STEP_MS);
      const width = stage.clientWidth;
      const height = stage.clientHeight;

      // Count blocks that have come to rest on the tower; end the round when one falls past the base.
      let fell = false;
      list.forEach((piece, index) => {
        const { body } = piece;
        if (body.position.y > baseTop + 30 || body.position.x < -80 || body.position.x > width + 80) fell = true;
        if (!piece.counted && body.position.y < baseTop && (body.isSleeping || body.speed < 0.08)) {
          piece.counted = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
        const el = pieceRefs.current[index];
        if (el) el.style.transform = `translate3d(${body.position.x - piece.width / 2}px, ${body.position.y - piece.height / 2}px, 0) rotate(${body.angle}rad)`;
      });
      if (fell) {
        setRecord(submitBest(scoreRef.current));
        setPhase("over");
        return;
      }

      // Slide the next block, a little faster for every block placed.
      const m = mover.current;
      const speed = (3.4 + scoreRef.current * 0.16) * scale * (reduced ? 0.6 : 1);
      const half = m.width / 2;
      // Sweep close to the tower, not the whole stage, so timing decides the drop rather than luck.
      const reach = Math.max(current.baseWidth * 0.5, 90 * scale);
      const minX = Math.max(half + 16, width / 2 - reach);
      const maxX = Math.min(width - half - 16, width / 2 + reach);
      m.x += m.direction * speed;
      if (m.x > maxX) {
        m.x = maxX;
        m.direction = -1;
      }
      if (m.x < minX) {
        m.x = minX;
        m.direction = 1;
      }
      const top = towerTop(current);
      if (moverRef.current) {
        moverRef.current.style.transform = `translate3d(${m.x - half}px, ${top - 150 * scale - 17 * scale}px, 0)`;
        moverRef.current.style.opacity = now < m.readyAt ? "0" : "1";
      }

      // Keep the top of the tower in view.
      const target = Math.min(0, top - height * 0.55);
      camera.current = reduced ? target : camera.current + (target - camera.current) * 0.08;
      if (worldRef.current) worldRef.current.style.transform = `translate3d(0, ${-camera.current}px, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduced, submitBest]);

  useEffect(() => () => {
    if (game.current) game.current.M.Engine.clear(game.current.engine);
  }, []);

  return (
    <GameCard
      id="stack-tower"
      index={3}
      title="Stack tower"
      howTo="A block from my stack slides across the top. Drop it with a click, a tap or Space. Line it up with the block below for a perfect drop. One fall and it's over."
      stats={[
        { label: "Height", value: score },
        { label: "Perfect streak", value: perfects },
        { label: "Best", value: best ?? "–" },
      ]}
      actions={
        <>
          <p className={styles.hint}>It speeds up as the tower grows. Land blocks near the middle.</p>
          {phase === "playing" && (
            <div className={styles.buttons}>
              <button type="button" className={styles.button} onClick={() => void start()}>
                Restart
              </button>
            </div>
          )}
        </>
      }
    >
      <div
        ref={stageRef}
        className={tower.stage}
        tabIndex={0}
        role="group"
        aria-label="Stack tower stage. Press Space to drop the block."
        data-playing={phase === "playing"}
        onPointerDown={() => drop()}
        onKeyDown={onKeyDown}
      >
        <div ref={worldRef} className={tower.world}>
          {base && <div className={tower.base} style={{ width: base.width, top: base.top, marginLeft: -base.width / 2 }} aria-hidden="true" />}
          {pieces.map((piece, index) => (
            <div
              key={index}
              ref={(el) => { pieceRefs.current[index] = el; }}
              className={tower.block}
              style={{ width: piece.width, height: piece.height, fontSize: 14 * scale }}
              aria-hidden="true"
            >
              {piece.label}
            </div>
          ))}
          {phase === "playing" && (
            <div
              ref={moverRef}
              className={`${tower.block} ${tower.mover}`}
              style={{ width: next.width, height: 34 * scale, fontSize: 14 * scale }}
              aria-hidden="true"
            >
              {next.label}
            </div>
          )}
        </div>
        <div className={tower.ground} aria-hidden="true" />
        {phase === "playing" && (
          <p className={tower.hud} aria-hidden="true">
            {score}
            <span>blocks high</span>
          </p>
        )}

        {phase !== "playing" && (
          <div className={styles.overlay}>
            {phase === "ready" ? (
              <>
                <p className={styles.overlayTitle}>Build it tall.</p>
                <p className={styles.overlayText}>Drop each block onto the tower. The physics is real, so off-centre blocks tip.</p>
              </>
            ) : (
              <>
                <p className={styles.overlayTitle}>{record ? "New best!" : "Timber."}</p>
                <p className={styles.overlayText}>
                  Your tower reached <strong>{score}</strong> {score === 1 ? "block" : "blocks"}.{best !== null && !record ? ` Your best is ${best}.` : ""}
                </p>
              </>
            )}
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => void start()}>
              {phase === "ready" ? "Start stacking" : "Try again"}
            </button>
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {phase === "over" ? `The tower fell. It reached ${score} blocks.` : phase === "playing" ? `Height ${score}.` : ""}
        </p>
      </div>
    </GameCard>
  );
}
