import { supabase } from '@/lib/supabase';
import type { LeadFormData } from './questionnaire-data';

export interface Lead extends LeadFormData {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const COOLDOWN_KEY = "nexusdev_submit_cooldown";
const COOLDOWN_MS = 5 * 60 * 1000;

export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

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

export async function checkDuplicate(email: string, whatsapp: string): Promise<string | null> {
  const normalizedPhone = normalizePhone(whatsapp);

  const { data, error } = await supabase.rpc("check_lead_duplicate", {
    _email: email.trim().toLowerCase(),
    _whatsapp_digits: normalizedPhone,
  });

  if (error) throw new Error(error.message);
  return data as string | null;
}

export async function addLead(data: LeadFormData): Promise<Lead> {
  localStorage.setItem(COOLDOWN_KEY, Date.now().toString());

  const { error } = await supabase
    .from("leads")
    .insert({
      name: data.name.trim(),
      company: data.company.trim(),
      whatsapp: data.whatsapp.trim(),
      email: data.email.trim().toLowerCase(),
      city_state: data.city_state.trim(),
      business_type: data.business_type,
      objectives: data.objectives,
      features: data.features,
      users_who_use: data.users_who_use,
      devices: data.devices,
      needs_login: data.needs_login,
      login_profiles: data.login_profiles,
      needs_reports: data.needs_reports,
      report_types: data.report_types,
      integrations: data.integrations,
      priority: data.priority,
      description: data.description.trim(),
      additional_notes: data.additional_notes.trim(),
    });

  if (error) throw new Error(error.message);
  return { ...data, id: "", status: "novo", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Lead;
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
