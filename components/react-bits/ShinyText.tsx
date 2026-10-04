"use client";

// Adapted from React Bits: https://reactbits.dev/text-animations/shiny-text
import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/motion";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  delay?: number;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}: ShinyTextProps) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsed = useRef(0);
  const lastTime = useRef<number | null>(null);
  const duration = Math.max(speed, 0.01) * 1000;
  const cycleDuration = duration + Math.max(delay, 0) * 1000;

  useAnimationFrame((time) => {
    if (disabled || reducedMotion || paused) {
      lastTime.current = null;
      return;
    }
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }
    elapsed.current += time - lastTime.current;
    lastTime.current = time;
    const cycleTime = elapsed.current % (cycleDuration * (yoyo ? 2 : 1));
    let position = Math.min(cycleTime / duration, 1) * 100;
    if (yoyo && cycleTime >= cycleDuration) {
      position = 100 - Math.min((cycleTime - cycleDuration) / duration, 1) * 100;
    }
    progress.set(direction === "left" ? position : 100 - position);
  });

  const backgroundPosition = useTransform(progress, (value) => `${150 - value * 2}% center`);
  const staticText = disabled || reducedMotion;
  const gradientStyle = {
    display: "inline-block" as const,
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={staticText ? { color, display: "inline-block" } : { ...gradientStyle, backgroundPosition }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {text}
    </motion.span>
  );
}
