"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { Lightbox } from "./Lightbox";
import { projects, type Project } from "@/lib/data/projects";

export function ProjectsGrid() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section
      id="portfolio-projetos"
      className="scroll-mt-28 relative mx-auto max-w-7xl px-6 pb-32 pt-20 sm:px-10 sm:pb-40 sm:pt-24"
    >
      <div className="mb-12 flex flex-col gap-2 sm:mb-16 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Nossos melhores projetos
        </h2>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {String(projects.length).padStart(2, "0")} cases
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
        ))}
      </div>

      <Lightbox project={active} onClose={() => setActive(null)} />
    </section>
  );
}
