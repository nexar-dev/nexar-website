'use client';

import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export async function signInWithEmailAndPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }

    if (!data.user) {
      return { success: false, error: 'Nenhum usuário retornado após login' };
    }

    return { success: true, user: data.user };
  } catch {
    return { success: false, error: 'Erro inesperado durante login' };
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: getErrorMessage(error) };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Erro inesperado durante logout' };
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();

    // Fluxo normal: usuário ainda não autenticado.
    if (!session) {
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Em estados transitórios, trate como deslogado.
      if (error.message === 'Auth session missing!') {
        return null;
      }
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

function getErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email ou senha incorretos';
    case 'Email not confirmed':
      return 'Email ainda não confirmado';
    case 'Invalid email':
      return 'Email inválido';
    case 'Too many requests':
      return 'Muitas tentativas. Tente novamente em alguns minutos';
    default:
      return 'Erro de autenticação. Tente novamente';
  }
}
