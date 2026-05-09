import { supabase } from '@/lib/supabase';
import {
  buildCityStateForLead,
  LEAD_PRIORITY_DB_VALUES,
  type LeadFormData,
} from './questionnaire-data';
import { normalizePhone, normalizeEmailInput } from '@/lib/contact-format';
import { formatQuestionnaireOtherDetailsForStorage } from '@/lib/questionnaire-other';

export { isValidEmail, isValidPhone, normalizePhone } from '@/lib/contact-format';

export interface Lead extends LeadFormData {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const COOLDOWN_KEY = "nexusdev_submit_cooldown";
const COOLDOWN_MS = 2 * 60 * 1000;

export function isInCooldown(): boolean {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return false;
  return Date.now() - parseInt(last, 10) < COOLDOWN_MS;
}

export function getCooldownRemaining(): number {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - parseInt(last, 10));
  return Math.max(0, Math.ceil(remaining / 1000));
}

/** Texto amigável para o tempo restante do cooldown (anti-spam). */
export function formatCooldownWaitMessage(totalSeconds: number): string {
  if (totalSeconds <= 0) return "";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const partM =
    m === 0
      ? ""
      : m === 1
        ? "1 minuto"
        : `${m} minutos`;
  const partS =
    s === 0
      ? ""
      : s === 1
        ? "1 segundo"
        : `${s} segundos`;
  if (partM && partS) {
    return `Aguarde ${partM} e ${partS} antes de enviar novamente.`;
  }
  if (partM) {
    return `Aguarde ${partM} antes de enviar novamente.`;
  }
  return `Aguarde ${partS} antes de enviar novamente.`;
}

export async function checkDuplicate(email: string, whatsapp: string): Promise<string | null> {
  const normalizedPhone = normalizePhone(whatsapp);

  const { data, error } = await supabase.rpc("check_lead_duplicate", {
    _email: normalizeEmailInput(email),
    _whatsapp_digits: normalizedPhone,
  });

  if (error) {
    logPostgrestError("check_lead_duplicate RPC error", error);
    throw new Error(error.message);
  }
  return data as string | null;
}

function logPostgrestError(scope: string, error: { message?: string; details?: string; hint?: string; code?: string }) {
  console.error(`[leads-store] ${scope}`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
}

/**
 * A constraint `leads_priority_check` no Postgres costuma listar só estes quatro valores.
 * Rótulos novos ("Ainda não sei", "Outro") exigem a migration em `supabase/migrations/`.
 * Até lá, gravamos um valor já aceito; detalhes de "Outro" continuam em `additional_notes`.
 */
const LEAD_PRIORITY_LEGACY_SAFE = "Estou pesquisando possibilidades" as const;

const PRIORITY_PASSTHROUGH_NO_MIGRATION = new Set<string>([
  "Quero o quanto antes",
  "Quero entender melhor primeiro",
  "Estou pesquisando possibilidades",
  "Quero desenvolver nos próximos meses",
]);

function priorityForInsert(raw: string): string {
  const v = raw.trim();
  const canonical = new Set<string>([...LEAD_PRIORITY_DB_VALUES]);
  if (!canonical.has(v)) return LEAD_PRIORITY_LEGACY_SAFE;

  const useExpanded =
    process.env.NEXT_PUBLIC_LEADS_PRIORITY_CHECK_EXPANDED === "true";
  if (useExpanded) return v;

  if (PRIORITY_PASSTHROUGH_NO_MIGRATION.has(v)) return v;
  return LEAD_PRIORITY_LEGACY_SAFE;
}

export async function addLead(data: LeadFormData): Promise<Lead> {
  const extraNotes = formatQuestionnaireOtherDetailsForStorage(data);
  const additional_notes = [data.additional_notes.trim(), extraNotes]
    .filter(Boolean)
    .join("\n\n");

  const priority = priorityForInsert(data.priority);

  const { error } = await supabase
    .from("leads")
    .insert({
      name: data.name.trim(),
      company: data.company.trim(),
      whatsapp: data.whatsapp.trim(),
      email: normalizeEmailInput(data.email),
      city_state: buildCityStateForLead(data).trim(),
      business_type: data.business_type,
      objectives: data.objectives ?? [],
      features: data.features ?? [],
      users_who_use: data.users_who_use,
      devices: data.devices ?? [],
      needs_login: data.needs_login,
      login_profiles: data.login_profiles ?? [],
      needs_reports: data.needs_reports,
      report_types: data.report_types ?? [],
      integrations: data.integrations ?? [],
      priority,
      description: data.description.trim(),
      additional_notes: additional_notes.trim(),
    });

  if (error) {
    logPostgrestError("addLead insert failed", error);
    throw new Error(error.message);
  }

  try {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
  } catch (e) {
    console.warn("[leads-store] Could not persist submit cooldown:", e);
  }

  return {
    ...data,
    id: "",
    status: "novo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Lead;
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Lead[];
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function adminLogin(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function adminLogout(): Promise<void> {
  await supabase.auth.signOut();
}
