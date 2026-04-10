'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useMe } from '@/lib/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  /** If provided, only users with this role can access. Default: 'ADMIN' */
  requiredRole?: string;
}

/**
 * Client-side role guard.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users with insufficient role to /.
 */
export function RoleGuard({ children, requiredRole = 'ADMIN' }: RoleGuardProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const { data: meData, isLoading } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Not authenticated
    if (!token) {
      router.replace('/login?redirect=' + window.location.pathname);
      return;
    }

    // Authenticated but role check once data loads
    if (!isLoading && meData) {
      const userRole = meData?.data?.personal_info?.role;
      if (requiredRole && userRole !== requiredRole) {
        router.replace('/');
      }
    }
  }, [mounted, token, isLoading, meData, requiredRole, router]);

  // Show nothing while we verify
  if (!mounted || !token || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0c0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Role mismatch — don't flash the content while redirecting
  const userRole = meData?.data?.personal_info?.role;
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0c0f]">
        <div className="text-center">
          <p className="text-6xl font-black text-primary mb-4">403</p>
          <p className="text-white font-bold text-xl mb-2">Akses Ditolak</p>
          <p className="text-neutral-400 text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
