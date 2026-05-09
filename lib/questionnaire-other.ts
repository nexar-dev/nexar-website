import type { LeadFormData } from "@/lib/questionnaire-data";

/** Rótulo padrão que abre o campo de detalhamento (chips). */
export const QUESTIONNAIRE_OTHER_LABEL = "Outro" as const;

/** Em “Perfis de acesso”, o chip equivalente a “outro”. */
export const QUESTIONNAIRE_OTHER_PROFILES_LABEL = "Outros perfis" as const;

/** Mínimo de caracteres quando a opção “Outro” (ou equivalente) está ativa. */
export const OTHER_DETAILS_MIN_CHARS = 5;

export function selectionIncludesTrigger(
  selected: string | string[],
  triggers: readonly string[],
): boolean {
  if (triggers.length === 0) return false;
  if (typeof selected === "string") return triggers.includes(selected);
  return selected.some((s) => triggers.includes(s));
}

export function validateOtherDetailText(
  text: string,
  whenActive: boolean,
): string | null {
  if (!whenActive) return null;
  const t = text.trim();
  if (t.length < OTHER_DETAILS_MIN_CHARS) {
    return `Use pelo menos ${OTHER_DETAILS_MIN_CHARS} caracteres para detalhar o que você precisa.`;
  }
  return null;
}

type NamedBlock = { heading: string; text: string };

function pushBlock(
  list: NamedBlock[],
  heading: string,
  text: string | undefined,
) {
  const t = text?.trim();
  if (t) list.push({ heading, text: t });
}

/** Bloco anexado em `additional_notes` no envio (sem alterar colunas do Supabase). */
export function formatQuestionnaireOtherDetailsForStorage(
  data: LeadFormData,
): string {
  const blocks: NamedBlock[] = [];

  if (
    data.business_type === QUESTIONNAIRE_OTHER_LABEL &&
    data.business_type_other.trim()
  ) {
    pushBlock(blocks, "Tipo de negócio", data.business_type_other);
  }

  if (
    selectionIncludesTrigger(data.objectives, [QUESTIONNAIRE_OTHER_LABEL]) &&
    data.objectives_other.trim()
  ) {
    pushBlock(blocks, "Objetivos", data.objectives_other);
  }

  if (
    selectionIncludesTrigger(data.features, [QUESTIONNAIRE_OTHER_LABEL]) &&
    data.features_other.trim()
  ) {
    pushBlock(blocks, "Funcionalidades", data.features_other);
  }

  if (
    selectionIncludesTrigger(data.integrations, [QUESTIONNAIRE_OTHER_LABEL]) &&
    data.integrations_other.trim()
  ) {
    pushBlock(blocks, "Integrações", data.integrations_other);
  }

  if (
    data.priority === QUESTIONNAIRE_OTHER_LABEL &&
    data.priority_other.trim()
  ) {
    pushBlock(blocks, "Prioridade", data.priority_other);
  }

  if (
    selectionIncludesTrigger(data.login_profiles, [
      QUESTIONNAIRE_OTHER_PROFILES_LABEL,
    ]) &&
    data.login_profiles_other.trim()
  ) {
    pushBlock(blocks, "Perfis de acesso (outros)", data.login_profiles_other);
  }

  if (!blocks.length) return "";

  const body = blocks
    .map((b) => `• ${b.heading}\n${b.text}`)
    .join("\n\n");
  return `[Detalhes complementares]\n${body}`;
}

/** Erros de validação dos campos “Outro” ao sair da etapa (etapas com chips 1–6, exceto 4). */
export function collectOtherFieldErrorsForStep(
  step: number,
  data: LeadFormData,
): Record<string, string> {
  const e: Record<string, string> = {};

  switch (step) {
    case 1: {
      const msg = validateOtherDetailText(
        data.business_type_other,
        data.business_type === QUESTIONNAIRE_OTHER_LABEL,
      );
      if (msg) e.business_type_other = msg;
      break;
    }
    case 2: {
      const active = selectionIncludesTrigger(data.objectives, [
        QUESTIONNAIRE_OTHER_LABEL,
      ]);
      const msg = validateOtherDetailText(data.objectives_other, active);
      if (msg) e.objectives_other = msg;
      break;
    }
    case 3: {
      const active = selectionIncludesTrigger(data.features, [
        QUESTIONNAIRE_OTHER_LABEL,
      ]);
      const msg = validateOtherDetailText(data.features_other, active);
      if (msg) e.features_other = msg;
      break;
    }
    case 5: {
      const loginActive =
        data.needs_login === "Sim" &&
        selectionIncludesTrigger(data.login_profiles, [
          QUESTIONNAIRE_OTHER_PROFILES_LABEL,
        ]);
      const msgLogin = validateOtherDetailText(
        data.login_profiles_other,
        loginActive,
      );
      if (msgLogin) e.login_profiles_other = msgLogin;
      break;
    }
    case 6: {
      const intActive = selectionIncludesTrigger(data.integrations, [
        QUESTIONNAIRE_OTHER_LABEL,
      ]);
      const msgInt = validateOtherDetailText(data.integrations_other, intActive);
      if (msgInt) e.integrations_other = msgInt;

      const msgPri = validateOtherDetailText(
        data.priority_other,
        data.priority === QUESTIONNAIRE_OTHER_LABEL,
      );
      if (msgPri) e.priority_other = msgPri;
      break;
    }
    default:
      break;
  }

  return e;
}

export function hasBlockingOtherFieldErrors(
  step: number,
  data: LeadFormData,
): boolean {
  return Object.keys(collectOtherFieldErrorsForStep(step, data)).length > 0;
}

/** Valida todos os blocos “Outro” antes do envio (etapas 1–6 relevantes). */
export function collectAllOtherFieldErrors(data: LeadFormData): Record<string, string> {
  return {
    ...collectOtherFieldErrorsForStep(1, data),
    ...collectOtherFieldErrorsForStep(2, data),
    ...collectOtherFieldErrorsForStep(3, data),
    ...collectOtherFieldErrorsForStep(5, data),
    ...collectOtherFieldErrorsForStep(6, data),
  };
}
