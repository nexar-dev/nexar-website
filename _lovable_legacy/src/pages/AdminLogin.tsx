import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminLogin } from "@/lib/leads-store";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate("/admin");
      } else {
        toast.error("Email ou senha incorretos");
      }
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center">
              <Lock size={20} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-xl font-bold text-on-dark text-center mb-2">Área Administrativa</h1>
          <p className="text-xs text-on-dark-muted text-center mb-6">Acesso restrito a administradores</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-dark mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl bg-dark-card border border-dark px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="admin@empresa.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-dark mb-1.5">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl bg-dark-card border border-dark px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-purple px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 hover:opacity-90 active:scale-110 disabled:opacity-50">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
