export type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description?: string;
  gallery?: string[];
};

export const projects: Project[] = [
  {
    id: "proptech-vendas",
    title: "Sistema de venda de imóveis",
    category: "PropTech · Marketplace",
    image: "/assets/project-1.jpg",
    gallery: [
      "/assets/project-1.jpg",
      "/assets/project-12.jpg",
      "/assets/project-13.jpg",
    ],
    tags: ["React", "TypeScript", "Node.js", "Supabase"],
    description:
      "Plataforma de vendas de imóveis. Feita sob o nome da empresa Elevvo.",
  },
  {
    id: "healthtech-assinatura",
    title: "Site de plano de assinatura estética",
    category: "HealthTech · Subscription",
    image: "/assets/project-2.jpg",
    gallery: [
      "/assets/project-2.jpg",
      "/assets/project-22.jpg",
      "/assets/project-23.jpg",
    ],
    tags: ["React", "TypeScript", "Node.js", "Supabase"],
    description:
      "Plataforma para vendas de planos estéticos. Feita sob o nome da empresa Elevvo.",
  },
  {
    id: "ops-estoque-agenda",
    title: "Gerenciamento de estoque/Agenda",
    category: "Operations · Dashboard",
    image: "/assets/project-3.jpg",
    gallery: [
      "/assets/project-3.jpg",
      "/assets/project-32.jpg",
      "/assets/project-33.jpg",
    ],
    tags: ["Automação", "React", "TypeScript", "Node.js", "Supabase"],
    description:
      "Sistema para gerenciamento organizacional de empresas. Feito sob o nome da empresa Elevvo.",
  },
  {
    id: "em-breve-1",
    title: "Projeto em Desenvolvimento",
    category: "Em Breve",
    image: "/assets/project-4.jpg",
    tags: ["React", "TypeScript"],
    description: "Mais detalhes em breve...",
  },
  {
    id: "em-breve-2",
    title: "Projeto em Desenvolvimento",
    category: "Em Breve",
    image: "/assets/project-5.jpg",
    tags: ["React", "TypeScript"],
    description: "Mais detalhes em breve...",
  },
];
