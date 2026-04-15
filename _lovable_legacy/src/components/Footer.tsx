import { Linkedin, Instagram, Mail, MessageCircle } from "lucide-react";
import nexarLogo from "@/assets/nexar-logo.png";

const links = {
  Navegação: ["Possibilidades", "Como Funciona", "Benefícios"],
  Contato: ["contato@nexar.com.br", "(11) 99999-9999"],
};

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
              {[Linkedin, Instagram, Mail, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-card flex items-center justify-center text-on-dark-muted hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon size={16} />
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
