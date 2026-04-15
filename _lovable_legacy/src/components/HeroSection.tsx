import { useState } from "react"; // v2
import { motion, AnimatePresence } from "framer-motion";
import nexarLogo from "@/assets/nexar-logo.png";
import { ArrowRight, Home, Users, ShoppingCart, BarChart3, Settings, Bell, Search, TrendingUp, TrendingDown } from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Início" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Users, label: "Clientes" },
  { icon: ShoppingCart, label: "Vendas" },
  { icon: Settings, label: "Config" },
];

const stats = [
  { label: "Receita", value: "R$ 25.8k", icon: TrendingUp, change: "+12%" },
  { label: "Clientes", value: "1.25k", icon: Users, change: "+8%" },
  { label: "Vendas", value: "13.7", icon: ShoppingCart, change: "+23%" },
  { label: "Taxa", value: "22.1%", icon: TrendingDown, change: "-2%" },
];

const bars = [40, 65, 35, 80, 55, 90, 70, 50, 85, 60, 45, 75];

const transactions = [
  { name: "Maria Silva", amount: "R$ 1.250", status: "Pendente", color: "bg-primary/20 text-primary" },
  { name: "Gabriel Vitor", amount: "R$ 890", status: "Processando", color: "bg-accent/20 text-accent" },
  { name: "Ana Costa", amount: "R$ 2.100", status: "Aprovado", color: "bg-green-500/20 text-green-400" },
];

function HeroDashboardMockup() {
  const [activeSidebar, setActiveSidebar] = useState(0);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div
      className="w-full rounded-2xl border border-dark-border bg-dark-surface overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
      style={{ transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <img src={nexarLogo} alt="Nexar" className="w-6 h-6 object-contain" />
          <span className="text-xs font-semibold text-on-dark">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="hover:text-primary transition-colors"><Search size={12} className="text-on-dark-muted hover:text-primary transition-colors" /></button>
          <button className="relative hover:text-primary transition-colors">
            <Bell size={12} className="text-on-dark-muted hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </button>
          <div className="w-5 h-5 rounded-full bg-primary/30 hover:bg-primary/50 transition-colors cursor-pointer" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-12 border-r border-dark-border py-3 flex flex-col items-center gap-1 shrink-0">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveSidebar(i)}
              className="group relative"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeSidebar === i
                    ? "bg-primary/20 scale-110"
                    : "hover:bg-dark-card hover:scale-105"
                }`}
              >
                <item.icon
                  size={13}
                  className={`transition-colors duration-300 ${
                    activeSidebar === i ? "text-primary" : "text-on-dark-muted/50 group-hover:text-on-dark-muted"
                  }`}
                />
              </div>
              {/* Tooltip */}
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-dark-card text-[7px] text-on-dark whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 space-y-3 min-h-[240px]">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`rounded-lg bg-dark-card p-2 cursor-pointer transition-all duration-300 ${
                  hoveredStat === i ? "bg-dark-border/50 scale-105 shadow-lg shadow-primary/10" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-on-dark-muted">{stat.label}</span>
                  <stat.icon size={9} className={`transition-colors duration-300 ${hoveredStat === i ? "text-primary" : "text-on-dark-muted/50"}`} />
                </div>
                <p className={`text-xs font-bold transition-colors duration-300 ${hoveredStat === i ? "text-primary" : "text-on-dark"}`}>
                  {stat.value}
                </p>
                <span className={`text-[7px] font-medium ${stat.change.startsWith("+") ? "text-green-400" : "text-accent"}`}>
                  {stat.change}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Chart area */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded-lg bg-dark-card p-2">
              <span className="text-[8px] text-on-dark-muted mb-2 block">Faturamento Mensal</span>
              <div className="flex items-end gap-1 h-16">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 relative group h-full flex items-end"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredBar === i && (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-primary text-[6px] text-primary-foreground font-bold whitespace-nowrap z-10"
                        >
                          R$ {(h * 320).toLocaleString("pt-BR")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(h / 100) * 64}px` }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                      className={`w-full rounded-sm bg-gradient-to-t from-primary to-accent cursor-pointer transition-all duration-200 ${
                        hoveredBar === i ? "opacity-100 scale-x-110" : "opacity-75 hover:opacity-90"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-dark-card p-2 flex flex-col items-center justify-center group cursor-pointer">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="w-12 h-12 rounded-full border-[3px] border-primary border-t-accent flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:border-accent group-hover:border-t-primary"
                style={{ borderTopColor: "hsl(330 80% 60%)" }}
              >
                <span className="text-[10px] font-bold text-on-dark group-hover:text-primary transition-colors duration-300">89%</span>
              </motion.div>
              <span className="text-[7px] text-on-dark-muted mt-1 group-hover:text-on-dark transition-colors">Meta</span>
            </div>
          </div>

          {/* Table preview */}
          <div className="rounded-lg bg-dark-card p-2">
            <span className="text-[8px] text-on-dark-muted mb-1.5 block">Últimas Transações</span>
            {transactions.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`flex items-center justify-between py-1 border-b border-dark-border/50 last:border-0 cursor-pointer rounded px-1 transition-all duration-200 ${
                  hoveredRow === i ? "bg-dark-border/30 scale-[1.02]" : ""
                }`}
              >
                <span className={`text-[8px] transition-colors duration-200 ${hoveredRow === i ? "text-on-dark" : "text-on-dark-muted"}`}>
                  {row.name} – {row.amount}
                </span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded font-medium transition-all duration-200 ${row.color} ${
                  hoveredRow === i ? "scale-110" : ""
                }`}>
                  {row.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onOpenQuestionnaire }: { onOpenQuestionnaire?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-base pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(230_35%_8%)_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>



            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0, 0, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-on-dark mb-6"
            >
              Sistemas sob medida para organizar e{" "}
              <span className="text-gradient">acelerar</span>{" "}
              sua empresa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0, 0, 1] }}
              className="text-lg text-on-dark-muted max-w-lg mb-10 leading-relaxed"
            >
              Desenvolvemos soluções personalizadas para gestão, automação e organização empresarial. Cada sistema é criado do zero para a realidade do seu negócio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.2, 0, 0, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onOpenQuestionnaire}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-purple px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all duration-200 hover:scale-105 hover:opacity-90 active:scale-110"
              >
                Montar Meu Sistema
                <ArrowRight size={16} />
              </button>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-on-dark border border-dark transition-all duration-200 hover:scale-105 hover:bg-dark-card active:scale-110"
              >
                Como Funciona
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="relative"
          >
            <div className="relative animate-float">
              <div className="absolute -inset-8 rounded-3xl bg-primary/15 blur-[50px]" />
              <div className="absolute -inset-16 rounded-full bg-primary/8 blur-[80px]" />
              <div className="relative">
                <HeroDashboardMockup />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
