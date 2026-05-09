import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import validator from "validator";

/** Digits only — used for duplicate checks and RPC. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Formats a string of digits as a Brazilian national phone number while typing. */
export function formatBrazilPhoneFromDigits(digits: string): string {
  const formatter = new AsYouType("BR");
  return formatter.input(digits);
}

/** Caps input length typical for BR (+55 optional). */
export function capBrazilPhoneDigits(digits: string): string {
  if (digits.startsWith("55") && digits.length > 11) {
    return digits.slice(0, 13);
  }
  return digits.slice(0, 11);
}

export function isValidPhone(phone: string): boolean {
  const parsed = parsePhoneNumberFromString(phone, "BR");
  if (!parsed) return false;
  return parsed.isValid() && parsed.country === "BR";
}

export function isValidEmail(email: string): boolean {
  const t = email.trim();
  if (!t) return false;
  return validator.isEmail(t, { allow_utf8_local_part: true });
}

export function normalizeEmailInput(email: string): string {
  return email.trim().toLowerCase();
}
