import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { StarRating } from './star-rating';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { useAuthStore } from '@/lib/store/authStore';

interface ReviewFormProps {
  filmId: string;
}

export function ReviewForm({ filmId }: ReviewFormProps) {
  const { token } = useAuthStore();
  const { register, handleSubmit, reset } = useForm<{ comment: string }>();
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(filmId);

  const onSubmit = (data: { comment: string }) => {
    if (rating === 0) {
      toast.error('Pilih rating terlebih dahulu');
      return;
    }
    createReview(
      { rating, comment: data.comment },
      {
        onSuccess: () => {
          toast.success('Ulasan berhasil dikirim!');
          reset({ comment: '' });
          setRating(0);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.message || 'Gagal mengirim ulasan'),
      },
    );
  };

  if (!token) {
    return (
      <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-neutral-400">
        <p className="text-xs sm:text-sm">
          <a href="/login" className="text-[#00dc74] font-bold hover:underline">Login</a> untuk menulis ulasan.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5"
    >
      <h3 className="text-white font-bold text-base sm:text-lg">Tulis Ulasan</h3>

      <div>
        <label className="block text-xs sm:text-sm text-neutral-300 mb-2 font-medium">Rating kamu</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs sm:text-sm text-neutral-300 mb-2 font-medium">Komentar</label>
        <textarea
          {...register('comment', { required: true })}
          rows={3}
          placeholder="Bagikan pendapatmu tentang tayangan ini..."
          className="w-full bg-[#0b0c0f] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white focus:border-[#00dc74] outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-[#00dc74] text-black font-bold rounded-lg hover:bg-[#00c266] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
      >
        <Send className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}
