'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/data/projects';

type Props = {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
};

export function ProjectCard({ project, index, onOpen }: Props) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(project)}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card outline-none transition-[box-shadow,border-color] duration-500 hover:border-primary/25 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- native img for layout/animations */}
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {project.category}
        </div>
        <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-foreground">
          {project.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
