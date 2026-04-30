'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import TypeWriter from '@/components/TypeWriter';
import {
  LayoutDashboard, Users, BarChart3, Workflow,
  Home, Settings, Bell, Search, ShoppingCart,
  TrendingUp, TrendingDown, Mail, Phone, Star,
  CheckCircle2, Clock, ArrowRight, Zap, GitBranch,
  PieChart, DollarSign,
} from 'lucide-react';

const nexarLogo = '/assets/nexar-logo.png';

const tabsMeta = [
  { id: 'admin', icon: LayoutDashboard, label: 'Painel Administrativo' },
  { id: 'clients', icon: Users, label: 'Gestão de Clientes' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios & Gráficos' },
  { id: 'automation', icon: Workflow, label: 'Automações' },
];

const sidebarIcons = [Home, BarChart3, Users, ShoppingCart, Settings];

function AdminContent() {
  const stats = [
    { label: 'Receita', value: 'R$ 48.2k', icon: DollarSign, change: '+18%', up: true },
    { label: 'Pedidos', value: '324', icon: ShoppingCart, change: '+12%', up: true },
    { label: 'Clientes', value: '1.8k', icon: Users, change: '+6%', up: true },
    { label: 'Margem', value: '32%', icon: TrendingDown, change: '-2%', up: false },
  ];
  const recentOrders = [
    { id: '#1042', client: 'Loja Bella', value: 'R$ 2.340', status: 'Aprovado', color: 'bg-green-500/20 text-green-400' },
    { id: '#1041', client: 'Tech Corp', value: 'R$ 890', status: 'Pendente', color: 'bg-primary/20 text-primary' },
    { id: '#1040', client: 'Café Art', value: 'R$ 1.560', status: 'Enviado', color: 'bg-accent/20 text-accent' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-lg bg-dark-card p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-on-dark-muted">{s.label}</span>
              <s.icon size={10} className="text-on-dark-muted/50" />
            </div>
            <p className="text-sm font-bold text-on-dark">{s.value}</p>
            <span className={`text-[8px] font-medium ${s.up ? 'text-green-400' : 'text-accent'}`}>{s.change}</span>
          </motion.div>
        ))}
      </div>
      <div className="rounded-lg bg-dark-card p-3">
        <span className="text-[9px] text-on-dark-muted mb-2 block">Pedidos Recentes</span>
        {recentOrders.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center justify-between py-1.5 border-b border-dark-border/50 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-on-dark-muted">{o.id}</span>
              <span className="text-[9px] text-on-dark">{o.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-on-dark">{o.value}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium ${o.color}`}>{o.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClientsContent() {
  const clients = [
    { name: 'Maria Oliveira', email: 'maria@empresa.com', status: 'Ativo', score: 92, phone: '(11) 9xxxx' },
    { name: 'Carlos Santos', email: 'carlos@tech.io', status: 'Ativo', score: 87, phone: '(21) 9xxxx' },
    { name: 'Ana Beatriz', email: 'ana@loja.com', status: 'Inativo', score: 45, phone: '(31) 9xxxx' },
    { name: 'Pedro Lima', email: 'pedro@corp.br', status: 'Ativo', score: 78, phone: '(41) 9xxxx' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-on-dark">Clientes Cadastrados</span>
        <span className="text-[8px] text-primary cursor-pointer">+ Novo cliente</span>
      </div>
      <div className="rounded-lg bg-dark-card overflow-hidden">
        <div className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-dark-border/50">
          {['Nome', 'Email', 'Telefone', 'Score', 'Status'].map(h => (
            <span key={h} className="text-[8px] font-semibold text-on-dark-muted uppercase">{h}</span>
          ))}
        </div>
        {clients.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="grid grid-cols-5 gap-2 px-3 py-2 border-b border-dark-border/30 last:border-0 hover:bg-dark-border/20 transition-colors cursor-pointer">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={8} className="text-primary" />
              </div>
              <span className="text-[9px] text-on-dark">{c.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={8} className="text-on-dark-muted/50" />
              <span className="text-[8px] text-on-dark-muted">{c.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={8} className="text-on-dark-muted/50" />
              <span className="text-[8px] text-on-dark-muted">{c.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={8} className={c.score > 70 ? 'text-accent' : 'text-on-dark-muted/50'} />
              <span className={`text-[9px] font-semibold ${c.score > 70 ? 'text-on-dark' : 'text-on-dark-muted'}`}>{c.score}</span>
            </div>
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium self-center w-fit ${c.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-on-dark-muted/10 text-on-dark-muted'}`}>{c.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportsContent() {
  const bars = [35, 55, 45, 70, 60, 85, 75, 50, 90, 65, 40, 80];
  const metrics = [
    { label: 'Receita Total', value: 'R$ 142.8k', change: '+24%' },
    { label: 'Ticket Médio', value: 'R$ 438', change: '+8%' },
    { label: 'Conversão', value: '3.2%', change: '+0.5%' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="rounded-lg bg-dark-card p-2 text-center">
            <span className="text-[8px] text-on-dark-muted">{m.label}</span>
            <p className="text-sm font-bold text-on-dark">{m.value}</p>
            <span className="text-[8px] text-green-400 font-medium">{m.change}</span>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-lg bg-dark-card p-3">
          <span className="text-[9px] text-on-dark-muted mb-2 block">Faturamento por Mês</span>
          <div className="flex items-end gap-1 h-24">
            {bars.map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(h / 100) * 96}px` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className="flex-1 rounded-sm bg-gradient-to-t from-primary to-accent opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-dark-card p-3 flex flex-col items-center justify-center">
          <PieChart size={40} className="text-primary/60 mb-1" />
          <span className="text-[9px] text-on-dark-muted">Distribuição</span>
          <div className="flex gap-1 mt-1.5">
            {['bg-primary', 'bg-accent', 'bg-green-400'].map((c, i) => (
              <div key={i} className="flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${c}`} />
                <span className="text-[7px] text-on-dark-muted">{['Vendas', 'Serv.', 'Outros'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationContent() {
  const flows = [
    { name: 'Boas-vindas ao cliente', trigger: 'Novo cadastro', steps: 4, status: 'Ativo', icon: Mail },
    { name: 'Follow-up de venda', trigger: 'Pedido criado', steps: 3, status: 'Ativo', icon: ShoppingCart },
    { name: 'Notificação de estoque', trigger: 'Estoque < 10', steps: 2, status: 'Pausado', icon: Bell },
  ];
  const steps = ['Trigger', 'Condição', 'Ação', 'Notificação'];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-dark-card p-3">
        <span className="text-[9px] text-on-dark-muted mb-3 block">Fluxo de Automação</span>
        <div className="flex items-center justify-between px-2">
          {steps.map((step, i) => (
            <motion.div key={step} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}
              className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-primary/20' : i === 1 ? 'bg-accent/20' : i === 2 ? 'bg-green-500/20' : 'bg-primary/10'}`}>
                {i === 0 ? <Zap size={12} className="text-primary" /> :
                 i === 1 ? <GitBranch size={12} className="text-accent" /> :
                 i === 2 ? <CheckCircle2 size={12} className="text-green-400" /> :
                 <Bell size={12} className="text-primary/60" />}
              </div>
              <div><span className="text-[9px] font-medium text-on-dark block">{step}</span></div>
              {i < steps.length - 1 && <ArrowRight size={10} className="text-on-dark-muted/30 ml-1" />}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-dark-card p-3">
        <span className="text-[9px] text-on-dark-muted mb-2 block">Fluxos Configurados</span>
        {flows.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-dark-border/30 last:border-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <f.icon size={10} className="text-primary" />
              </div>
              <div>
                <span className="text-[9px] font-medium text-on-dark block">{f.name}</span>
                <div className="flex items-center gap-1">
                  <Clock size={7} className="text-on-dark-muted/50" />
                  <span className="text-[7px] text-on-dark-muted">{f.trigger}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-on-dark-muted">{f.steps} etapas</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-medium ${f.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-on-dark-muted/10 text-on-dark-muted'}`}>{f.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const tabContentMap: Record<string, () => React.ReactElement> = {
  admin: AdminContent,
  clients: ClientsContent,
  reports: ReportsContent,
  automation: AutomationContent,
};

export default function ImagineSection() {
  const { ref, isVisible } = useScrollReveal();
  const [active, setActive] = useState('admin');
  const activeTab = tabsMeta.find((t) => t.id === active)!;
  const ActiveContent = tabContentMap[active];

  return (
    <section className="py-24 lg:py-32 bg-dark-base relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.p initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">
            Experiência Interativa
          </motion.p>
          <TypeWriter text="Imagine o sistema ideal para você" highlight="ideal para você"
            trigger={isVisible} startDelay={200} speed={40}
            className="font-display text-3xl lg:text-5xl font-bold tracking-tight text-on-dark" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="mt-5 text-lg lg:text-xl font-semibold text-on-dark">
            e nós botamos em prática.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10">
          {tabsMeta.map((tab) => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 border ${
                active === tab.id
                  ? 'bg-gradient-purple text-primary-foreground shadow-glow border-transparent'
                  : 'border-dark-border text-on-dark-muted hover:text-on-dark hover:border-primary/30 bg-dark-surface/50'
              }`}>
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
          className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
          <div className="relative animate-float rounded-2xl overflow-hidden border border-dark-border bg-dark-surface shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <img src={nexarLogo} alt="Nexar" className="w-6 h-6 object-contain" />
                <span className="text-xs font-semibold text-on-dark">{activeTab.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <Search size={12} className="text-on-dark-muted" />
                <div className="relative">
                  <Bell size={12} className="text-on-dark-muted" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
                </div>
                <div className="w-5 h-5 rounded-full bg-primary/30" />
              </div>
            </div>

            <div className="flex">
              <div className="w-12 border-r border-dark-border py-3 flex flex-col items-center gap-3 shrink-0">
                {sidebarIcons.map((Icon, i) => (
                  <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-primary/20' : ''}`}>
                    <Icon size={13} className={i === 0 ? 'text-primary' : 'text-on-dark-muted/50'} />
                  </div>
                ))}
              </div>

              <div className="flex-1 p-5 min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
                    <ActiveContent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="text-center text-[11px] text-on-dark-muted/50 pb-4">
              ↕ Clique nas abas para explorar diferentes tipos de sistema
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
