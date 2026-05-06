"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageCircle } from "lucide-react";
import { navLinks } from "@/lib/nav-links";

const nexarLogo = "/assets/nexar-logo.png";

const contactLinks = [
  {
    label: "contato@nexar.com.br",
    href: "mailto:contato@nexar.com.br",
  },
  {
    label: "(12) 99769-2740",
    href: "tel:+5512997692740",
  },
] as const;

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const socialLinks: { href: string; label: string; node: React.ReactNode }[] = [
  { href: "#", label: "LinkedIn", node: <LinkedinIcon /> },
  { href: "#", label: "Instagram", node: <InstagramIcon /> },
  { href: "mailto:contato@nexar.com.br", label: "Email", node: <Mail size={16} /> },
  {
    href: "https://wa.me/5512997692740",
    label: "WhatsApp",
    node: <MessageCircle size={16} />,
  },
];

/**
 * Mesmo padrão da Navbar sobre fundo escuro (hero, barra transparente):
 * `text-on-dark-muted` → `hover:text-primary-foreground` com `duration-200`.
 */
const footerInsetLinkClass =
  "-mx-1 inline-flex max-w-fit rounded-md px-1 py-1 text-sm font-medium text-on-dark-muted transition-colors duration-200 hover:text-primary-foreground motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--dark-surface))]";



export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-dark-surface border-t border-dark py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={nexarLogo}
                alt="Nexar"
                className="w-16 h-16 object-contain"
              />
              <span className="font-display font-semibold text-lg text-on-dark">
                Nex<span className="text-gradient">ar</span>
              </span>
            </div>
            <p className="text-sm text-on-dark-muted leading-relaxed max-w-sm mb-6">
              Desenvolvemos sistemas personalizados que simplificam a gestão e
              aceleram o crescimento da sua empresa.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, node }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-lg bg-dark-card flex items-center justify-center text-on-dark-muted hover:text-primary hover:bg-primary/10 transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--dark-surface))]"
                >
                  {node}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 id="footer-nav-heading" className="font-display font-semibold text-sm text-on-dark mb-4">
              Navegação
            </h4>
            <nav aria-labelledby="footer-nav-heading">
              <ul className="flex flex-col gap-2">
                {navLinks.map(({ label, href }) => {
                  const isActive =
                    pathname === "/portfolio" && href.startsWith("/portfolio");

                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`${footerInsetLinkClass}${isActive ? " font-semibold text-primary-foreground" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div>
            <h4 id="footer-contact-heading" className="font-display font-semibold text-sm text-on-dark mb-4">
              Contato
            </h4>
            <ul className="flex flex-col gap-2" aria-labelledby="footer-contact-heading">
              {contactLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className={footerInsetLinkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-dark-muted">
            © {new Date().getFullYear()} Nexar. Todos os direitos reservados.
          </p>
          <p className="text-xs text-on-dark-muted">
            Feito com dedicação pela equipe Nexar.
          </p>
        </div>
      </div>
    </footer>
  );
}
