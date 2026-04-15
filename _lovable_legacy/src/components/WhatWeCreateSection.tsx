import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypeWriter from "@/components/TypeWriter";
import { LayoutDashboard, Users, Package, Settings, Globe, Workflow, MonitorSmartphone, Database } from "lucide-react";

const systems = [
  { icon: Settings, title: "Sistemas Internos", desc: "Ferramentas internas sob medida para otimizar a operação diária da sua equipe." },
  { icon: LayoutDashboard, title: "Dashboards de Gestão", desc: "Painéis visuais com dados em tempo real para decisões rápidas e assertivas." },
  { icon: Users, title: "CRMs Personalizados", desc: "Gerencie clientes, vendas e relacionamento com uma plataforma feita para você." },
  { icon: Package, title: "ERPs Sob Medida", desc: "Integre finanças, estoque e operações em um único sistema inteligente." },
  { icon: Globe, title: "Portais de Clientes", desc: "Ofereça autoatendimento e transparência com portais modernos e intuitivos." },
  { icon: MonitorSmartphone, title: "Sistemas Administrativos", desc: "Back-office completo para controle total da sua operação." },
  { icon: Database, title: "Plataformas Internas", desc: "Centralize informações e processos em plataformas seguras e escaláveis." },
  { icon: Workflow, title: "Sistemas de Automação", desc: "Elimine tarefas repetitivas com fluxos automatizados e inteligentes." },
];

export default function WhatWeCreateSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="possibilidades" className="py-24 lg:py-32 bg-background bg-grid relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Possibilidades
          </motion.p>
          <TypeWriter
            text="O que podemos criar para você"
            highlight="criar"
            trigger={isVisible}
            startDelay={200}
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {systems.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 * i }}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card cursor-default overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
              style={{ minHeight: "140px" }}
            >
              <div className="transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-5">
                  <s.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-card">
                <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
