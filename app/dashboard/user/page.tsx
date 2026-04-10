'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { User, List, Star, Settings } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';

export default function UserDashboardPage() {
  const { data: userData } = useMe();
  const user = userData?.data?.personal_info;

  return (
    <div className="min-h-screen pt-24 pb-12 font-sans text-white px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Halo, {user?.display_name || user?.username}!</Typography>
        <Typography variant="p" className="text-neutral-400 mt-0">Selamat datang di panel dashboard personal Anda.</Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00dc74]/30 to-[#00dc74]/10 rounded-full border border-[#00dc74]/30 flex items-center justify-center">
              <User className="w-6 h-6 text-[#00dc74]" />
            </div>
            <div>
              <Typography variant="h4" className="text-lg font-bold">{user?.username}</Typography>
              <Typography variant="p" className="text-sm text-neutral-400 mt-0">{user?.email}</Typography>
            </div>
          </div>
          <Link href={`/user/${user?.id}`} className="block w-full py-2.5 text-center bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold transition-all border border-white/10">
            Lihat Profil Publik
          </Link>
        </div>

        {/* Action Cards */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
             <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
               <List className="w-5 h-5 text-[#00dc74]" />
             </div>
             <Typography variant="h4" className="text-lg font-bold mb-1">Daftar Tontonan</Typography>
             <Typography variant="p" className="text-sm text-neutral-400 mb-6 mt-0">Kelola visibilitas daftar film favorit yang sedang atau sudah Anda tonton.</Typography>
          </div>
          <Link href={`/user/${user?.id}`} className="text-[#00dc74] text-sm font-bold hover:underline">
             Kelola Daftar &rarr;
          </Link>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
             <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 border border-white/10">
               <Settings className="w-5 h-5 text-[#00dc74]" />
             </div>
             <Typography variant="h4" className="text-lg font-bold mb-1">Pengaturan Akun</Typography>
             <Typography variant="p" className="text-sm text-neutral-400 mb-6 mt-0">Perbarui profil dan keamanan asisten tontonan pribadi Anda.</Typography>
          </div>
          <button className="text-left text-[#00dc74] text-sm font-bold opacity-50 cursor-not-allowed">
             Segera Hadir
          </button>
        </div>
      </div>
    </div>
  );
}
