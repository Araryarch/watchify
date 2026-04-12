import { BookmarkPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAddToFilmList } from '@/lib/hooks/useFilmLists';
import { useAuthStore } from '@/lib/store/authStore';

interface AddToListButtonProps {
  filmId: string;
  airingStatus?: string;
}

export function AddToListButton({ filmId, airingStatus }: AddToListButtonProps) {
  const { token } = useAuthStore();
  const { mutate: addToList, isPending } = useAddToFilmList();

  // Don't show button if not logged in or film not yet aired
  if (!token || airingStatus === 'not_yet_aired') return null;

  const handleAdd = () => {
    addToList(
      { film_id: filmId, list_status: 'watching' },
      {
        onSuccess: () => {
          toast.success('Ditambahkan ke daftar tontonan!');
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.error || 'Gagal menambahkan ke daftar'),
      },
    );
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isPending}
      className="group px-4 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <BookmarkPlus className="w-4 sm:w-5 h-4 sm:h-5 text-[#00dc74]" />
      <span className="text-sm sm:text-base">{isPending ? 'Menambahkan...' : 'Tambah ke Daftar'}</span>
    </button>
  );
}
