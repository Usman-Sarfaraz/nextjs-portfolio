"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ShippyGame, type ShippyProgress } from "@/components/shippy/shippy-game";
import { LEVELS, starsFor, targetCount } from "@/components/shippy/shippy-world";
import { Star } from "lucide-react";
import { GameCard } from "./game-card";
import { useBestScore } from "./use-best-score";
import styles from "./playground.module.css";

const FEWER_WINS = (next: number, best: number): boolean => next < best;
/** The playground plays the forts (levels 1 to 4); level 0 is the footer's tower. */
const PLAY = [1, 2, 3, 4];
const bestKey = (level: number) => `slingshot-fort-${level}`;

function Stars({ count, size = 14 }: { count: number; size?: number }): ReactNode {
  return (
    <span className={styles.stars} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <Star key={n} size={size} strokeWidth={2} fill={n <= count ? "currentColor" : "none"} data-on={n <= count} />
      ))}
    </span>
  );
}

/** A level button that shows the stars from that level's best run. */
function LevelButton({ step, level, active, onPlay }: { step: number; level: number; active: boolean; onPlay: (level: number) => void }): ReactNode {
  const [best] = useBestScore(bestKey(level), FEWER_WINS);
  const stars = best === null ? 0 : starsFor(level, best);
  const spec = LEVELS[level];
  return (
    <button
      type="button"
      className={`${styles.button} ${styles.levelButton} ${active ? styles.primary : ""}`}
      aria-pressed={active}
      aria-label={`Level ${step}: ${spec?.name ?? ""}${best === null ? "" : `, ${stars} of 3 stars`}`}
      onClick={() => onPlay(level)}
    >
      {step}
      <Stars count={stars} size={11} />
    </button>
  );
}

export function SlingshotGame(): ReactNode {
  const [level, setLevel] = useState(PLAY[0]!);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState<ShippyProgress>({ left: targetCount(PLAY[0]!), total: targetCount(PLAY[0]!), shots: 0 });
  const [record, setRecord] = useState(false);
  const [best, submitBest] = useBestScore(bestKey(level), FEWER_WINS);

  // The progress callback is stable; it reads the current level's submit through a ref.
  const submitRef = useRef(submitBest);
  const submitted = useRef(false);
  useEffect(() => {
    submitRef.current = submitBest;
  }, [submitBest]);

  const onProgress = useCallback((next: ShippyProgress) => {
    setProgress(next);
    if (next.left === 0 && next.shots > 0 && !submitted.current) {
      submitted.current = true;
      setRecord(submitRef.current(next.shots));
    }
  }, []);

  const play = (nextLevel: number) => {
    submitted.current = false;
    setRecord(false);
    setProgress({ left: targetCount(nextLevel), total: targetCount(nextLevel), shots: 0 });
    setLevel(nextLevel);
    setAttempt((value) => value + 1);
  };

  const cleared = progress.left === 0 && progress.shots > 0;
  const step = PLAY.indexOf(level) + 1;
  const last = step === PLAY.length;
  const name = LEVELS[level]?.name ?? "";

  return (
    <GameCard
      id="slingshot"
      index={2}
      title="Slingshot"
      howTo="Bugs are hiding in the forts. Pull Shippy back, aim with the dotted arc and let go. Squash them or knock them off the table, and clear a level at par for three stars."
      stats={[
        { label: "Level", value: `${step}/${PLAY.length}` },
        { label: "Bugs left", value: progress.left },
        { label: "Shots", value: progress.shots },
        { label: "Par", value: LEVELS[level]?.par ?? "–" },
        { label: "Best", value: best ?? "–" },
      ]}
      actions={
        <>
          <p className={styles.hint}>Keyboard: Tab to Shippy and press Enter for an aimed shot.</p>
          <div className={styles.buttons}>
            <div className={styles.buttons} role="group" aria-label="Choose a level">
              {PLAY.map((item, index) => (
                <LevelButton key={item} step={index + 1} level={item} active={item === level} onPlay={play} />
              ))}
            </div>
            <button type="button" className={styles.button} onClick={() => play(level)}>
              Reset
            </button>
          </div>
        </>
      }
    >
      <ShippyGame
        key={`${level}-${attempt}`}
        level={level}
        variant="card"
        gutter={28}
        demo={attempt === 0}
        showReset={false}
        showWon={false}
        onProgress={onProgress}
      />
      {cleared && (
        <div className={styles.overlay}>
          <Stars count={starsFor(level, progress.shots)} size={30} />
          <p className={styles.overlayTitle}>{record ? "New best!" : last ? "All clear." : "Level cleared."}</p>
          <p className={styles.overlayText}>
            {name} cleared in <strong>{progress.shots}</strong> {progress.shots === 1 ? "shot" : "shots"}. Par is {LEVELS[level]?.par}.
            {best !== null && !record ? ` Your best is ${best}.` : ""}
          </p>
          <div className={styles.buttons}>
            <button type="button" className={styles.button} onClick={() => play(level)}>
              Replay
            </button>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => play(last ? PLAY[0]! : level + 1)}>
              {last ? "Start over" : "Next level"}
            </button>
          </div>
        </div>
      )}
    </GameCard>
  );
}
