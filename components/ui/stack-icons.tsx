import type { ReactNode } from "react";

export const STACK = ["React", "Next.js", "Vue.js", "Nuxt", "TypeScript", "Tailwind CSS", "JavaScript", "Framer Motion", "GSAP"] as const;
export type Technology = (typeof STACK)[number];

export function StackIcon({ name }: { name: Technology }): ReactNode {
  const props = { width: 32, height: 32, viewBox: "0 0 32 32", fill: "none", "aria-hidden": true as const, className: "h-8 w-8 shrink-0" };
  switch (name) {
    case "React":
      return <svg {...props} className="h-8 w-8 shrink-0 text-[#087e9b] dark:text-[#61dafb]"><circle cx="16" cy="16" r="2.5" fill="currentColor" />{[0, 60, 120].map((rotation) => <ellipse key={rotation} cx="16" cy="16" rx="14" ry="5.5" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${rotation} 16 16)`} />)}</svg>;
    case "Next.js":
      return <svg {...props}><circle cx="16" cy="16" r="15" fill="currentColor" /><path d="M10 23V9l17 20M22 9v12" stroke="var(--background)" strokeWidth="2.2" strokeLinejoin="round" /></svg>;
    case "Vue.js":
      return <svg {...props}><path d="M1 4h6l9 15 9-15h6L16 29Z" fill="#238c67" /><path d="M7 4h6l3 5 3-5h6l-9 15Z" fill="#34495e" /></svg>;
    case "Nuxt":
      return <svg {...props}><path d="M3 26 15 5l12 21H3Z" stroke="#008b67" strokeWidth="3" strokeLinejoin="round" /><path d="m18 26 6-11 6 11H18Z" fill="var(--background)" stroke="#00b881" strokeWidth="3" strokeLinejoin="round" /></svg>;
    case "TypeScript":
      return <svg {...props}><rect width="32" height="32" rx="6" fill="#3178c6" /><path d="M7 15h11m-5.5 0v12" stroke="white" strokeWidth="2.5" /><path d="M27 17c-4-4-9 2-3 4 6 2 1 8-3 4" stroke="white" strokeWidth="2.3" strokeLinecap="round" /></svg>;
    case "JavaScript":
      return <svg {...props}><rect width="32" height="32" rx="5" fill="#f7df1e" /><text x="29" y="26" textAnchor="end" fill="#171717" fontSize="18" fontFamily="Arial, sans-serif" fontWeight="700">JS</text></svg>;
    case "Framer Motion":
      return <svg {...props}><path d="M3 4h26L16 17H3Zm0 13h13l13 13H16L3 17Z" fill="#a855f7" /><path d="M3 17h13L3 30Z" fill="#ec4899" /></svg>;
    case "GSAP":
      return <svg {...props}><rect width="32" height="32" rx="8" fill="#0e1710" /><path d="m18 4-10 14h8l-2 10 10-15h-8Z" fill="#88ce02" /></svg>;
    case "Tailwind CSS":
      return <svg {...props} viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-[#087f9e] dark:text-[#38bdf8]"><path fill="currentColor" d="M12 6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.566.89 2.289 1.624C13.666 11.818 15.026 13.2 18 13.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.566-.89-2.289-1.624C16.334 7.382 14.974 6 12 6ZM6 13.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.566.89 2.289 1.624C7.666 19.018 9.026 20.4 12 20.4c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.566-.89-2.289-1.624C10.334 14.582 8.974 13.2 6 13.2Z" /></svg>;
  }
}

