'use client';

import { Tag, Plus, Pencil, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import {
  useGenresPaginated,
  useCreateGenre,
  useUpdateGenre,
} from '@/lib/hooks/useGenres';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Modal for Create / Edit genre
function GenreModal({
  open,
  onClose,
  genre,
}: {
  open: boolean;
  onClose: () => void;
  genre?: { id: string; name: string } | null;
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: genre?.name || '' },
  });
  const { mutate: createGenre, isPending: isCreating } = useCreateGenre();
  const { mutate: updateGenre, isPending: isUpdating } = useUpdateGenre();
  const isPending = isCreating || isUpdating;

  const onSubmit = (data: { name: string }) => {
    if (genre) {
      updateGenre({ id: genre.id, name: data.name }, {
        onSuccess: () => { toast.success('Genre berhasil diperbarui'); reset(); onClose(); },
        onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal memperbarui genre'),
      });
    } else {
      createGenre(data.name, {
        onSuccess: () => { toast.success('Genre berhasil dibuat'); reset(); onClose(); },
        onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal membuat genre'),
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1b1c21] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">
          {genre ? 'Edit Genre' : 'Tambah Genre Baru'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-300 mb-2">Nama Genre</label>
            <input
              {...register('name', { required: true })}
              defaultValue={genre?.name}
              className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
              placeholder="Contoh: thriller, horror, comedy..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="flex-1 py-3 rounded-lg font-bold border border-white/10 text-neutral-300 hover:bg-white/5 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-lg font-bold bg-primary text-black hover:brightness-90 transition-all shadow-[0_4px_15px_rgba(var(--primary),0.3)] disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : (genre ? 'Simpan Perubahan' : 'Tambah Genre')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GenresPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editGenre, setEditGenre] = useState<{ id: string; name: string } | null>(null);

  const { data: genresResponse, isLoading } = useGenresPaginated({ take: 10, page: pageIndex });
  
  const allGenres = genresResponse?.data || [];
  const meta = genresResponse?.meta?.[0];
  const totalPages = meta?.total_page || 1;

  const filtered = useMemo(
    () => allGenres.filter((g: any) => g.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [allGenres, searchQuery]
  );

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Nama Genre',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-white capitalize">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => <span className="font-mono text-xs text-neutral-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: info => {
        const genre = info.row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => { setEditGenre(genre); setModalOpen(true); }}
              className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <>
      <GenreModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditGenre(null); }}
        genre={editGenre}
      />
      <div className="flex-1 w-full flex flex-col p-4 sm:p-6 lg:p-8 bg-[#0b0c0f] min-h-full font-sans text-white">
        <div className="w-full lg:max-w-7xl mx-auto flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">Manajemen Genre</h1>
              <p className="text-sm font-medium text-neutral-400">Kelola kategori genre tayangan yang tersedia</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Cari genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1b1c21] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors w-56"
                />
              </div>
              <button
                onClick={() => { setEditGenre(null); setModalOpen(true); }}
                className="px-5 py-2.5 bg-primary text-black rounded-full font-bold hover:brightness-90 transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(var(--primary),0.3)]"
              >
                <Plus className="w-4 h-4" /> Tambah Genre
              </button>
            </div>
          </div>

          <div className="bg-[#1b1c21] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="overflow-x-auto flex-1">
              <Table>
                <TableHeader className="bg-white/[0.02] border-b border-white/5">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b-white/5 hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={columns.length} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="font-medium text-sm">Memuat data genre...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="border-b-white/5 hover:bg-white/[0.02] transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={columns.length} className="h-40 text-center text-neutral-500">
                        Belum ada genre yang tersedia.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                        className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all ${pageIndex === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setPageIndex(i + 1)}
                          className={`cursor-pointer border border-white/10 transition-all ${pageIndex === i + 1 ? 'bg-primary text-black border-primary font-bold' : 'bg-[#0b0c0f] text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                        className={`cursor-pointer bg-[#0b0c0f] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all ${pageIndex === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
