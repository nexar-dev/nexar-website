import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-base">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-display font-bold text-on-dark">404</h1>
        <p className="mb-4 text-xl text-on-dark-muted">Página não encontrada</p>
        <Link href="/" className="text-primary underline hover:text-primary/90 transition-colors">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
