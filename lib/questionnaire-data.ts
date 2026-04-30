export const BUSINESS_TYPES = [
  "Comércio", "Prestação de serviço", "Clínica", "Imobiliária",
  "Indústria", "Restaurante / alimentação", "Escritório / administrativo",
  "Educacional", "Outro"
];

export const OBJECTIVES = [
  "Organizar processos", "Controlar clientes", "Controlar vendas",
  "Controlar estoque", "Automatizar tarefas", "Gerar relatórios",
  "Organizar agenda", "Controlar equipe", "Centralizar informações",
  "Melhorar atendimento", "Outro"
];

export const FEATURES = [
  "Cadastro de clientes", "Cadastro de produtos", "Cadastro de serviços",
  "Agenda / agendamentos", "Controle financeiro", "Controle de estoque",
  "Gestão de vendas", "Relatórios e dashboards", "Área administrativa",
  "Login de usuários", "Níveis de acesso", "Geração de PDF",
  "Upload de arquivos", "Notificações automáticas", "Integração com WhatsApp",
  "Integração com email", "Painel de métricas", "Histórico de atendimentos",
  "Área para equipe", "Área para clientes", "Automação de processos", "Outro"
];

export const USERS_OPTIONS = [
  "Apenas eu", "Minha equipe interna", "Minha equipe e meus clientes",
  "Vendedores / colaboradores externos", "Administrativo e operacional", "Outro"
];

export const DEVICES = ["Computador", "Celular", "Tablet", "Todos"];

export const YES_NO_MAYBE = ["Sim", "Não", "Talvez"];

export const LOGIN_PROFILES = ["Administrador", "Funcionário", "Cliente", "Gestor", "Outros perfis"];

export const REPORT_TYPES = [
  "Relatórios financeiros", "Relatórios de atendimento", "Relatórios de vendas",
  "Relatórios de produtividade", "Dashboard visual", "Exportação em PDF ou Excel"
];

export const INTEGRATIONS = [
  "WhatsApp", "Email", "Planilhas", "API externa",
  "Gateway de pagamento", "Sistema já existente", "Não sei ainda", "Outro"
];

export const PRIORITIES = [
  "Quero o quanto antes", "Quero entender melhor primeiro",
  "Estou pesquisando possibilidades", "Quero desenvolver nos próximos meses"
];

export const LEAD_STATUSES = [
  "novo", "em análise", "contato realizado", "proposta enviada", "encerrado"
];

export interface LeadFormData {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  city_state: string;
  business_type: string;
  objectives: string[];
  features: string[];
  users_who_use: string;
  devices: string[];
  needs_login: string;
  login_profiles: string[];
  needs_reports: string;
  report_types: string[];
  integrations: string[];
  priority: string;
  description: string;
  additional_notes: string;
}

export const defaultFormData: LeadFormData = {
  name: "", company: "", whatsapp: "", email: "", city_state: "",
  business_type: "", objectives: [], features: [], users_who_use: "",
  devices: [], needs_login: "", login_profiles: [], needs_reports: "",
  report_types: [], integrations: [], priority: "", description: "",
  additional_notes: "",
};
