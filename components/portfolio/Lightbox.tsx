'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Project } from '@/lib/data/projects';

type Props = {
  project: Project | null;
  onClose: () => void;
};

export function Lightbox({ project, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const imgs =
      project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];

    const handleNext = () =>
      setCurrentIndex((prev) => (prev + 1) % imgs.length);
    const handlePrev = () =>
      setCurrentIndex((prev) => (prev - 1 + imgs.length) % imgs.length);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const images =
    project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          style={{
            background: 'hsl(var(--dark-base) / 0.55)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          }}
        >
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md transition hover:scale-105 hover:bg-secondary sm:right-8 sm:top-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-background shadow-[0_40px_80px_-30px_hsl(var(--foreground)/0.12)] md:grid-cols-[1.6fr_1fr]"
            style={{ maxHeight: 'min(88vh, 720px)' }}
          >
            <div className="group relative overflow-hidden bg-muted md:border-r md:border-border">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  alt={project.title}
                  className="h-full max-h-[40vh] w-full object-cover md:max-h-none"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none md:group-hover:pointer-events-auto">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/25 text-background shadow-lg backdrop-blur-md transition hover:bg-foreground/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/25 text-background shadow-lg backdrop-blur-md transition hover:bg-foreground/40"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}

              {images.length > 1 && (
                <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-md">
                  {images.map((_, i) => (
                    <div
                      key={String(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex max-h-[min(88vh,720px)] flex-col gap-8 overflow-y-auto p-8 sm:p-10">
              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {project.category}
                </div>
                <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                  {project.title}
                </h2>
              </div>

              <p className="text-[15px] font-medium leading-relaxed text-muted-foreground">
                {project.description ?? 'Um produto digital pensado nos mínimos detalhes...'}
              </p>

              <div className="h-px w-full bg-border" />

              <div>
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                  Stack Técnica
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">ESC</kbd>
                  <span>fechar</span>
                </div>
                {images.length > 1 && (
                  <div className="flex items-center gap-2 border-l border-border pl-4">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">← →</kbd>
                    <span>navegar</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
