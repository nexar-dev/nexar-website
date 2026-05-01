'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

/**
 * Redirecionamento para /admin/dashboard
 * Esta página agora serve apenas como redirecionamento
 */
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const user = await getCurrentUser();
      
      if (user) {
        router.push('/admin/dashboard');
      } else {
        router.push('/admin/login');
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span className="text-on-dark-muted">Redirecionando...</span>
      </div>
    </div>
  );
}