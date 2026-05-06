import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfólio — Nexar',
  description:
    'Cases e sistemas sob medida desenvolvidos pela Nexar. PropTech, HealthTech e operações com performance real.',
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
