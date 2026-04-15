import { useState } from "react";
import nexarLogo from "@/assets/nexar-logo.png";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Home, BarChart3, Users, ShoppingCart, Settings, Bell, Search, TrendingUp } from "lucide-react";

const chartBars = [
  { label: "Jan", h: 45 },
  { label: "Fev", h: 60 },
  { label: "Mar", h: 35 },
  { label: "Abr", h: 75 },
  { label: "Mai", h: 55 },
  { label: "Jun", h: 90 },
  { label: "Jul", h: 70 },
];

const orders = [
  { id: "Pedido #78.07", status: "Aprovado", color: "bg-primary" },
  { id: "Pedido #78.06", status: "Processando", color: "bg-accent" },
  { id: "Pedido #78.05", status: "Pendente", color: "bg-on-dark-muted" },
  { id: "Pedido #78.04", status: "Produzindo", color: "bg-primary/60" },
];

const sidebarIcons = [Home, BarChart3, Users, ShoppingCart, Settings];

function DashboardCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-float rounded-2xl border border-dark-border bg-dark-surface shadow-2xl overflow-hidden ${className}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <img src={nexarLogo} alt="Nexar" className="w-5 h-5 object-contain" />
          <span className="text-[10px] font-semibold text-on-dark">Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <Search size={10} className="text-on-dark-muted" />
          <div className="relative">
            <Bell size={10} className="text-on-dark-muted" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="w-4 h-4 rounded-full bg-primary/30" />
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-10 border-r border-dark-border py-2 flex flex-col items-center gap-2 shrink-0">
          {sidebarIcons.map((Icon, i) => (
            <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center ${i === 0 ? "bg-primary/20" : ""}`}>
              <Icon size={11} className={i === 0 ? "text-primary" : "text-on-dark-muted/50"} />
            </div>
          ))}
        </div>
        <div className="flex-1 p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DemoSection() {
  const { ref, isVisible } = useScrollReveal();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-dark-base relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            className="text-sm font-semibold text-accent uppercase tracking-widest mb-4"
          >
            Demonstrações
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl lg:text-5xl font-bold tracking-tight text-on-dark"
          >
            Interfaces que{" "}
            <span className="text-gradient">impressionam e funcionam.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 - Charts */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <DashboardCard>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-on-dark-muted">Faturamento Mensal</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={9} className="text-green-400" />
                    <span className="text-[8px] text-green-400 font-medium">+18%</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-2">
                  {["Diário", "Mensal", "Anual"].map((t, i) => (
                    <span
                      key={t}
                      className={`text-[8px] px-2 py-1 rounded-md font-medium ${
                        i === 1 ? "bg-primary/20 text-primary" : "bg-dark-card text-on-dark-muted"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-end gap-1.5 h-28">
                  {chartBars.map((bar, i) => (
                    <div
                      key={bar.label}
                      className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === i && (
                        <span className="text-[7px] font-bold text-primary">
                          R$ {(bar.h * 320).toLocaleString("pt-BR")}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={isVisible ? { height: `${(bar.h / 100) * 96}px` } : {}}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                        className={`w-full rounded-md bg-gradient-to-t from-primary to-accent transition-all duration-200 cursor-pointer ${
                          hoveredBar === i ? "opacity-100 scale-x-110" : "opacity-75"
                        }`}
                      />
                      <span className="text-[8px] text-on-dark-muted">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </motion.div>

          {/* Card 2 - Orders list */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <DashboardCard>
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-on-dark">Últimos Pedidos</span>
                  <span className="text-[8px] text-on-dark-muted cursor-pointer hover:text-primary transition-colors">Ver todos →</span>
                </div>
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`flex items-center justify-between py-2 px-2.5 rounded-lg bg-dark-card cursor-pointer transition-all duration-200 ${
                      hoveredRow === i ? "bg-dark-border/40 scale-[1.02]" : ""
                    }`}
                  >
                    <span className={`text-[10px] transition-colors ${hoveredRow === i ? "text-on-dark" : "text-on-dark-muted"}`}>
                      {order.id}
                    </span>
                    <span className={`text-[8px] px-2 py-0.5 rounded-md font-medium ${order.color} text-primary-foreground`}>
                      {order.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
