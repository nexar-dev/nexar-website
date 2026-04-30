'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchLeads, updateLeadStatus, isAdminLoggedIn, adminLogout, type Lead } from '@/lib/leads-store';
import { LEAD_STATUSES } from '@/lib/questionnaire-data';
import {
  Search, Filter, LogOut, ChevronRight, Copy,
  Calendar, Building2, Clock, ArrowLeft, Download, Loader2,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-primary/20 text-primary',
  'em análise': 'bg-accent/20 text-accent',
  'contato realizado': 'bg-blue-500/20 text-blue-400',
  'proposta enviada': 'bg-emerald-500/20 text-emerald-400',
  encerrado: 'bg-muted text-muted-foreground',
};

function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status] || 'bg-muted text-muted-foreground'}`}>{status}</span>;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copiado!`);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterBusiness, setFilterBusiness] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isAdminLoggedIn();
      if (!loggedIn) { router.push('/admin/login'); return; }
      await loadLeads();
    };
    checkAuth();
  }, [router]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err: unknown) {
      toast.error('Erro ao carregar leads: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status, updated_at: new Date().toISOString() } : l));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
      toast.success('Status atualizado');
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    router.push('/admin/login');
  };

  const filtered = leads.filter((l) => {
    const s = search.toLowerCase();
    const matchSearch = !s || l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s);
    const matchPriority = !filterPriority || l.priority === filterPriority;
    const matchBusiness = !filterBusiness || l.business_type === filterBusiness;
    const matchStatus = !filterStatus || l.status === filterStatus;
    return matchSearch && matchPriority && matchBusiness && matchStatus;
  });

  const exportCSV = () => {
    const headers = ['Nome', 'Empresa', 'WhatsApp', 'Email', 'Cidade', 'Tipo', 'Prioridade', 'Status', 'Data'];
    const rows = filtered.map((l) => [l.name, l.company, l.whatsapp, l.email, l.city_state, l.business_type, l.priority, l.status, new Date(l.created_at).toLocaleDateString('pt-BR')]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
  };

  const uniqueBusinessTypes = [...new Set(leads.map((l) => l.business_type))];
  const uniquePriorities = [...new Set(leads.map((l) => l.priority))];

  if (selectedLead) {
    return (
      <div className="min-h-screen bg-dark-base">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setSelectedLead(null)} className="inline-flex items-center gap-2 text-sm text-on-dark-muted hover:text-on-dark mb-6 transition-colors">
            <ArrowLeft size={16} /> Voltar
          </button>
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-on-dark">{selectedLead.name}</h1>
              <p className="text-on-dark-muted">{selectedLead.company}</p>
            </div>
            <StatusBadge status={selectedLead.status} />
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {LEAD_STATUSES.map((s) => (
              <button key={s} onClick={() => handleUpdateStatus(selectedLead.id, s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selectedLead.status === s ? 'bg-gradient-purple text-primary-foreground' : 'bg-dark-card border border-dark text-on-dark-muted hover:text-on-dark'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="space-y-6">
            <DetailBlock title="Contato">
              <DetailRow label="WhatsApp" value={selectedLead.whatsapp} copyable />
              <DetailRow label="Email" value={selectedLead.email} copyable />
              <DetailRow label="Cidade/Estado" value={selectedLead.city_state} />
            </DetailBlock>
            <DetailBlock title="Negócio">
              <DetailRow label="Tipo" value={selectedLead.business_type} />
              <DetailRow label="Prioridade" value={selectedLead.priority} />
            </DetailBlock>
            <DetailBlock title="Objetivos"><TagList items={selectedLead.objectives} /></DetailBlock>
            <DetailBlock title="Funcionalidades"><TagList items={selectedLead.features} /></DetailBlock>
            <DetailBlock title="Uso">
              <DetailRow label="Usuários" value={selectedLead.users_who_use} />
              <DetailRow label="Dispositivos" value={selectedLead.devices.join(', ')} />
            </DetailBlock>
            <DetailBlock title="Login e Relatórios">
              <DetailRow label="Login" value={selectedLead.needs_login} />
              {selectedLead.login_profiles.length > 0 && <DetailRow label="Perfis" value={selectedLead.login_profiles.join(', ')} />}
              <DetailRow label="Relatórios" value={selectedLead.needs_reports} />
              {selectedLead.report_types.length > 0 && <DetailRow label="Tipos" value={selectedLead.report_types.join(', ')} />}
            </DetailBlock>
            <DetailBlock title="Integrações"><TagList items={selectedLead.integrations} /></DetailBlock>
            {selectedLead.description && <DetailBlock title="Descrição"><p className="text-sm text-on-dark-muted leading-relaxed">{selectedLead.description}</p></DetailBlock>}
            {selectedLead.additional_notes && <DetailBlock title="Observações"><p className="text-sm text-on-dark-muted leading-relaxed">{selectedLead.additional_notes}</p></DetailBlock>}
            <p className="text-xs text-on-dark-muted">Enviado em {new Date(selectedLead.created_at).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base">
      <div className="border-b border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-on-dark">Painel Administrativo</h1>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-lg bg-dark-card border border-dark px-3 py-2 text-xs font-medium text-on-dark-muted hover:text-on-dark transition-colors hover:scale-105 active:scale-110">
              <Download size={14} /> Exportar CSV
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-dark-card border border-dark px-3 py-2 text-xs font-medium text-on-dark-muted hover:text-on-dark transition-colors hover:scale-105 active:scale-110">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-dark-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou empresa..."
              className="w-full rounded-xl bg-dark-card border border-dark pl-10 pr-4 py-2.5 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterSelect value={filterStatus} onChange={setFilterStatus} options={LEAD_STATUSES} placeholder="Status" />
            <FilterSelect value={filterPriority} onChange={setFilterPriority} options={uniquePriorities} placeholder="Prioridade" />
            <FilterSelect value={filterBusiness} onChange={setFilterBusiness} options={uniqueBusinessTypes} placeholder="Negócio" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {LEAD_STATUSES.map((s) => (
            <div key={s} className="glass-dark rounded-xl p-4 text-center">
              <div className="font-display text-2xl font-bold text-on-dark">{leads.filter((l) => l.status === s).length}</div>
              <p className="text-xs text-on-dark-muted capitalize">{s}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-on-dark-muted">Nenhum lead encontrado.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map((lead, i) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
                onClick={() => setSelectedLead(lead)}
                className="group glass-dark rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-dark-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-sm text-on-dark truncate">{lead.name}</span>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-dark-muted">
                    <span className="flex items-center gap-1"><Building2 size={12} />{lead.company}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{lead.priority}</span>
                    <span className="hidden sm:flex items-center gap-1"><Calendar size={12} />{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-on-dark-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-dark-muted pointer-events-none" />
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl bg-dark-card border border-dark pl-9 pr-8 py-2.5 text-xs text-on-dark focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="glass-dark rounded-2xl p-5"><h3 className="font-display font-semibold text-on-dark text-sm mb-3">{title}</h3><div className="space-y-2">{children}</div></div>);
}

function DetailRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-on-dark-muted">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-on-dark">{value}</span>
        {copyable && <button onClick={() => copyToClipboard(value, label)} className="p-1 rounded hover:bg-dark-card text-on-dark-muted hover:text-primary transition-colors"><Copy size={12} /></button>}
      </div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-xs text-on-dark-muted">Nenhum selecionado</p>;
  return (<div className="flex flex-wrap gap-1.5">{items.map((i) => <span key={i} className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs text-primary font-medium">{i}</span>)}</div>);
}
