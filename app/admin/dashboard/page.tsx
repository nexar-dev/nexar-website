'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  getCurrentUser, 
  signOut, 
  onAuthStateChange
} from '@/lib/auth';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import {
  LogOut, Shield, Users, BarChart3, 
  Settings, Eye, Calendar, Clock
} from 'lucide-react';

const nexarLogo = '/assets/nexar-logo.png';

// Dados mock para demonstração
const mockStats = [
  { label: 'Usuários Ativos', value: '1,247', icon: Users, change: '+12%', up: true },
  { label: 'Sessões Hoje', value: '856', icon: Eye, change: '+8%', up: true },
  { label: 'Taxa Conversão', value: '24.3%', icon: BarChart3, change: '+5%', up: true },
  { label: 'Tempo Médio', value: '4m 32s', icon: Clock, change: '-15%', up: false },
];

const mockActivities = [
  { action: 'Novo usuário cadastrado', user: 'Maria Silva', time: '2 min atrás', type: 'user' },
  { action: 'Lead convertido', user: 'João Santos', time: '5 min atrás', type: 'conversion' },
  { action: 'Sessão iniciada', user: 'Ana Costa', time: '8 min atrás', type: 'session' },
  { action: 'Formulário enviado', user: 'Pedro Lima', time: '12 min atrás', type: 'form' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação inicial
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Escutar mudanças na autenticação
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (!user) {
        router.push('/admin/login');
      }
    });

    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success('Logout realizado com sucesso');
        router.push('/admin/login');
      } else {
        toast.error(result.error || 'Erro ao fazer logout');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro inesperado ao fazer logout');
    }
  };

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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, i) => (
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
                <span className={`text-xs font-medium ${stat.up ? 'text-green-400' : 'text-accent'}`}>
                  {stat.change}
                </span>
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
              <h3 className="font-display font-semibold text-on-dark">Status do Sistema</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { service: 'API Principal', status: 'online', ping: '12ms' },
                { service: 'Banco de Dados', status: 'online', ping: '8ms' },
                { service: 'Autenticação', status: 'online', ping: '15ms' },
                { service: 'Storage', status: 'online', ping: '22ms' },
              ].map((item) => (
                <div key={item.service} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-on-dark">{item.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-dark-muted">{item.ping}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-medium">
                      Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Atividades Recentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 glass-dark rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <h3 className="font-display font-semibold text-on-dark">Atividades Recentes</h3>
              </div>
              <button className="text-xs text-on-dark-muted hover:text-primary transition-colors">
                Ver todas →
              </button>
            </div>

            <div className="space-y-3">
              {mockActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-card hover:bg-dark-border/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-dark">{activity.action}</p>
                    <p className="text-xs text-on-dark-muted">{activity.user}</p>
                  </div>
                  <span className="text-xs text-on-dark-muted">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Aviso sobre auth Supabase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-dark rounded-2xl p-4 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Settings size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-on-dark mb-1">Autenticação Supabase Ativa</h4>
              <p className="text-xs text-on-dark-muted leading-relaxed">
                Este dashboard está usando autenticação com Supabase Auth. 
                Usuário atual: <code className="text-primary">{user?.email}</code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}