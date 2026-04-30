'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TypeWriter from '@/components/TypeWriter';
import { RefreshCw, FolderKanban, Gauge, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const benefits = [
  { icon: RefreshCw, title: 'Menos retrabalho', desc: 'Processos padronizados que eliminam erros e repetições.' },
  { icon: FolderKanban, title: 'Mais organização', desc: 'Informações centralizadas e acessíveis a qualquer momento.' },
  { icon: Gauge, title: 'Mais controle', desc: 'Visão completa da operação com dados em tempo real.' },
  { icon: Zap, title: 'Decisões mais rápidas', desc: 'Dados claros que transformam complexidade em ação.' },
  { icon: TrendingUp, title: 'Mais produtividade', desc: 'Equipes focadas no que importa, sem tarefas manuais.' },
  { icon: ShieldCheck, title: 'Menos erros', desc: 'Automações que reduzem falhas humanas e operacionais.' },
];

export default function WhySystemSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="beneficios" className="py-24 lg:py-32 bg-dark-base relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-accent uppercase tracking-widest mb-4"
          >
            Benefícios
          </motion.p>
          <TypeWriter
            text="Por que ter um sistema?"
            highlight="sistema"
            trigger={isVisible}
            startDelay={200}
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-on-dark"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="group glass-dark rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-dark-card hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] hover:border hover:border-primary/20"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-purple group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <b.icon size={18} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display font-semibold text-on-dark mb-1 group-hover:text-primary transition-colors duration-300">{b.title}</h3>
              <p className="text-sm text-on-dark-muted leading-relaxed group-hover:text-on-dark transition-colors duration-300">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
