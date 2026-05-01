# 🔐 Sistema de Autenticação Admin - Nexar

## 🚀 Como usar

### Acesso ao Admin

1. **URL de Login**: `http://localhost:3000/admin/login`
2. **Dashboard**: `http://localhost:3000/admin/dashboard`
3. **Redirecionamento automático**: `http://localhost:3000/admin` → redireciona baseado no status de login

### 🔑 Credenciais Temporárias

```
Email: admin@nexar.com.br
Senha: Nexar2024!
```

> **💡 Dica**: Na tela de login, clique em "Mostrar credenciais de teste" para preenchimento automático.

## ⚙️ Funcionalidades

### Autenticação Local
- **Sessão**: 8 horas de duração
- **Renovação automática**: Pergunta se deseja renovar 15 min antes de expirar
- **Logout automático**: Quando a sessão expira
- **Proteção de rotas**: Redireciona para login se não autenticado

### Dashboard Admin
- **Estatísticas mock**: Usuários ativos, sessões, conversão
- **Monitoramento do sistema**: Status dos serviços
- **Atividades recentes**: Log de ações mock
- **Indicador de sessão**: Tempo restante + renovação manual
- **Interface responsiva**: Funciona em mobile e desktop

## 🛠️ Como alterar as credenciais

### Método 1: Editar arquivo de auth local

```bash
# Edite o arquivo: /lib/auth-local.ts
# Linhas 22-23:
const ADMIN_EMAIL = 'admin@nexar.com.br';
const ADMIN_PASSWORD = 'Nexar2024!';
```

### Método 2: Implementar banco de dados

Substitua a função `adminLogin()` em `/lib/auth-local.ts`:

```typescript
export async function adminLogin(email: string, password: string): Promise<boolean> {
  // Sua lógica de validação com banco aqui
  const user = await database.findUser({ email, password });
  
  if (user) {
    // Criar sessão...
    const session = { /* ... */ };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return true;
  }
  
  return false;
}
```

## 📁 Estrutura de arquivos

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Página de login
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard principal
│   └── page.tsx              # Redirecionamento
└── 
lib/
└── auth-local.ts             # Lógica de autenticação local
```

## 🔧 Configurações

### Duração da sessão
```typescript
// Em /lib/auth-local.ts, linha 26:
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas
```

### Aviso de expiração
```typescript
// Em /app/admin/dashboard/page.tsx, linha 45:
if (newTimeLeft === 15) { // 15 minutos antes
  toast.info('Sessão expira em 15 minutos...');
}
```

## 🚨 Importante para produção

1. **Remover credenciais hardcoded**: Implementar validação com banco
2. **HTTPS obrigatório**: Para proteger cookies/localStorage
3. **Tokens JWT**: Para maior segurança entre requisições
4. **Rate limiting**: Proteção contra ataques de força bruta
5. **2FA opcional**: Para maior segurança

## 🧪 Teste das funcionalidades

1. **Login**: Acesse `/admin/login` e use as credenciais de teste
2. **Redirecionamento**: Tente acessar `/admin` sem login
3. **Renovação**: Espere ou mude o tempo na função para testar renovação
4. **Logout**: Clique no botão "Sair" no dashboard
5. **Expiração**: Mude `SESSION_DURATION_MS` para 1 minuto para testar

---

**Status**: ✅ Implementação concluída e testada
**Próximos passos**: Integração com banco de dados real