'use client';

import Link from 'next/link';
import { Film, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useFilms } from '@/lib/hooks/useFilms';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DashboardFilmsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const { data: filmsResponse, isLoading } = useFilms({ take: 10, page: pageIndex, filter: searchQuery, filter_by: 'title' });
  // const { mutate: deleteFilm, isPending: isDeleting } = useDeleteFilm();

  const films = filmsResponse?.data || [];
  const meta = filmsResponse?.meta?.[0];
  const totalPages = meta?.total_page || 1;

  // const handleDelete = (id: string, title: string) => {
  //   deleteFilm(id, {
  //     onSuccess: () => toast.success(`Berhasil menghapus film ${title}`),
  //     onError: () => toast.error(`Gagal menghapus film ${title}`)
  //   });
  // };

  const statusMap: Record<string, string> = {
    airing: 'Sedang Tayang',
    not_yet_aired: 'Akan Datang',
    finished_airing: 'Selesai'
  };

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Informasi Tayangan',
      cell: info => {
        const film = info.row.original;
        return (
          <div className="flex items-center gap-4">
            {film.images?.[0] ? (
              <img src={`https://film-management-api.labse.id/uploads/${film.images[0]}`} className="w-12 h-16 object-cover rounded-md shadow-md bg-black/50" alt={film.title} />
            ) : (
              <div className="w-12 h-16 bg-[#1b1c21] rounded-md border border-white/5 flex items-center justify-center shadow-md"><Film className="w-5 h-5 text-neutral-600" /></div>
            )}
            <div>
              <p className="font-bold text-white mb-1 line-clamp-1">{film.title}</p>
              <p className="text-xs text-neutral-500">Rilis: {film.release_date ? new Date(film.release_date).toLocaleDateString('id-ID') : '-'}</p>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('airing_status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue() as string;
        return (
          <div className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${status === 'airing' ? 'bg-[#00dc74]/10 text-[#00dc74] border-[#00dc74]/20' : 'bg-white/5 text-neutral-300 border-white/10'}`}>
            {statusMap[status] || 'Selesai'}
          </div>
        );
      }
    }),
    columnHelper.accessor('total_episodes', {
      header: 'Total EPs',
      cell: info => <span className="font-mono text-sm text-neutral-300 bg-white/5 px-2 py-1 rounded border border-white/5">{info.getValue()} EPS</span>
    }),
    // columnHelper.display({
    //   id: 'actions',
    //   header: () => <div className="text-right">Aksi</div>,
    //   cell: (info) => {
    //     const film = info.row.original;
    //     return (
    //       <div className="flex items-center justify-end gap-2">
    //         <Link href={`/dashboard/films/${film.id}/edit`} className="p-2 text-neutral-500 hover:text-[#00dc74] hover:bg-[#00dc74]/10 rounded-lg transition-colors">
    //           <Edit className="w-4 h-4" />
    //         </Link>
    //         <AlertDialog>
    //           <AlertDialogTrigger asChild>
    //             <button className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
    //               <Trash2 className="w-4 h-4" />
    //             </button>
    //           </AlertDialogTrigger>
    //           <AlertDialogContent className="bg-[#1b1c21] border-white/5 text-white">
    //             <AlertDialogHeader>
    //               <AlertDialogTitle>Hapus Tayangan?</AlertDialogTitle>
    //               <AlertDialogDescription className="text-neutral-400">
    //                 Tindakan ini tidak dapat dibatalkan. Tayangan <strong className="text-white">{film.title}</strong> akan dihapus permanen dari basis data.
    //               </AlertDialogDescription>
    //               <AlertDialogFooter>
    //                 <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Batal</AlertDialogCancel>
    //                 <AlertDialogAction disabled={isDeleting} onClick={() => handleDelete(film.id, film.title)} className="bg-red-500 text-white hover:bg-red-600">
    //                   Ya, Hapus
    //                 </AlertDialogAction>
    //               </AlertDialogFooter>
    //             </AlertDialogHeader>
    //           </AlertDialogContent>
    //         </AlertDialog>
    //       </div>
    //     );
    //   }
    // })
  ], []);

  const table = useReactTable({
    data: films,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="flex-1 w-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#0b0c0f] min-h-full font-sans text-white">
      <div className="w-full lg:max-w-7xl mx-auto flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">Manajemen Film</h1>
            <p className="text-sm font-medium text-neutral-400">Atur database tayangan dengan struktur Tabel TanStack</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                   type="text" placeholder="Cari..." value={searchQuery} 
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setPageIndex(1);
                   }}
                   className="bg-[#1b1c21] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00dc74] transition-colors w-64"
                />
             </div>
             <Link href="/dashboard/films/create" className="px-5 py-2.5 bg-[#00dc74] text-black rounded-full font-bold hover:bg-[#00c266] transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(0,220,116,0.3)]">
               <Plus className="w-4 h-4" /> Tambah 
             </Link>
          </div>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-white/[0.02] border-b border-white/5">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-white/5 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-b-white/5 hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                         <div className="w-8 h-8 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin"></div>
                         <p className="font-medium text-sm">Memuat data basis...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-b-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-b-white/5 hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="h-48 text-center text-neutral-500">
                      Basis data tayangan tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/5 bg-white/[0.01]">
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious 
                       onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                       className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all ${pageIndex === 1 ? 'opacity-50 pointer-events-none' : ''}`} 
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setPageIndex(i + 1)}
                        className={`cursor-pointer border border-white/10 transition-all ${pageIndex === i + 1 ? 'bg-[#00dc74] text-black border-[#00dc74] font-bold shadow-[0_0_15px_rgba(0,220,116,0.2)]' : 'bg-[#0b0c0f] text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20'}`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                       onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                       className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all ${pageIndex === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
