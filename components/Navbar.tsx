"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BackToLandingCta } from "@/components/portfolio/BackToLandingCta";
import { navLinks } from "@/lib/nav-links";

const nexarLogo = "/assets/nexar-logo.png";

export default function Navbar({
  onOpenQuestionnaire,
  ctaVariant = "questionnaire",
}: {
  onOpenQuestionnaire?: () => void;
  /** Portfólio: CTA espelha o Header importado («Voltar ao Início») em vez do questionário. */
  ctaVariant?: "questionnaire" | "back-to-landing";
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortfolioLandingCta = ctaVariant === "back-to-landing";
  const barOpaque = scrolled || isPortfolioLandingCta;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        barOpaque ? "glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={nexarLogo}
              alt="Nexar"
              className="h-10 w-auto object-contain"
            />
            <span
              className={`font-display font-bold text-2xl tracking-tight ${
                barOpaque ? "text-foreground" : "text-on-dark"
              }`}
            >
              Nex<span className="text-gradient">ar</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActivePortfolioNav =
                pathname === "/portfolio" && link.href.startsWith("/portfolio");
              const colorClass = isActivePortfolioNav
                ? barOpaque
                  ? "text-foreground font-semibold"
                  : "text-primary-foreground font-semibold drop-shadow-[0_1px_12px_hsl(var(--purple-glow)/0.35)]"
                : barOpaque
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-on-dark-muted hover:text-primary-foreground";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${colorClass}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isPortfolioLandingCta ? (
              <BackToLandingCta />
            ) : (
              <button
                onClick={onOpenQuestionnaire}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-purple px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:scale-105 hover:opacity-90 active:scale-110"
              >
                Montar Meu Sistema
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-foreground"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => {
                const isActivePortfolioNav =
                  pathname === "/portfolio" &&
                  link.href.startsWith("/portfolio");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-sm font-medium ${
                      isActivePortfolioNav
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isPortfolioLandingCta ? (
                <div className="mt-2 flex justify-center">
                  <BackToLandingCta
                    onNavigate={() => setMobileOpen(false)}
                    className="w-full sm:w-auto"
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenQuestionnaire?.();
                  }}
                  className="block w-full text-center rounded-lg bg-gradient-purple px-5 py-2.5 text-sm font-medium text-primary-foreground mt-2"
                >
                  Montar Meu Sistema
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
