'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useFilmDetail } from '@/lib/hooks/useFilms';
import { useAddToFilmList } from '@/lib/hooks/useFilmLists';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { useCreateReaction } from '@/lib/hooks/useReactions';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import {
  Star, Calendar, Film as FilmIcon, Play, BookmarkPlus,
  Send, ChevronDown
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ListStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

const LIST_STATUS_LABELS: Record<ListStatus, string> = {
  watching: 'Sedang Menonton',
  completed: 'Selesai Ditonton',
  plan_to_watch: 'Ingin Ditonton',
  dropped: 'Berhenti',
};

const AIRING_STATUS_MAP: Record<string, string> = {
  airing: 'Sedang Tayang',
  not_yet_aired: 'Belum Tayang',
  finished_airing: 'Selesai',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AddToListButton({ filmId }: { filmId: string }) {
  const { token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { mutate: addToList, isPending } = useAddToFilmList();

  if (!token) return null;

  const handleAdd = (status: ListStatus) => {
    addToList(
      { film_id: filmId, list_status: status },
      {
        onSuccess: () => {
          toast.success(`Ditambahkan ke daftar: ${LIST_STATUS_LABELS[status]}`);
          setOpen(false);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.error || 'Gagal menambahkan ke daftar'),
      },
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="group px-4 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
      >
        <BookmarkPlus className="w-4 sm:w-5 h-4 sm:h-5 text-[#00dc74]" />
        <span className="text-sm sm:text-base">Tambah ke Daftar</span>
        <ChevronDown className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 right-0 sm:left-0 sm:right-auto z-10 w-full sm:w-52 bg-[#1b1c21] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {(Object.keys(LIST_STATUS_LABELS) as ListStatus[]).map(status => (
            <button
              key={status}
              disabled={isPending}
              onClick={() => handleAdd(status)}
              className="w-full px-4 py-3 text-left text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#00dc74]" />
              {LIST_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-600'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-yellow-400 self-center">{value}/10</span>
      )}
    </div>
  );
}

function ReviewSection({ filmId }: { filmId: string }) {
  const { token } = useAuthStore();
  const { register, handleSubmit, reset, formState } = useForm<{ comment: string }>();
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(filmId);
  const { mutate: createReaction } = useCreateReaction();

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
          reset();
          setRating(0);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.message || 'Gagal mengirim ulasan'),
      },
    );
  };

  const handleReaction = (reviewId: string, status: 'like' | 'dislike') => {
    if (!token) {
      toast.error('Login terlebih dahulu untuk memberi reaksi');
      return;
    }
    createReaction(
      { review_id: reviewId, status },
      {
        onSuccess: () => toast.success(status === 'like' ? '👍 Disukai!' : '👎 Tidak disukai'),
        onError: (e: any) => toast.error(e.response?.data?.message || 'Gagal memberi reaksi'),
      },
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Ulasan & Rating</h2>

      {/* Write review form */}
      {token ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <h3 className="text-white font-bold text-base sm:text-lg">Tulis Ulasan</h3>

          <div>
            <label className="block text-xs sm:text-sm text-neutral-400 mb-2 font-medium">Rating kamu</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-neutral-400 mb-2 font-medium">Komentar</label>
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
      ) : (
        <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-neutral-400">
          <p className="text-xs sm:text-sm">
            <a href="/login" className="text-[#00dc74] font-bold hover:underline">Login</a> untuk menulis ulasan.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FilmDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useFilmDetail(id);
  const film = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Film tidak ditemukan</h2>
          <p className="text-gray-400">Film yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        {film.images?.[0] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://film-management-api.labse.id/uploads/${film.images[0]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </>
        )}

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-end h-full pb-8 sm:pb-10 lg:pb-12">
            {/* Poster */}
            <div className="w-32 sm:w-40 md:w-48 lg:w-64 shrink-0 mx-auto sm:mx-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/10">
                {film.images?.[0] ? (
                  <img
                    src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <FilmIcon className="w-16 h-16 text-neutral-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-5 pb-2 sm:pb-4 text-center sm:text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{film.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 justify-center sm:justify-start">
                  {film.genres?.map((genre: any) => (
                    <span key={genre.id} className="px-2.5 sm:px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm text-gray-300 capitalize">
                      {genre.name}
                    </span>
                  ))}
                  <span className="px-2.5 sm:px-3 py-1 bg-[#00dc74]/20 border border-[#00dc74]/30 rounded-full text-xs sm:text-sm text-[#00dc74]">
                    {AIRING_STATUS_MAP[film.airing_status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-300 justify-center sm:justify-start">
                  {film.average_rating > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold text-base sm:text-lg">{film.average_rating.toFixed(1)}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <FilmIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>{film.total_episodes} Episode</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="hidden sm:inline">{new Date(film.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="sm:hidden">{new Date(film.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                <Link
                  href={`/film/${film.id}/watch?ep=1`}
                  className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-[#00dc74] hover:bg-[#00c266] text-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[0_4px_20px_rgba(0,220,116,0.3)] w-full sm:w-auto"
                >
                  <Play className="w-4 sm:w-5 h-4 sm:h-5 fill-black" />
                  <span>Tonton Sekarang</span>
                </Link>
                <AddToListButton filmId={film.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Synopsis */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {film.synopsis || 'Sinopsis tidak tersedia.'}
              </p>
            </div>

            {/* Gallery */}
            {film.images && film.images.length > 1 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Galeri</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {film.images.map((image: string, index: number) => (
                    <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <img
                        src={`https://film-management-api.labse.id/uploads/${image}`}
                        alt={`${film.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews & Reactions */}
            <ReviewSection filmId={film.id} />
          </div>

          {/* Sidebar column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#111214] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Info Tayangan</h3>
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status</span>
                  <span className="text-white font-medium">{AIRING_STATUS_MAP[film.airing_status]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Episode</span>
                  <span className="text-white font-medium">{film.total_episodes} EPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Rilis</span>
                  <span className="text-white font-medium">
                    {new Date(film.release_date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                {film.average_rating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Rating</span>
                    <span className="text-yellow-400 font-bold">{film.average_rating.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>
            </div>

            {film.genres && film.genres.length > 0 && (
              <div className="bg-[#111214] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {film.genres.map((genre: any) => (
                    <span key={genre.id} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#00dc74]/10 border border-[#00dc74]/20 text-[#00dc74] rounded-full text-xs font-bold capitalize">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
