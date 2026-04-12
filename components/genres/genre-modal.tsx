import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateGenre, useUpdateGenre } from '@/lib/hooks/useGenres';

interface GenreModalProps {
  open: boolean;
  onClose: () => void;
  genre?: { id: string; name: string } | null;
}

export function GenreModal({ open, onClose, genre }: GenreModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: genre?.name || '' },
  });
  const { mutate: createGenre, isPending: isCreating } = useCreateGenre();
  const { mutate: updateGenre, isPending: isUpdating } = useUpdateGenre();
  const isPending = isCreating || isUpdating;

  const onSubmit = (data: { name: string }) => {
    if (genre) {
      updateGenre({ id: genre.id, name: data.name }, {
        onSuccess: () => { 
          toast.success('Genre berhasil diperbarui'); 
          reset(); 
          onClose(); 
        },
        onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal memperbarui genre'),
      });
    } else {
      createGenre(data.name, {
        onSuccess: () => { 
          toast.success('Genre berhasil dibuat'); 
          reset(); 
          onClose(); 
        },
        onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal membuat genre'),
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1b1c21] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
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
