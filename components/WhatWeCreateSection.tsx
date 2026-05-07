"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TypeWriter from "@/components/TypeWriter";
import {
  Settings,
  LayoutDashboard,
  Users,
  Package,
  Workflow,
  Globe,
} from "lucide-react";

const systems = [
  {
    icon: Settings,
    title: "Sistemas Internos",
    desc: "Ferramentas sob medida para otimizar a operação e produtividade da sua equipe.",
  },
  {
    icon: Globe,
    title: "Websites Profissionais",
    desc: "Sites modernos, rápidos e otimizados para conversão, alinhados à identidade do seu negócio.",
  },
  {
    icon: Workflow,
    title: "Automação de Processos",
    desc: "Automatize tarefas repetitivas e ganhe escala com fluxos inteligentes.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards de Gestão",
    desc: "Visualize dados em tempo real e tome decisões com mais velocidade e precisão.",
  },
  {
    icon: Users,
    title: "CRM Personalizado",
    desc: "Gerencie clientes e vendas com uma plataforma adaptada ao seu processo.",
  },
  {
    icon: Package,
    title: "ERP Sob Medida",
    desc: "Integre finanças, estoque e operações em um único sistema inteligente.",
  },
];
export default function WhatWeCreateSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="servicos"
      className="py-24 lg:py-32 bg-background bg-grid relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Serviços
          </motion.p>
          <TypeWriter
            text="O que podemos criar para você"
            highlight="criar"
            trigger={isVisible}
            startDelay={200}
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <h3 className="font-display font-semibold text-foreground">
                  {s.title}
                </h3>
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-card">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.72, duration: 0.55 }}
          className="flex justify-center mt-14 lg:mt-16"
        >
          <Link
            href="/portfolio#portfolio-projetos"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-purple px-8 py-3 text-sm font-medium text-primary-foreground shadow-card transition-all duration-200 hover:scale-105 hover:shadow-card-hover active:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Nosso portfólio
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
