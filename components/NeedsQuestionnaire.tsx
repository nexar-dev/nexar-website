'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  addLead, checkDuplicate, isInCooldown, getCooldownRemaining,
  isValidEmail, isValidPhone,
} from '@/lib/leads-store';
import {
  BUSINESS_TYPES, OBJECTIVES, FEATURES, USERS_OPTIONS, DEVICES,
  YES_NO_MAYBE, LOGIN_PROFILES, REPORT_TYPES, INTEGRATIONS, PRIORITIES,
  defaultFormData, type LeadFormData,
} from '@/lib/questionnaire-data';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-xl font-bold text-on-dark mb-2">{children}</h3>;
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-on-dark-muted mb-6">{children}</p>;
}

function TextInput({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-dark mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-dark-card border ${error ? 'border-red-500' : 'border-dark'} px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function ChipSelect({ options, selected, onToggle, multi = false }: {
  options: string[]; selected: string | string[]; onToggle: (v: string) => void; multi?: boolean;
}) {
  const isSelected = (o: string) => multi ? (selected as string[]).includes(o) : selected === o;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onToggle(o)}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            isSelected(o)
              ? 'bg-gradient-purple text-primary-foreground shadow-glow'
              : 'bg-dark-card border border-dark text-on-dark-muted hover:text-on-dark hover:border-primary/30'
          }`}
        >
          {isSelected(o) && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
          {o}
        </button>
      ))}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-on-dark mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl bg-dark-card border border-dark px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
      />
    </div>
  );
}

const STEPS = [
  'Dados Iniciais', 'Seu Negócio', 'Objetivos', 'Funcionalidades',
  'Uso e Dispositivos', 'Login e Relatórios', 'Integrações e Prioridade', 'Resumo Final',
];

export default function NeedsQuestionnaire({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<LeadFormData>({ ...defaultFormData });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const toggleArray = (key: keyof LeadFormData, value: string) => {
    const arr = data[key] as string[];
    update(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const validateStep0 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = 'Nome é obrigatório.';
    else if (data.name.trim().length < 3) newErrors.name = 'Nome muito curto.';
    if (!data.company.trim()) newErrors.company = 'Empresa é obrigatória.';
    if (!data.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório.';
    else if (!isValidPhone(data.whatsapp)) newErrors.whatsapp = 'Número de telefone inválido. Use DDD + número.';
    if (!data.email.trim()) newErrors.email = 'Email é obrigatório.';
    else if (!isValidEmail(data.email)) newErrors.email = 'Email inválido. Verifique o formato.';
    if (!data.city_state.trim()) newErrors.city_state = 'Cidade/Estado é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canNext = () => {
    switch (step) {
      case 0: return data.name && data.company && data.whatsapp && data.email && data.city_state;
      case 1: return data.business_type;
      case 2: return data.objectives.length > 0;
      case 3: return data.features.length > 0;
      case 4: return data.users_who_use && data.devices.length > 0;
      case 5: return data.needs_login && data.needs_reports;
      case 6: return data.priority;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (isInCooldown()) {
      const secs = getCooldownRemaining();
      toast.error(`Aguarde ${Math.ceil(secs / 60)} minuto(s) antes de enviar novamente.`);
      return;
    }
    setSubmitting(true);
    try {
      const dupMsg = await checkDuplicate(data.email, data.whatsapp);
      if (dupMsg) { toast.error(dupMsg); setSubmitting(false); return; }
      await addLead(data);
      setSubmitted(true);
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-base flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-primary-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-on-dark mb-3">Necessidades recebidas!</h2>
          <p className="text-on-dark-muted mb-8 leading-relaxed">
            Nossa equipe vai analisar as informações para entender o sistema ideal para sua empresa. Entraremos em contato em breve.
          </p>
          <button onClick={onClose} className="rounded-xl bg-gradient-purple px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:opacity-90 active:scale-110">
            Voltar ao site
          </button>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div><SectionTitle>Dados Iniciais</SectionTitle><SectionDesc>Informações básicas para contato.</SectionDesc>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Nome completo" value={data.name} onChange={(v) => update('name', v)} placeholder="Seu nome" error={errors.name} />
            <TextInput label="Nome da empresa" value={data.company} onChange={(v) => update('company', v)} placeholder="Nome da empresa" error={errors.company} />
            <TextInput label="WhatsApp" value={data.whatsapp} onChange={(v) => update('whatsapp', v)} placeholder="(00) 00000-0000" error={errors.whatsapp} />
            <TextInput label="Email" value={data.email} onChange={(v) => update('email', v)} placeholder="seu@email.com" type="email" error={errors.email} />
            <div className="sm:col-span-2"><TextInput label="Cidade / Estado" value={data.city_state} onChange={(v) => update('city_state', v)} placeholder="São Paulo / SP" error={errors.city_state} /></div>
          </div>
        </div>
      );
      case 1: return (
        <div><SectionTitle>Tipo de Negócio</SectionTitle><SectionDesc>Qual é o segmento da sua empresa?</SectionDesc>
          <ChipSelect options={BUSINESS_TYPES} selected={data.business_type} onToggle={(v) => update('business_type', v)} />
        </div>
      );
      case 2: return (
        <div><SectionTitle>Objetivos do Sistema</SectionTitle><SectionDesc>O que você espera que o sistema resolva? Selecione quantos quiser.</SectionDesc>
          <ChipSelect options={OBJECTIVES} selected={data.objectives} onToggle={(v) => toggleArray('objectives', v)} multi />
        </div>
      );
      case 3: return (
        <div><SectionTitle>Funcionalidades Desejadas</SectionTitle><SectionDesc>Quais funcionalidades seriam ideais?</SectionDesc>
          <ChipSelect options={FEATURES} selected={data.features} onToggle={(v) => toggleArray('features', v)} multi />
        </div>
      );
      case 4: return (
        <div><SectionTitle>Uso e Dispositivos</SectionTitle><SectionDesc>Quem vai usar e em quais dispositivos?</SectionDesc>
          <div className="space-y-6">
            <div><p className="text-sm font-medium text-on-dark mb-3">Quem vai usar o sistema?</p>
              <ChipSelect options={USERS_OPTIONS} selected={data.users_who_use} onToggle={(v) => update('users_who_use', v)} /></div>
            <div><p className="text-sm font-medium text-on-dark mb-3">Em quais dispositivos?</p>
              <ChipSelect options={DEVICES} selected={data.devices} onToggle={(v) => toggleArray('devices', v)} multi /></div>
          </div>
        </div>
      );
      case 5: return (
        <div><SectionTitle>Login e Relatórios</SectionTitle><SectionDesc>Configurações de acesso e análise de dados.</SectionDesc>
          <div className="space-y-6">
            <div><p className="text-sm font-medium text-on-dark mb-3">Precisa de login e controle de acesso?</p>
              <ChipSelect options={YES_NO_MAYBE} selected={data.needs_login} onToggle={(v) => update('needs_login', v)} /></div>
            {data.needs_login === 'Sim' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-medium text-on-dark mb-3">Quais perfis de acesso?</p>
                <ChipSelect options={LOGIN_PROFILES} selected={data.login_profiles} onToggle={(v) => toggleArray('login_profiles', v)} multi />
              </motion.div>
            )}
            <div><p className="text-sm font-medium text-on-dark mb-3">O sistema precisa ter relatórios?</p>
              <ChipSelect options={YES_NO_MAYBE} selected={data.needs_reports} onToggle={(v) => update('needs_reports', v)} /></div>
            {data.needs_reports === 'Sim' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-medium text-on-dark mb-3">Quais tipos de relatórios?</p>
                <ChipSelect options={REPORT_TYPES} selected={data.report_types} onToggle={(v) => toggleArray('report_types', v)} multi />
              </motion.div>
            )}
          </div>
        </div>
      );
      case 6: return (
        <div><SectionTitle>Integrações e Prioridade</SectionTitle><SectionDesc>Últimas informações técnicas.</SectionDesc>
          <div className="space-y-6">
            <div><p className="text-sm font-medium text-on-dark mb-3">O sistema precisa se integrar com algo?</p>
              <ChipSelect options={INTEGRATIONS} selected={data.integrations} onToggle={(v) => toggleArray('integrations', v)} multi /></div>
            <div><p className="text-sm font-medium text-on-dark mb-3">Qual o nível de prioridade?</p>
              <ChipSelect options={PRIORITIES} selected={data.priority} onToggle={(v) => update('priority', v)} /></div>
          </div>
        </div>
      );
      case 7: return (
        <div><SectionTitle>Resumo Final</SectionTitle><SectionDesc>Descreva livremente o que imagina para o sistema.</SectionDesc>
          <div className="space-y-4">
            <TextArea label="O que você gostaria que seu sistema ajudasse a resolver?" value={data.description} onChange={(v) => update('description', v)} placeholder="Descreva de forma simples..." />
            <TextArea label="Existe algo importante que esse sistema deveria ter? (opcional)" value={data.additional_notes} onChange={(v) => update('additional_notes', v)} placeholder="Alguma observação adicional..." />
          </div>
        </div>
      );
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-dark-base flex flex-col">
      <div className="border-b border-dark">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-on-dark">Montar Meu Sistema</span>
          </div>
          <button onClick={onClose} className="text-sm text-on-dark-muted hover:text-on-dark transition-colors">Fechar</button>
        </div>
        <div className="h-1 bg-dark-card">
          <motion.div className="h-full bg-gradient-purple" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 pt-4">
        <p className="text-xs text-on-dark-muted">Etapa {step + 1} de {STEPS.length} — <span className="text-primary">{STEPS[step]}</span></p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-dark">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-on-dark-muted hover:text-on-dark disabled:opacity-30 transition-all">
            <ArrowLeft size={16} /> Voltar
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={handleNext} disabled={!canNext()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-purple px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90 active:scale-110 disabled:opacity-40">
              Próximo <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-purple px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90 active:scale-110 disabled:opacity-40">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Check size={16} /> Enviar Necessidades</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
