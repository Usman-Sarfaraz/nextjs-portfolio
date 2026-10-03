import type { ReactNode } from "react";

export function Experience(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">Experience</h3>
      <article className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="rounded-3xl border border-foreground/5 bg-background p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background">B</span>
            <div>
              <h4 className="text-lg font-semibold tracking-tight">Bitlogicx</h4>
              <p className="mt-1 text-sm text-foreground/70">Frontend Developer · Aug 2024 – Present</p>
              <p className="mt-1 text-sm text-foreground/55">Lahore, Pakistan</p>
            </div>
          </div>
          <ul className="mt-5 list-disc space-y-3 pl-5 text-[15px] leading-relaxed text-foreground/70">
            <li>Led frontend development for enterprise transport and training platforms supporting international clients.</li>
            <li>Built scalable Vue and Nuxt interfaces, role-based workflows, and analytics dashboards for 15,000+ active users across 250+ organizations.</li>
            <li>Integrated REST APIs and Socket.io, with bilingual English/Arabic interfaces and RTL support.</li>
          </ul>
        </div>
      </article>
    </div>
  );
}
