'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Film, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_LABELS: Record<string, string> = {
  watching: 'Sedang Menonton',
  completed: 'Selesai Ditonton',
  plan_to_watch: 'Ingin Ditonton',
  dropped: 'Berhenti',
};

const STATUS_COLORS: Record<string, string> = {
  watching: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  plan_to_watch: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  dropped: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function FilmListsPage() {
  const { data: userData } = useMe();
  const userId = userData?.data?.personal_info?.id;
  const { data: userDetailData, isLoading } = useUserDetail(userId || '');
  const filmLists = userDetailData?.data?.film_lists || [];

  return (
    <div className="min-h-screen pt-24 pb-12 font-sans text-white px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/user" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Daftar Tontonan Saya</Typography>
        <Typography variant="p" className="text-neutral-400 mt-0">Kelola film yang sedang atau sudah Anda tonton</Typography>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-neutral-500 gap-3 py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium text-sm">Memuat data...</p>
          </div>
        ) : filmLists.length > 0 ? (
          <div className="space-y-3">
            {filmLists.map((item: any, index: number) => (
              <div key={index} className="bg-[#1b1c21] border border-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Film className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{item.film_title}</p>
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold border mt-1 ${STATUS_COLORS[item.list_status] || 'bg-white/5 text-neutral-300 border-white/10'}`}>
                        {STATUS_LABELS[item.list_status] || item.list_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-12 text-center">
            <Film className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">Belum ada film dalam daftar tontonan</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2 border-b border-white/5">
            <TableRow className="border-b-white/5 hover:bg-transparent">
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Film</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium text-sm">Memuat data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filmLists.length > 0 ? (
              filmLists.map((item: any, index: number) => (
                <TableRow key={index} className="border-b-white/5 hover:bg-white/2 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Film className="w-5 h-5 text-primary" />
                      <span className="font-bold text-white">{item.film_title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex px-3 py-1 rounded text-xs font-bold border ${STATUS_COLORS[item.list_status] || 'bg-white/5 text-neutral-300 border-white/10'}`}>
                      {STATUS_LABELS[item.list_status] || item.list_status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <button className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={3} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                    <Film className="w-12 h-12 text-neutral-600" />
                    <p>Belum ada film dalam daftar tontonan</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
