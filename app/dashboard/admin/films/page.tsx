'use client';

import Link from 'next/link';
import { Film, Plus, Search, Trash2, Edit } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useFilms } from '@/lib/hooks/useFilms';
import Image from 'next/image';

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
              <div className="relative w-12 h-16 rounded-md overflow-hidden shadow-md bg-black/50">
                <Image
                  src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
                  alt={film.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
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
          <div className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${status === 'airing' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-neutral-300 border-white/10'}`}>
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
    //         <Link href={`/dashboard/films/${film.id}/edit`} className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
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
            <p className="text-sm font-medium text-neutral-400">Kelola dan atur database tayangan Anda</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
             <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                   type="text" placeholder="Cari..." value={searchQuery} 
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setPageIndex(1);
                   }}
                   className="w-full sm:w-64 bg-[#1b1c21] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
             </div>
             <Link href="/dashboard/admin/films/create" className="px-5 py-2.5 bg-primary text-black rounded-full font-bold hover:brightness-90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(var(--primary),0.3)] whitespace-nowrap">
               <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah</span><span className="sm:hidden">Tambah Film</span>
             </Link>
          </div>
        </div>

        <div className="bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-neutral-500 gap-3 py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium text-sm">Memuat data basis...</p>
              </div>
            ) : films.length > 0 ? (
              <div className="divide-y divide-white/5">
                {films.map((film: any) => (
                  <div key={film.id} className="p-4 hover:bg-white/2 transition-colors">
                    <div className="flex gap-3">
                      {film.images?.[0] ? (
                        <div className="relative w-16 h-20 rounded-md overflow-hidden shadow-md bg-black/50 flex-shrink-0">
                          <Image
                            src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
                            alt={film.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-20 bg-[#0b0c0f] rounded-md border border-white/5 flex items-center justify-center shadow-md flex-shrink-0">
                          <Film className="w-6 h-6 text-neutral-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white mb-1 line-clamp-2">{film.title}</h3>
                        <p className="text-xs text-neutral-500 mb-2">
                          Rilis: {film.release_date ? new Date(film.release_date).toLocaleDateString('id-ID') : '-'}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${film.airing_status === 'airing' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-neutral-300 border-white/10'}`}>
                            {statusMap[film.airing_status] || 'Selesai'}
                          </div>
                          <span className="font-mono text-xs text-neutral-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {film.total_episodes} EPS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500">
                Basis data tayangan tidak ditemukan.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto flex-1">
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
                         <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                <PaginationContent className="gap-1 sm:gap-2 flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious 
                       onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                       className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs sm:text-sm ${pageIndex === 1 ? 'opacity-50 pointer-events-none' : ''}`} 
                    />
                  </PaginationItem>
                  
                  {/* Show limited pages on mobile */}
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageNum = i + 1;
                    if (totalPages <= 5 || pageNum === 1 || pageNum === totalPages || Math.abs(pageIndex - pageNum) <= 1) {
                      return (
                        <PaginationItem key={i} className="hidden sm:block">
                          <PaginationLink 
                            onClick={() => setPageIndex(pageNum)}
                            className={`cursor-pointer border border-white/10 transition-all ${pageIndex === pageNum ? 'bg-primary text-black border-primary font-bold shadow-[0_0_15px_rgba(0,220,116,0.2)]' : 'bg-[#0b0c0f] text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20'}`}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  {/* Mobile: Show current page only */}
                  <div className="sm:hidden px-3 py-2 text-sm text-neutral-300">
                    {pageIndex} / {totalPages}
                  </div>

                  <PaginationItem>
                    <PaginationNext 
                       onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                       className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs sm:text-sm ${pageIndex === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
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
