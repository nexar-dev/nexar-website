'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TypeWriter from '@/components/TypeWriter';
import { Video, Headphones, Presentation, CalendarCheck } from 'lucide-react';

const meetings = [
  { icon: Headphones, title: 'Entendimento da demanda', desc: 'Ouvimos suas necessidades com atenção para criar uma solução que realmente resolva seus problemas.' },
  { icon: CalendarCheck, title: 'Acompanhamento frequente', desc: 'Reuniões periódicas para alinhar expectativas, validar entregas e garantir que tudo saia como planejado.' },
  { icon: Presentation, title: 'Apresentação do sistema', desc: 'Demonstramos cada funcionalidade desenvolvida para que você acompanhe a evolução do seu sistema.' },
  { icon: Video, title: 'Suporte contínuo', desc: 'Após a entrega, continuamos disponíveis para ajustes, melhorias e treinamento da sua equipe.' },
];

export default function MeetingsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Proximidade
          </motion.p>
          <TypeWriter
            text="Reuniões que fazem a diferença"
            highlight="diferença"
            trigger={isVisible}
            startDelay={200}
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mt-5 text-base lg:text-lg leading-relaxed"
          >
            Acreditamos que um bom sistema nasce de uma boa comunicação. Por isso, mantemos reuniões frequentes durante todo o projeto.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {meetings.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-gradient-purple transition-all duration-300">
                <m.icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
