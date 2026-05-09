"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";

const textareaClassName =
  "w-full min-h-[8.5rem] rounded-xl bg-dark-card border border-dark px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y";

type OtherOptionTextareaProps = {
  show: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Texto curto após o label (ex.: contexto da etapa). */
  description?: string;
};

const LABEL = "Descreva o que você precisa";
const PLACEHOLDER =
  "Explique funcionalidades, processos ou necessidades que não encontrou nas opções acima...";

/**
 * Campo expansível quando uma opção “Outro” (ou rótulo configurado) está selecionada.
 * Mantém o mesmo visual dos demais campos do questionário.
 */
export function OtherOptionTextarea({
  show,
  value,
  onChange,
  error,
  description = "Use o espaço abaixo para detalhar o sistema ou a necessidade que não apareceu nas opções acima.",
}: OtherOptionTextareaProps) {
  const baseId = useId();
  const inputId = `${baseId}-other-detail`;
  const descId = `${baseId}-desc`;
  const errId = `${baseId}-err`;

  const describedBy = [description ? descId : null, error ? errId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {show ? (
        <motion.div
          key="other-detail"
          id={`${baseId}-wrap`}
          initial={{ opacity: 0, y: -8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.26, ease: [0.2, 0, 0, 1] },
          }}
          exit={{
            opacity: 0,
            y: -6,
            transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
          }}
          className="mt-4 pt-0.5"
        >
          <div className="space-y-1.5">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-on-dark"
            >
              {LABEL}
            </label>
            <p id={descId} className="text-xs text-on-dark-muted leading-relaxed">
              {description}
            </p>
            <textarea
              id={inputId}
              rows={5}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={PLACEHOLDER}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy || undefined}
              className={`${textareaClassName} ${error ? "border-red-500 ring-1 ring-red-500/40" : ""}`}
            />
            {error ? (
              <p id={errId} className="text-xs text-red-400" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
