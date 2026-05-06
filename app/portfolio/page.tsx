'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PortfolioBackground } from '@/components/portfolio/PortfolioBackground';
import { ProjectsGrid } from '@/components/portfolio/ProjectsGrid';

export default function PortfolioPage() {
  const shouldReduceMotion = useReducedMotion();
  const highlightClearRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const applyHighlightFromHash = () => {
      if (typeof window === 'undefined') return;
      if (window.location.hash !== '#portfolio-projetos') return;

      const run = () => {
        const el = document.getElementById('portfolio-projetos');
        if (!el) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clearTimeout(highlightClearRef.current);
        el.classList.remove('portfolio-destination-highlight');
        requestAnimationFrame(() => {
          el.classList.add('portfolio-destination-highlight');
          highlightClearRef.current = setTimeout(() => {
            el.classList.remove('portfolio-destination-highlight');
          }, 2200);
        });
      };

      requestAnimationFrame(run);
    };

    applyHighlightFromHash();
    window.addEventListener('hashchange', applyHighlightFromHash);
    return () => {
      window.removeEventListener('hashchange', applyHighlightFromHash);
      clearTimeout(highlightClearRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar ctaVariant="back-to-landing" />
      <PortfolioBackground />

      <div className="relative">
        <ProjectsGrid />
      </div>

      <Footer />

      <motion.a
        href="https://wa.me/5512997692740"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-purple text-primary-foreground shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-card-hover active:scale-110"
        aria-label="Conversar no WhatsApp"
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <MessageCircle size={24} />
      </motion.a>
    </main>
  );
}
