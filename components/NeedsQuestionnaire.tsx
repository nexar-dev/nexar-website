"use client";

import { useCallback, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  addLead,
  checkDuplicate,
  formatCooldownWaitMessage,
  getCooldownRemaining,
  isInCooldown,
  isValidEmail,
  isValidPhone,
} from "@/lib/leads-store";
import {
  BUSINESS_TYPES,
  OBJECTIVES,
  FEATURES,
  USERS_OPTIONS,
  DEVICES,
  YES_NO_MAYBE,
  LOGIN_PROFILES,
  REPORT_TYPES,
  INTEGRATIONS,
  PRIORITIES,
  defaultFormData,
  type LeadFormData,
} from "@/lib/questionnaire-data";
import {
  QUESTIONNAIRE_OTHER_LABEL,
  QUESTIONNAIRE_OTHER_PROFILES_LABEL,
  collectAllOtherFieldErrors,
  collectOtherFieldErrorsForStep,
  hasBlockingOtherFieldErrors,
  selectionIncludesTrigger,
} from "@/lib/questionnaire-other";
import { PhoneField, EmailField } from "@/components/contact-inputs";
import {
  LeadLocationFields,
  type BrazilCitiesStatus,
} from "@/components/LeadLocationFields";
import { OtherOptionTextarea } from "@/components/questionnaire/OtherOptionTextarea";

function formatQuestionnaireSubmitError(err: unknown): string {
  console.error("[NeedsQuestionnaire] Envio falhou:", err);
  if (err instanceof Error && err.message.trim()) {
    const m = err.message.trim();
    const display = m.length > 320 ? `${m.slice(0, 317)}…` : m;
    return `Não foi possível enviar: ${display}`;
  }
  return "Não foi possível enviar. Tente novamente em instantes.";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-xl font-bold text-on-dark mb-2">
      {children}
    </h3>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-on-dark-muted mb-6">{children}</p>;
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-on-dark mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errId : undefined}
        className={`w-full rounded-xl bg-dark-card border ${
          error ? "border-red-500" : "border-dark"
        } px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
      />
      {error ? (
        <p id={errId} className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChipSelect({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: readonly string[];
  selected: string | string[];
  onToggle: (v: string) => void;
  multi?: boolean;
}) {
  const isSelected = (o: string) =>
    multi ? (selected as string[]).includes(o) : selected === o;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={isSelected(o)}
          onClick={() => onToggle(o)}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            isSelected(o)
              ? "bg-gradient-purple text-primary-foreground shadow-glow"
              : "bg-dark-card border border-dark text-on-dark-muted hover:text-on-dark hover:border-primary/30"
          }`}
        >
          {isSelected(o) && (
            <Check size={14} className="inline mr-1.5 -mt-0.5" aria-hidden />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-on-dark mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={id}
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
  "Dados Iniciais",
  "Seu Negócio",
  "Objetivos",
  "Funcionalidades",
  "Uso e Dispositivos",
  "Login e Relatórios",
  "Integrações e Prioridade",
  "Resumo Final",
];

export default function NeedsQuestionnaire({
  onClose,
}: {
  onClose: () => void;
}) {
  const phoneFieldId = useId();
  const emailFieldId = useId();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<LeadFormData>({ ...defaultFormData });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brCitiesStatus, setBrCitiesStatus] = useState<BrazilCitiesStatus>({
    loading: false,
    error: null,
  });

  const mergeData = useCallback((partial: Partial<LeadFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    const keys = Object.keys(partial) as (keyof LeadFormData)[];
    if (keys.length) {
      setErrors((prev) => {
        const next = { ...prev };
        for (const k of keys) next[k as string] = "";
        return next;
      });
    }
  }, []);

  const update = <K extends keyof LeadFormData>(
    key: K,
    value: LeadFormData[K],
  ) => {
    mergeData({ [key]: value } as Partial<LeadFormData>);
  };

  const toggleArray = (key: keyof LeadFormData, value: string) => {
    setData((prev) => {
      const arr = prev[key] as string[];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: next };
    });
    setErrors((prev) => ({ ...prev, [key.toString()]: "" }));
  };

  const validateStep0 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Nome é obrigatório.";
    else if (data.name.trim().length < 3) newErrors.name = "Nome muito curto.";
    if (!data.company.trim()) newErrors.company = "Empresa é obrigatória.";
    if (!data.whatsapp.trim()) newErrors.whatsapp = "WhatsApp é obrigatório.";
    else if (!isValidPhone(data.whatsapp))
      newErrors.whatsapp =
        "Informe um número válido no Brasil (DDD + celular ou fixo).";
    if (!data.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!isValidEmail(data.email))
      newErrors.email = "Email inválido. Verifique o formato.";

    if (!data.not_from_brazil) {
      if (!data.brazil_state_uf.trim())
        newErrors.brazil_state_uf = "Selecione o estado.";
      if (!data.brazil_city.trim())
        newErrors.brazil_city = "Selecione a cidade.";
      if (brCitiesStatus.loading && data.brazil_state_uf.trim()) {
        newErrors.brazil_city = "Aguarde o carregamento das cidades.";
      }
      if (
        brCitiesStatus.error &&
        data.brazil_state_uf.trim() &&
        !newErrors.brazil_city
      ) {
        newErrors.brazil_city = brCitiesStatus.error;
      }
    } else {
      if (!data.international_country.trim())
        newErrors.international_country = "Informe o país.";
      if (!data.international_city.trim())
        newErrors.international_city = "Informe a cidade.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const step0Complete = (): boolean => {
    if (
      !data.name.trim() ||
      !data.company.trim() ||
      !data.whatsapp.trim() ||
      !data.email.trim() ||
      !isValidPhone(data.whatsapp) ||
      !isValidEmail(data.email)
    ) {
      return false;
    }
    if (!data.not_from_brazil) {
      if (!data.brazil_state_uf.trim() || !data.brazil_city.trim())
        return false;
      if (brCitiesStatus.loading) return false;
      if (brCitiesStatus.error) return false;
      return true;
    }
    return (
      Boolean(data.international_country.trim()) &&
      Boolean(data.international_city.trim())
    );
  };

  const canNext = () => {
    switch (step) {
      case 0:
        return step0Complete();
      case 1:
        return (
          Boolean(data.business_type) && !hasBlockingOtherFieldErrors(1, data)
        );
      case 2:
        return (
          data.objectives.length > 0 && !hasBlockingOtherFieldErrors(2, data)
        );
      case 3:
        return (
          data.features.length > 0 && !hasBlockingOtherFieldErrors(3, data)
        );
      case 4:
        return Boolean(data.users_who_use) && data.devices.length > 0;
      case 5:
        return (
          Boolean(data.needs_login) &&
          Boolean(data.needs_reports) &&
          !hasBlockingOtherFieldErrors(5, data)
        );
      case 6:
        return Boolean(data.priority) && !hasBlockingOtherFieldErrors(6, data);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    if (step >= 1 && step <= 6) {
      const otherErrs = collectOtherFieldErrorsForStep(step, data);
      if (Object.keys(otherErrs).length) {
        setErrors((prev) => ({ ...prev, ...otherErrs }));
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (isInCooldown()) {
      const secs = getCooldownRemaining();
      toast.error(formatCooldownWaitMessage(secs));
      return;
    }
    setSubmitting(true);
    try {
      const allOtherErrs = collectAllOtherFieldErrors(data);
      if (Object.keys(allOtherErrs).length) {
        setErrors((prev) => ({ ...prev, ...allOtherErrs }));
        toast.error(
          'Revise os campos abaixo das opções "Outro" antes de enviar.',
        );
        setSubmitting(false);
        return;
      }
      const dupMsg = await checkDuplicate(data.email, data.whatsapp);
      if (dupMsg) {
        toast.error(dupMsg);
        setSubmitting(false);
        return;
      }
      await addLead(data);
      setSubmitted(true);
    } catch (err) {
      toast.error(formatQuestionnaireSubmitError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-base flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-primary-foreground" aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-bold text-on-dark mb-3">
            Necessidades recebidas!
          </h2>
          <p className="text-on-dark-muted mb-8 leading-relaxed">
            Nossa equipe vai analisar as informações para entender o sistema
            ideal para sua empresa. Entraremos em contato em breve.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gradient-purple px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 hover:opacity-90 active:scale-110"
          >
            Voltar ao site
          </button>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <SectionTitle>Dados Iniciais</SectionTitle>
            <SectionDesc>Informações básicas para contato.</SectionDesc>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextInput
                label="Nome completo"
                value={data.name}
                onChange={(v) => update("name", v)}
                placeholder="Seu nome"
                error={errors.name}
              />
              <TextInput
                label="Nome da empresa"
                value={data.company}
                onChange={(v) => update("company", v)}
                placeholder="Nome da empresa"
                error={errors.company}
              />
              <PhoneField
                id={phoneFieldId}
                label="WhatsApp"
                value={data.whatsapp}
                onChange={(v) => update("whatsapp", v)}
                error={errors.whatsapp}
              />
              <EmailField
                id={emailFieldId}
                label="Email"
                value={data.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
              />
              <LeadLocationFields
                key={`loc-${data.not_from_brazil}-${data.brazil_state_uf}`}
                data={data}
                mergeData={mergeData}
                errors={errors}
                onBrazilFetchStatus={setBrCitiesStatus}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <SectionTitle>Tipo de Negócio</SectionTitle>
            <SectionDesc>Qual é o segmento da sua empresa?</SectionDesc>
            <ChipSelect
              options={BUSINESS_TYPES}
              selected={data.business_type}
              onToggle={(v) => update("business_type", v)}
            />
            <OtherOptionTextarea
              show={data.business_type === QUESTIONNAIRE_OTHER_LABEL}
              value={data.business_type_other}
              onChange={(v) => update("business_type_other", v)}
              error={errors.business_type_other}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <SectionTitle>Objetivos do Sistema</SectionTitle>
            <SectionDesc>
              O que você espera que o sistema resolva? Selecione quantos quiser.
            </SectionDesc>
            <ChipSelect
              options={OBJECTIVES}
              selected={data.objectives}
              onToggle={(v) => toggleArray("objectives", v)}
              multi
            />
            <OtherOptionTextarea
              show={selectionIncludesTrigger(data.objectives, [
                QUESTIONNAIRE_OTHER_LABEL,
              ])}
              value={data.objectives_other}
              onChange={(v) => update("objectives_other", v)}
              error={errors.objectives_other}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <SectionTitle>Funcionalidades Desejadas</SectionTitle>
            <SectionDesc>Quais funcionalidades seriam ideais?</SectionDesc>
            <ChipSelect
              options={FEATURES}
              selected={data.features}
              onToggle={(v) => toggleArray("features", v)}
              multi
            />
            <OtherOptionTextarea
              show={selectionIncludesTrigger(data.features, [
                QUESTIONNAIRE_OTHER_LABEL,
              ])}
              value={data.features_other}
              onChange={(v) => update("features_other", v)}
              error={errors.features_other}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <SectionTitle>Uso e Dispositivos</SectionTitle>
            <SectionDesc>Quem vai usar e em quais dispositivos?</SectionDesc>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  Quem vai usar o sistema?
                </p>
                <ChipSelect
                  options={USERS_OPTIONS}
                  selected={data.users_who_use}
                  onToggle={(v) => update("users_who_use", v)}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  Em quais dispositivos?
                </p>
                <ChipSelect
                  options={DEVICES}
                  selected={data.devices}
                  onToggle={(v) => toggleArray("devices", v)}
                  multi
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <SectionTitle>Login e Relatórios</SectionTitle>
            <SectionDesc>
              Configurações de acesso e análise de dados.
            </SectionDesc>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  Precisa de login e controle de acesso?
                </p>
                <ChipSelect
                  options={YES_NO_MAYBE}
                  selected={data.needs_login}
                  onToggle={(v) => update("needs_login", v)}
                />
              </div>
              {data.needs_login === "Sim" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-medium text-on-dark mb-3">
                    Quais perfis de acesso?
                  </p>
                  <ChipSelect
                    options={LOGIN_PROFILES}
                    selected={data.login_profiles}
                    onToggle={(v) => toggleArray("login_profiles", v)}
                    multi
                  />
                  <OtherOptionTextarea
                    show={
                      data.needs_login === "Sim" &&
                      selectionIncludesTrigger(data.login_profiles, [
                        QUESTIONNAIRE_OTHER_PROFILES_LABEL,
                      ])
                    }
                    value={data.login_profiles_other}
                    onChange={(v) => update("login_profiles_other", v)}
                    error={errors.login_profiles_other}
                    description="Especifique os perfis ou papéis de acesso que não estavam na lista."
                  />
                </motion.div>
              )}
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  O sistema precisa ter relatórios?
                </p>
                <ChipSelect
                  options={YES_NO_MAYBE}
                  selected={data.needs_reports}
                  onToggle={(v) => update("needs_reports", v)}
                />
              </div>
              {data.needs_reports === "Sim" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-medium text-on-dark mb-3">
                    Quais tipos de relatórios?
                  </p>
                  <ChipSelect
                    options={REPORT_TYPES}
                    selected={data.report_types}
                    onToggle={(v) => toggleArray("report_types", v)}
                    multi
                  />
                </motion.div>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <SectionTitle>Integrações e Prioridade</SectionTitle>
            <SectionDesc>Últimas informações técnicas.</SectionDesc>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  O sistema precisa se integrar com algo?
                </p>
                <ChipSelect
                  options={INTEGRATIONS}
                  selected={data.integrations}
                  onToggle={(v) => toggleArray("integrations", v)}
                  multi
                />
                <OtherOptionTextarea
                  show={selectionIncludesTrigger(data.integrations, [
                    QUESTIONNAIRE_OTHER_LABEL,
                  ])}
                  value={data.integrations_other}
                  onChange={(v) => update("integrations_other", v)}
                  error={errors.integrations_other}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-on-dark mb-3">
                  Qual o nível de prioridade?
                </p>
                <ChipSelect
                  options={PRIORITIES}
                  selected={data.priority}
                  onToggle={(v) => update("priority", v)}
                />
                <OtherOptionTextarea
                  show={data.priority === QUESTIONNAIRE_OTHER_LABEL}
                  value={data.priority_other}
                  onChange={(v) => update("priority_other", v)}
                  error={errors.priority_other}
                />
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <SectionTitle>Resumo Final</SectionTitle>
            <p
              className="mt-1 max-w-2xl text-sm sm:text-base font-medium text-on-dark leading-relaxed mb-6"
              role="status"
            >
              Obrigado! Isso nos ajudou a ter uma ideia inicial do seu sistema.
              Envie este formulário e entraremos em contato dentro de 24h.
            </p>
            <TextArea
              label="Há mais alguma informação relevante para compartilhar? (opcional)"
              value={data.additional_notes}
              onChange={(v) => update("additional_notes", v)}
              placeholder="Alguma observação adicional..."
            />
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
              <Sparkles
                size={16}
                className="text-primary-foreground"
                aria-hidden
              />
            </div>
            <span className="font-display font-semibold text-on-dark">
              Montar Meu Sistema
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-on-dark-muted hover:text-on-dark transition-colors"
          >
            Fechar
          </button>
        </div>
        <div className="h-1 bg-dark-card">
          <motion.div
            className="h-full bg-gradient-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 pt-4">
        <p className="text-xs text-on-dark-muted">
          Etapa {step + 1} de {STEPS.length} —{" "}
          <span className="text-primary">{STEPS[step]}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-dark">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-on-dark-muted hover:text-on-dark disabled:opacity-30 transition-all"
          >
            <ArrowLeft size={16} aria-hidden /> Voltar
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-purple px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90 active:scale-110 disabled:opacity-40"
            >
              Próximo <ArrowRight size={16} aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-purple px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90 active:scale-110 disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />{" "}
                  Enviando...
                </>
              ) : (
                <>
                  <Check size={16} aria-hidden /> Enviar Necessidades
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
