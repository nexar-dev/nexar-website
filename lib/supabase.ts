import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './supabase-types';

/**
 * Cliente browser com cookies (PKCE) — alinhado ao `createServerClient` do `proxy.ts`
 * para o painel `/admin/*` reconhecer a sessão logo após o login.
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
