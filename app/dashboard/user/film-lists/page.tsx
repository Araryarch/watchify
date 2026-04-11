'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Film, Trash2 } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Daftar Tontonan</Typography>
          <Typography variant="p" className="text-neutral-400 mt-0">Kelola film yang sedang atau sudah Anda tonton</Typography>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm font-medium">Total</span>
              <Film className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-black text-white">{filmLists.length}</p>
          </div>
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm font-medium">Watching</span>
              <Film className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-black text-white">
              {filmLists.filter((item: any) => item.list_status === 'watching').length}
            </p>
          </div>
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm font-medium">Completed</span>
              <Film className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white">
              {filmLists.filter((item: any) => item.list_status === 'completed').length}
            </p>
          </div>
          <div className="bg-[#1b1c21] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-400 text-sm font-medium">Plan to Watch</span>
              <Film className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-black text-white">
              {filmLists.filter((item: any) => item.list_status === 'plan_to_watch').length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/2 border-b border-white/5">
            <TableRow className="border-b-white/5 hover:bg-transparent">
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Film</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">Visibility</TableHead>
              <TableHead className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={4} className="h-48 text-center">
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
                      <span className="font-bold text-white">
                        {item.film_title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex px-3 py-1 rounded text-xs font-bold border ${STATUS_COLORS[item.list_status] || 'bg-white/5 text-neutral-300 border-white/10'}`}>
                      {STATUS_LABELS[item.list_status] || item.list_status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={item.visibility === 'public'}
                              disabled={true}
                              aria-label="Toggle visibility"
                            />
                            <span className="text-sm text-neutral-400">
                              {item.visibility === 'public' ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This feature is coming soon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <button 
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      aria-label="Delete film list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b-white/5 hover:bg-transparent">
                <TableCell colSpan={4} className="h-48 text-center">
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
    </div>
  );
}
