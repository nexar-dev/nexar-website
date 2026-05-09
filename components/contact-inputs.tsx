"use client";

import { formatBrazilPhoneFromDigits, capBrazilPhoneDigits } from "@/lib/contact-format";

const fieldClass = (hasError: boolean) =>
  `w-full rounded-xl bg-dark-card border ${
    hasError ? "border-red-500" : "border-dark"
  } px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`;

type PhoneFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function PhoneField({
  id,
  label,
  value,
  onChange,
  placeholder = "(00) 00000-0000",
  error,
  disabled,
  autoComplete = "tel-national",
}: PhoneFieldProps) {
  const errId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-on-dark mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="tel"
        name="whatsapp"
        inputMode="numeric"
        autoComplete={autoComplete}
        enterKeyHint="next"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? errId : undefined}
        onChange={(e) => {
          const next = e.target.value;
          const prev = value;
          const prevDigits = prev.replace(/\D/g, "");
          const nextDigits = next.replace(/\D/g, "");

          let digits = nextDigits;
          const deletedOneFromEnd =
            prev.length === next.length + 1 && prev.slice(0, -1) === next;

          if (
            deletedOneFromEnd &&
            nextDigits.length === prevDigits.length &&
            prevDigits.length > 0
          ) {
            digits = prevDigits.slice(0, -1);
          }

          const capped = capBrazilPhoneDigits(digits);
          onChange(formatBrazilPhoneFromDigits(capped));
        }}
        className={fieldClass(hasError)}
      />
      {error ? (
        <p id={errId} className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type EmailFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  preserveCaseOnBlur?: boolean;
  required?: boolean;
};

export function EmailField({
  id,
  label,
  value,
  onChange,
  placeholder = "seu@email.com",
  error,
  disabled,
  autoComplete = "email",
  preserveCaseOnBlur = false,
  required,
}: EmailFieldProps) {
  const errId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-on-dark mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="email"
        name="email"
        inputMode="email"
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect="off"
        required={required}
        spellCheck={false}
        enterKeyHint="next"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (preserveCaseOnBlur) {
            onChange(value.trim());
            return;
          }
          onChange(value.trim().toLowerCase());
        }}
        className={fieldClass(hasError)}
      />
      {error ? (
        <p id={errId} className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
