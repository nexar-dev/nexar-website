'use client';

import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

const nexarLogo = '/assets/nexar-logo.png';

const links = {
  Navegação: ['Possibilidades', 'Como Funciona', 'Benefícios'],
  Contato: ['contato@nexar.com.br', '(11) 99999-9999'],
};

function LinkedinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const socialLinks: { href: string; label: string; node: React.ReactNode }[] = [
  { href: '#', label: 'LinkedIn', node: <LinkedinIcon /> },
  { href: '#', label: 'Instagram', node: <InstagramIcon /> },
  { href: '#', label: 'Email', node: <Mail size={16} /> },
  { href: '#', label: 'WhatsApp', node: <MessageCircle size={16} /> },
];

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={nexarLogo} alt="Nexar" className="w-16 h-16 object-contain" />
              <span className="font-display font-semibold text-lg text-on-dark">
                Nex<span className="text-gradient">ar</span>
              </span>
            </div>
            <p className="text-sm text-on-dark-muted leading-relaxed max-w-sm mb-6">
              Desenvolvemos sistemas personalizados que simplificam a gestão e aceleram o crescimento da sua empresa.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, node }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-dark-card flex items-center justify-center text-on-dark-muted hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {node}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm text-on-dark mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-on-dark-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
