"use client";

import { useState } from "react";
import type { Lead } from "@/lib/leads-store";
import { deleteLead } from "@/lib/leads-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

function formatDt(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(8rem,34%)_1fr] sm:gap-4 text-sm">
      <dt className="text-on-dark-muted font-medium">{label}</dt>
      <dd className="text-on-dark break-words">{children}</dd>
    </div>
  );
}

function DetailBulletList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-on-dark-muted">—</span>;
  return (
    <ul className="list-disc pl-4 space-y-1 text-on-dark">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

type LeadFormDetailSheetProps = {
  lead: Lead;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

export function LeadFormDetailSheet({ lead, onClose, onDeleted }: LeadFormDetailSheetProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(lead.id);
      onDeleted(lead.id);
      setConfirmDeleteOpen(false);
      toast.success("Formulário do lead excluído.");
    } catch {
      toast.error("Não foi possível excluir. Verifique permissões no Supabase (RLS DELETE).");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Sheet open onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto bg-dark-card border-dark text-on-dark [&>button]:text-on-dark-muted [&>button]:hover:text-on-dark [&>button]:focus-visible:ring-primary/50"
        >
          <SheetHeader className="space-y-1 text-left pr-8">
            <SheetTitle className="font-display text-lg text-on-dark flex items-center gap-2">
              <FileText size={18} className="text-primary shrink-0" aria-hidden />
              Formulário completo
            </SheetTitle>
            <SheetDescription className="text-on-dark-muted text-sm">
              Respostas enviadas no fluxo &quot;Montar meu sistema&quot;. ID:{" "}
              <span className="text-primary font-mono text-xs">{lead.id}</span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-8 text-sm">
            <section aria-labelledby="lead-section-contact">
              <h3 id="lead-section-contact" className="font-display font-semibold text-on-dark mb-3 text-base">
                Dados iniciais
              </h3>
              <dl className="space-y-3">
                <DetailRow label="Nome">{lead.name}</DetailRow>
                <DetailRow label="Empresa">{lead.company}</DetailRow>
                <DetailRow label="WhatsApp">{lead.whatsapp}</DetailRow>
                <DetailRow label="Email">{lead.email}</DetailRow>
                <DetailRow label="Cidade / Estado">{lead.city_state}</DetailRow>
              </dl>
            </section>

            <section aria-labelledby="lead-section-business">
              <h3 id="lead-section-business" className="font-display font-semibold text-on-dark mb-3 text-base">
                Negócio e objetivos
              </h3>
              <dl className="space-y-3">
                <DetailRow label="Tipo de negócio">{lead.business_type || "—"}</DetailRow>
                <DetailRow label="Objetivos">
                  <DetailBulletList items={lead.objectives ?? []} />
                </DetailRow>
                <DetailRow label="Funcionalidades">
                  <DetailBulletList items={lead.features ?? []} />
                </DetailRow>
              </dl>
            </section>

            <section aria-labelledby="lead-section-usage">
              <h3 id="lead-section-usage" className="font-display font-semibold text-on-dark mb-3 text-base">
                Uso, acesso e relatórios
              </h3>
              <dl className="space-y-3">
                <DetailRow label="Quem usa">{lead.users_who_use || "—"}</DetailRow>
                <DetailRow label="Dispositivos">
                  <DetailBulletList items={lead.devices ?? []} />
                </DetailRow>
                <DetailRow label="Login / acesso">{lead.needs_login || "—"}</DetailRow>
                {lead.needs_login === "Sim" ? (
                  <DetailRow label="Perfis de acesso">
                    <DetailBulletList items={lead.login_profiles ?? []} />
                  </DetailRow>
                ) : null}
                <DetailRow label="Relatórios">{lead.needs_reports || "—"}</DetailRow>
                {lead.needs_reports === "Sim" ? (
                  <DetailRow label="Tipos de relatório">
                    <DetailBulletList items={lead.report_types ?? []} />
                  </DetailRow>
                ) : null}
              </dl>
            </section>

            <section aria-labelledby="lead-section-extra">
              <h3 id="lead-section-extra" className="font-display font-semibold text-on-dark mb-3 text-base">
                Integrações, prioridade e texto livre
              </h3>
              <dl className="space-y-3">
                <DetailRow label="Integrações">
                  <DetailBulletList items={lead.integrations ?? []} />
                </DetailRow>
                <DetailRow label="Prioridade">{lead.priority || "—"}</DetailRow>
                <DetailRow label="Descrição do sistema">
                  {lead.description?.trim() ? (
                    <p className="whitespace-pre-wrap">{lead.description}</p>
                  ) : (
                    <span className="text-on-dark-muted">—</span>
                  )}
                </DetailRow>
                <DetailRow label="Observações extras">
                  {lead.additional_notes?.trim() ? (
                    <p className="whitespace-pre-wrap">{lead.additional_notes}</p>
                  ) : (
                    <span className="text-on-dark-muted">—</span>
                  )}
                </DetailRow>
              </dl>
            </section>

            <section aria-labelledby="lead-section-meta">
              <h3 id="lead-section-meta" className="font-display font-semibold text-on-dark mb-3 text-base">
                Registro
              </h3>
              <dl className="space-y-3">
                <DetailRow label="Status atual">{lead.status}</DetailRow>
                <DetailRow label="Recebido em">{formatDt(lead.created_at)}</DetailRow>
                <DetailRow label="Atualizado em">{formatDt(lead.updated_at)}</DetailRow>
              </dl>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-dark flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 transition-colors"
            >
              <Trash2 size={16} className="shrink-0" aria-hidden />
              Excluir formulário deste lead
            </button>
            <p className="text-xs text-on-dark-muted leading-relaxed">
              A exclusão é permanente. Apenas perfis com permissão de DELETE na tabela{" "}
              <code className="text-primary text-[0.7rem]">leads</code> conseguem concluir esta ação.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent className="bg-dark-card border-dark text-on-dark max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-on-dark font-display text-lg">
              Excluir formulário?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-on-dark-muted text-sm leading-relaxed">
              Isso remove permanentemente as respostas de{" "}
              <strong className="text-on-dark">{lead.name}</strong> ({lead.company}). Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="border-dark bg-dark-base text-on-dark hover:bg-dark-card hover:text-on-dark mt-0">
              Cancelar
            </AlertDialogCancel>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void handleDelete()}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-card disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin" size={16} aria-hidden />
                  Excluindo…
                </>
              ) : (
                "Excluir"
              )}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
