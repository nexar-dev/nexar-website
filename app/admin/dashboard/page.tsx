'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  getCurrentUser, 
  signOut, 
  onAuthStateChange
} from '@/lib/auth';
import { fetchLeads, updateLeadStatus, type Lead } from '@/lib/leads-store';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import {
  LogOut,
  Shield,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  RefreshCw,
  FileText,
} from "lucide-react";
import { LeadFormDetailSheet } from "@/components/admin/LeadFormDetailSheet";

const nexarLogo = '/assets/nexar-logo.png';

const LEAD_STATUSES = [
  { value: 'novo', label: 'Novo' },
  { value: 'contatado', label: 'Contatado' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'arquivado', label: 'Arquivado' },
] as const;

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch {
      toast.error('Não foi possível carregar os leads.');
      setLeads([]);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const novos = leads.filter((l) => (l.status || '').toLowerCase() === 'novo').length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const last7 = leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length;
    return [
      {
        label: 'Leads (total)',
        value: total.toLocaleString('pt-BR'),
        icon: Users,
      },
      {
        label: 'Novos (status)',
        value: novos.toLocaleString('pt-BR'),
        icon: Shield,
      },
      {
        label: 'Últimos 7 dias',
        value: last7.toLocaleString('pt-BR'),
        icon: BarChart3,
      },
      {
        label: 'Atualização',
        value: leadsLoading ? '…' : 'Ao vivo',
        icon: Clock,
      },
    ];
  }, [leads, leadsLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
      void loadLeads();
    };

    void checkAuth();

    const unsubscribe = onAuthStateChange((nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        router.push('/admin/login');
      } else {
        void loadLeads();
      }
    });

    return unsubscribe;
  }, [router, loadLeads]);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success('Logout realizado com sucesso');
        router.push('/admin/login');
      } else {
        toast.error(result.error || 'Erro ao fazer logout');
      }
    } catch {
      toast.error('Erro inesperado ao fazer logout');
    }
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await updateLeadStatus(leadId, status);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, status, updated_at: new Date().toISOString() }
            : l,
        ),
      );
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  function formatDt(iso: string) {
    try {
      return new Date(iso).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-on-dark-muted">Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Header */}
      <header className="border-b border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={nexarLogo} alt="Nexar" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="font-display text-xl font-bold text-on-dark">Dashboard Admin</h1>
                <p className="text-xs text-on-dark-muted">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-dark-card border border-dark px-3 py-2 text-xs font-medium text-on-dark-muted hover:text-on-dark transition-colors hover:scale-105"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => void loadLeads()}
            disabled={leadsLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-dark-card border border-dark px-3 py-2 text-xs font-medium text-on-dark-muted hover:text-on-dark transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={leadsLoading ? 'animate-spin' : ''} />
            Atualizar lista
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="glass-dark rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={18} className="text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-on-dark mb-1">{stat.value}</p>
              <p className="text-sm text-on-dark-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Status do Sistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary" />
              <h3 className="font-display font-semibold text-on-dark">Status</h3>
            </div>

            <div className="space-y-3 text-sm text-on-dark-muted">
              <p>
                Formulário &quot;Montar meu sistema&quot; grava leads na tabela{" "}
                <code className="text-primary text-xs">public.leads</code> via cliente Supabase (chave
                anônima respeitando RLS).
              </p>
              <p>
                Confirme no Supabase que políticas RLS permitem{" "}
                <strong className="text-on-dark">INSERT</strong> anônimo e{" "}
                <strong className="text-on-dark">SELECT</strong>,{" "}
                <strong className="text-on-dark">UPDATE</strong> e{" "}
                <strong className="text-on-dark">DELETE</strong> para sessões autenticadas de admin,
                conforme necessário.
              </p>
            </div>
          </motion.div>

          {/* Leads do formulário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <h3 className="font-display font-semibold text-on-dark">Leads (questionário)</h3>
              </div>
              <span className="text-xs text-on-dark-muted">
                {leadsLoading ? 'Carregando…' : `${leads.length} registro(s)`}
              </span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {leadsLoading && leads.length === 0 ? (
                <p className="text-sm text-on-dark-muted py-8 text-center">Carregando leads…</p>
              ) : leads.length === 0 ? (
                <p className="text-sm text-on-dark-muted py-8 text-center">
                  Nenhum lead ainda. Envie um teste pelo botão &quot;Montar meu sistema&quot; na home.
                </p>
              ) : (
                leads.map((lead, i) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(0.05 * i, 0.4) }}
                    className="rounded-lg bg-dark-card border border-dark p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-on-dark">{lead.name}</p>
                        <p className="text-xs text-on-dark-muted">{lead.company}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setDetailLead(lead)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-dark bg-dark-base px-3 py-1.5 text-xs font-medium text-on-dark-muted hover:text-on-dark hover:border-primary/40 transition-colors"
                        >
                          <FileText size={14} className="shrink-0 text-primary" aria-hidden />
                          Ver formulário completo
                        </button>
                        <select
                          value={lead.status}
                          onChange={(e) => void handleStatusChange(lead.id, e.target.value)}
                          className="text-xs rounded-lg bg-dark-base border border-dark px-2 py-1.5 text-on-dark focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[9rem]"
                          aria-label={`Status do lead ${lead.name}`}
                        >
                          {!LEAD_STATUSES.some((s) => s.value === lead.status) && (
                            <option value={lead.status}>{lead.status}</option>
                          )}
                          {LEAD_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-1 text-xs text-on-dark-muted">
                      <span>{lead.email}</span>
                      <span>{lead.whatsapp}</span>
                      <span>{lead.city_state}</span>
                      <span>{formatDt(lead.created_at)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Autenticação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-dark rounded-2xl p-4 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Settings size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-1">Sessão atual</h4>
              <p className="text-xs text-on-dark-muted leading-relaxed">
                Middleware do Next valida a sessão no servidor antes de servir{' '}
                <code className="text-primary">/admin</code> (exceto login).
                Usuário atual: <code className="text-primary">{user?.email}</code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {detailLead ? (
        <LeadFormDetailSheet
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onDeleted={(id) => {
            setLeads((prev) => prev.filter((l) => l.id !== id));
            setDetailLead(null);
          }}
        />
      ) : null}
    </div>
  );
}