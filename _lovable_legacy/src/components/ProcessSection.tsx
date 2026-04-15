import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypeWriter from "@/components/TypeWriter";
import { Search, Map, Code2, Rocket, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, num: "01", title: "Entendemos seu processo", desc: "Mapeamos como sua empresa funciona, onde estão os gargalos e o que pode ser melhorado." },
  { icon: Map, num: "02", title: "Planejamos o sistema", desc: "Desenhamos a solução ideal com escopo claro, prioridades e roadmap de desenvolvimento." },
  { icon: Code2, num: "03", title: "Desenvolvemos a solução", desc: "Construímos o sistema com entregas iterativas, validação constante e total transparência." },
  { icon: Rocket, num: "04", title: "Implementamos na empresa", desc: "Deploy seguro, migração de dados e treinamento completo para sua equipe." },
  { icon: TrendingUp, num: "05", title: "Evoluímos com o crescimento", desc: "O sistema cresce junto com o negócio, recebendo melhorias e novas funcionalidades." },
];

export default function ProcessSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="como-funciona" className="py-24 lg:py-32 bg-background bg-grid relative overflow-hidden">
      <div ref={ref} className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Processo
          </motion.p>
          <TypeWriter
            text="Como funciona"
            trigger={isVisible}
            startDelay={200}
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
          />
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.6 }}
                className={`relative flex items-start gap-6 lg:gap-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 lg:left-1/2 w-7 h-7 rounded-full bg-gradient-purple -translate-x-3.5 mt-3 z-10 shadow-glow border-2 border-primary/30" />

                <div className={`flex-1 pl-14 lg:pl-0 ${i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:pl-16"}`}>
                  <span className="text-xs font-mono text-primary font-semibold">{step.num}</span>
                  <h3 className="font-display font-semibold text-foreground text-lg mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
