export const BUSINESS_TYPES = [
  "Comércio",
  "Prestação de serviço",
  "Clínica",
  "Imobiliária",
  "Indústria",
  "Restaurante / alimentação",
  "Escritório / administrativo",
  "Educacional",
  "Outro",
];

export const OBJECTIVES = [
  "Organizar processos",
  "Controlar clientes",
  "Controlar vendas",
  "Controlar estoque",
  "Automatizar tarefas",
  "Gerar relatórios",
  "Organizar agenda",
  "Controlar equipe",
  "Centralizar informações",
  "Melhorar atendimento",
  "Outro",
  "Não sei ao certo",
];

export const FEATURES = [
  "Cadastro de clientes",
  "Cadastro de produtos",
  "Cadastro de serviços",
  "Agenda e agendamentos",
  "Gestão financeira",
  "Controle de estoque",
  "Gestão de vendas",
  "Relatórios e dashboards",
  "Gestão de usuários e níveis de acesso",
  "Área administrativa",
  "Área da equipe",
  "Área do cliente",
  "Histórico de atendimentos",
  "Upload de arquivos",
  "Geração de PDF",
  "Notificações automáticas",
  "Integração com WhatsApp",
  "Integração com email",
  "Automação de processos",
  "Painel de métricas",
  "Login/autenticação",
  "Outro",
  "Não sei ao certo",
];

export const USERS_OPTIONS = [
  "Apenas eu",
  "Minha equipe interna",
  "Minha equipe e meus clientes",
  "Vendedores / colaboradores externos",
  "Administrativo e operacional",
  "Não sei ao certo",
];

export const DEVICES = ["Computador", "Celular", "Tablet", "Todos"];

export const YES_NO_MAYBE = ["Sim", "Não", "Talvez"];

export const LOGIN_PROFILES = [
  "Administrador",
  "Funcionário",
  "Cliente",
  "Gestor",
  "Outros perfis",
];

export const REPORT_TYPES = [
  "Relatórios financeiros",
  "Relatórios de atendimento",
  "Relatórios de vendas",
  "Relatórios de produtividade",
  "Dashboard visual",
  "Exportação em PDF ou Excel",
];

export const INTEGRATIONS = [
  "WhatsApp",
  "Email",
  "Planilhas",
  "API externa",
  "Gateway de pagamento",
  "Sistema já existente",
  "Ainda não sei",
  "Outro",
];

/**
 * Valores exatos de `leads.priority` no Postgres.
 * Deve coincidir com a constraint `leads_priority_check` (ver migration em supabase/migrations).
 */
export const LEAD_PRIORITY_DB_VALUES = [
  "Quero o quanto antes",
  "Quero entender melhor primeiro",
  "Estou pesquisando possibilidades",
  "Quero desenvolver nos próximos meses",
  "Ainda não sei",
  "Outro",
] as const;

/** Opções exibidas na etapa de prioridade (mesma ordem dos valores persistidos). */
export const PRIORITIES: readonly string[] = [...LEAD_PRIORITY_DB_VALUES];

export const LEAD_STATUSES = [
  "novo",
  "em análise",
  "contato realizado",
  "proposta enviada",
  "encerrado",
];

export interface LeadFormData {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  /** Linha persistida (ex.: "Campinas / SP" ou "Lisboa / Portugal"). */
  city_state: string;
  not_from_brazil: boolean;
  brazil_state_uf: string;
  brazil_city: string;
  international_country: string;
  international_city: string;
  business_type: string;
  /** Preenchido quando `business_type === "Outro"`. */
  business_type_other: string;
  objectives: string[];
  objectives_other: string;
  features: string[];
  features_other: string;
  users_who_use: string;
  devices: string[];
  needs_login: string;
  login_profiles: string[];
  /** Quando inclui "Outros perfis". */
  login_profiles_other: string;
  needs_reports: string;
  report_types: string[];
  integrations: string[];
  integrations_other: string;
  priority: string;
  priority_other: string;
  description: string;
  additional_notes: string;
}

export function buildCityStateForLead(data: LeadFormData): string {
  if (data.not_from_brazil) {
    return `${data.international_city.trim()} / ${data.international_country.trim()}`;
  }
  return `${data.brazil_city.trim()} / ${data.brazil_state_uf.trim()}`;
}

export const defaultFormData: LeadFormData = {
  name: "",
  company: "",
  whatsapp: "",
  email: "",
  city_state: "",
  not_from_brazil: false,
  brazil_state_uf: "",
  brazil_city: "",
  international_country: "",
  international_city: "",
  business_type: "",
  business_type_other: "",
  objectives: [],
  objectives_other: "",
  features: [],
  features_other: "",
  users_who_use: "",
  devices: [],
  needs_login: "",
  login_profiles: [],
  login_profiles_other: "",
  needs_reports: "",
  report_types: [],
  integrations: [],
  integrations_other: "",
  priority: "",
  priority_other: "",
  description: "",
  additional_notes: "",
};
