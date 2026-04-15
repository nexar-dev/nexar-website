import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypeWriter from "@/components/TypeWriter";
import { ArrowRight } from "lucide-react";

export default function CTASection({ onOpenQuestionnaire }: { onOpenQuestionnaire?: () => void }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contato" className="py-24 lg:py-32 bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div ref={ref} className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <TypeWriter
          text="Vamos criar o sistema ideal para a sua empresa"
          highlight="empresa"
          trigger={isVisible}
          startDelay={200}
          speed={35}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Conte para nós o que sua empresa precisa e vamos desenhar a solução perfeita juntos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onOpenQuestionnaire}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-purple px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-all duration-200 hover:scale-105 hover:opacity-90 active:scale-110"
          >
            Apresentar Minha Necessidade
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
