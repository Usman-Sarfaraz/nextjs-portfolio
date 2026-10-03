import { headingFont } from "@/lib/fonts";
import { ArrowRight, GraduationCap, Truck } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { FadeIn } from "@/components/ui/motion-primitives";

type Project = {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  period: string;
  highlights: readonly string[];
  technologies: readonly string[];
  icon: ComponentType<{ className?: string }>;
};

const PROJECTS: readonly Project[] = [
  {
    id: "ola-tms",
    name: "OLA TMS",
    category: "Training management",
    title: "A training platform built for Oman’s logistics community.",
    description: "Designed and led frontend architecture for the Oman Logistics Association’s training management system. Built role-based navigation, approval workflows, payments, support tickets, and analytics, with dynamic language switching and RTL support.",
    period: "Apr 2025 – Jan 2026",
    highlights: ["250+ organizations", "15,000+ active users", "8,000+ enrollments"],
    technologies: ["Nuxt 4", "Vue 3", "TypeScript", "Pinia", "Tailwind CSS", "ECharts"],
    icon: GraduationCap,
  },
  {
    id: "opal-stms",
    name: "OPAL STMS",
    category: "Smart transport",
    title: "Real-time visibility for transport operations.",
    description: "Led frontend development for a Nuxt 3 migration, collaborating with a senior full-stack engineer. Built live vehicle and driver monitoring, geofencing, reporting, and bilingual English/Arabic interfaces across a 19-module system.",
    period: "Aug 2024 – Apr 2025",
    highlights: ["19 frontend modules", "13 reporting modules", "40% less boilerplate"],
    technologies: ["Nuxt 3", "Vue 3", "TypeScript", "Nuxt UI", "Socket.io", "ECharts"],
    icon: Truck,
  },
];

export type ProjectsProps = { withHeadline?: boolean };

export function Projects({ withHeadline = false }: ProjectsProps): ReactNode {
  return (
    <section className="relative w-full">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {withHeadline && (
          <FadeIn className="flex flex-col items-center gap-5 pt-12 pb-10 text-center sm:pt-20 sm:pb-14">
            <h2 className={`${headingFont.className} text-[2.5rem] font-normal tracking-tight leading-[1.05] md:text-[3rem] lg:text-[3.5rem]`}>Selected work</h2>
            <p className="max-w-[38ch] text-lg leading-relaxed tracking-tight text-foreground/65 sm:text-xl">Enterprise platforms I&rsquo;ve helped design and build, making complex workflows easier to use.</p>
          </FadeIn>
        )}
        <div className="grid gap-6 md:grid-cols-2 md:gap-7">
          {PROJECTS.map((project, index) => {
            const Icon = project.icon;
            return (
              <FadeIn key={project.id} delay={index * 0.06} className="h-full">
                <article className="project-card flex h-full flex-col gap-5 rounded-3xl border border-foreground/8 bg-background p-5 sm:p-7">
                  <header className="flex items-center gap-3">
                    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10"><Icon className="h-5 w-5" /></span>
                    <div><h3 className={`${headingFont.className} text-base font-normal tracking-tight`}>{project.name}</h3><p className="text-xs text-foreground/55">{project.category}</p></div>
                  </header>
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-foreground/5 bg-foreground/3 p-4">
                    {project.highlights.map((highlight) => <span key={highlight} className="rounded-lg bg-background px-3 py-2 text-sm font-medium">{highlight}</span>)}
                  </div>
                  <h4 className={`${headingFont.className} text-[22px] font-normal tracking-tight leading-tight`}>{project.title}</h4>
                  <p className="text-[15px] leading-relaxed text-foreground/65">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-full border border-foreground/8 px-2.5 py-1 text-xs text-foreground/70">{technology}</span>)}</div>
                  <p className="text-xs text-foreground/50">Frontend development · {project.period}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="#contact" className="focus-ring inline-flex items-center gap-2 rounded-xl border border-foreground/8 bg-background px-5 py-2.5 text-sm font-medium">Let&rsquo;s build something <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
}
