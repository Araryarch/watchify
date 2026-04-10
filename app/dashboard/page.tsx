'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardIndexPage() {
  const { data: userData, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userData?.data?.personal_info) {
      const role = userData.data.personal_info.role;
      if (role === 'ADMIN') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/user');
      }
    } else if (!isLoading && !userData?.data) {
       router.replace('/login');
    }
  }, [isLoading, userData, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0c0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Mengarahkan...</p>
      </div>
    </div>
  );
}
