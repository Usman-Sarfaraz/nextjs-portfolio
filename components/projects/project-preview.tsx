"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useInView } from "motion/react";
import { ArrowUpRight, Expand, Pause, Play, X } from "lucide-react";
import { useReducedMotion } from "@/lib/motion";
import styles from "./projects.module.css";

export type PreviewProject = { id: "acrylica" | "ai-export" | "psi-algebra" | "cleovici" | "bitlogicx"; name: string; url: string };

function Walkthrough({ project, paused }: { project: PreviewProject; paused?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const completed = useRef(false);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const playing = inView && !(paused ?? reducedMotion);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (!inView) completed.current = false;
    if (playing && !completed.current) {
      void element.play().catch(() => {
        // Browsers can block autoplay; the expanded preview has playback controls.
      });
    } else {
      element.pause();
    }
  }, [playing, inView]);

  return (
    <div ref={ref} className={styles.preview}>
      <video ref={video} src={`/projects-videos/${project.id}-overview.mp4`}
        aria-label={`${project.name} website walkthrough`} className={styles.walkthroughVideo}
        muted playsInline preload="metadata" onEnded={(event) => {
          completed.current = true;
          event.currentTarget.pause();
          event.currentTarget.currentTime = 0;
        }} />
    </div>
  );
}

function PreviewModal({ project, dismiss }: { project: PreviewProject; dismiss: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(reducedMotion);
  useEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.documentElement.style.overflow;
    element.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);
  return createPortal(
    <dialog ref={dialog} className={styles.modal} aria-labelledby="project-preview-title" data-lenis-prevent
      onCancel={dismiss} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dismiss();
      }}>
      <header className={styles.modalHeader}>
        <h2 id="project-preview-title">{project.name}</h2>
        <button type="button" autoFocus className={styles.iconButton} onClick={dismiss} aria-label="Close project preview"><X size={22} /></button>
      </header>
      <Walkthrough project={project} paused={paused} />
      <footer className={styles.modalFooter}>
        <button type="button" className={styles.playButton} onClick={() => setPaused(!paused)} aria-label={paused ? "Play walkthrough" : "Pause walkthrough"}>
          {paused ? <Play size={16} /> : <Pause size={16} />} {paused ? "Play" : "Pause"}
        </button>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.visit}>Visit website <ArrowUpRight size={18} /><span className="sr-only"> (opens in a new tab)</span></a>
      </footer>
    </dialog>, document.body);
}

export function ProjectPreview({ project }: { project: PreviewProject }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={styles.previewButton} aria-label={`Open ${project.name} project preview`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <Walkthrough project={project} />
      <span className={styles.expandBadge}><Expand size={16} aria-hidden="true" /> View project</span>
    </button>
    {open && <PreviewModal project={project} dismiss={() => setOpen(false)} />}
  </>;
}

export function TiltCard({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 5}deg`);
  }
  return <div className={`${styles.frame} ${styles.tiltCard}`} onPointerMove={move} onPointerLeave={(event) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }}>{children}</div>;
}
