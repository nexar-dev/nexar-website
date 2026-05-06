import Link from 'next/link';

type Props = {
  onNavigate?: () => void;
  className?: string;
};

/** CTA do Header do portfólio importado: mesmas classes, destino na landing. */
export function BackToLandingCta({ onNavigate, className = '' }: Props) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-4 py-2 text-[13px] font-medium text-foreground/80 transition-all duration-300 hover:border-foreground/20 hover:bg-background hover:text-foreground ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
      <span>Voltar ao Início</span>
    </Link>
  );
}
