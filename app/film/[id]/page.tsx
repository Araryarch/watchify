'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useFilmDetail } from '@/lib/hooks/useFilms';
import { useAddToFilmList } from '@/lib/hooks/useFilmLists';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { useCreateReaction, useUpdateReaction } from '@/lib/hooks/useReactions';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { useMe } from '@/lib/hooks/useAuth';
import { useThemeGradient } from '@/lib/hooks/useThemeGradient';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import {
  Star, Calendar, Film as FilmIcon, Play, BookmarkPlus,
  Send, ThumbsUp, ThumbsDown
} from 'lucide-react';

import { FilmDetailSkeleton } from '@/components/skeleton-loader';

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
  const { mutate: addToList, isPending } = useAddToFilmList();

  if (!token) return null;

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

// Component to display user info in review
function ReviewUserInfo({ userId }: { userId: string }) {
  const { data: userData } = useUserDetail(userId);
  const user = userData?.data;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center">
          <span className="text-[#00dc74] font-bold text-sm sm:text-base">
            {userId.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white font-medium text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center">
        <span className="text-[#00dc74] font-bold text-sm sm:text-base">
          {(user.personal_info?.display_name || user.personal_info?.username || 'U').substring(0, 2).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="text-white font-medium text-sm sm:text-base">
          {user.personal_info?.display_name || user.personal_info?.username || 'Anonymous'}
        </p>
        {user.personal_info?.bio && (
          <p className="text-neutral-500 text-xs truncate max-w-[200px]">{user.personal_info.bio}</p>
        )}
      </div>
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

function ReviewSection({ filmId, reviews }: { filmId: string; reviews?: any[] }) {
  const { token } = useAuthStore();
  const { register, handleSubmit, reset, formState } = useForm<{ comment: string }>();
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(filmId);
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();
  
  // Track user reactions locally (persisted in sessionStorage)
  const [localReactions, setLocalReactions] = useState<Record<string, { id: string; status: 'like' | 'dislike' }>>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`reactions_${filmId}`);
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  // Track reviews that user already reacted to (but we don't have the ID)
  const [alreadyReacted, setAlreadyReacted] = useState<Set<string>>(new Set());

  // Track optimistic reaction counts
  const [optimisticCounts, setOptimisticCounts] = useState<Record<string, { likes: number; dislikes: number }>>({});

  // Save to sessionStorage whenever localReactions changes
  const updateLocalReactions = (newReactions: Record<string, { id: string; status: 'like' | 'dislike' }>) => {
    setLocalReactions(newReactions);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`reactions_${filmId}`, JSON.stringify(newReactions));
    }
  };

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
          reset({ comment: '' }); // Explicitly reset with empty values
          setRating(0);
        },
        onError: (e: any) =>
          toast.error(e.response?.data?.message || 'Gagal mengirim ulasan'),
      },
    );
  };

  const getReactionCounts = (review: any) => {
    if (optimisticCounts[review.id]) {
      return optimisticCounts[review.id];
    }
    return {
      likes: review.likes || 0,
      dislikes: review.dislikes || 0
    };
  };

  const handleReaction = (review: any, status: 'like' | 'dislike') => {
    if (!token) {
      toast.error('Login terlebih dahulu untuk memberi reaksi');
      return;
    }

    // Check if user already reacted (either locally or from previous session)
    if (alreadyReacted.has(review.id)) {
      toast.info('Anda sudah memberi reaksi pada ulasan ini');
      return;
    }

    const localReaction = localReactions[review.id];
    
    if (localReaction) {
      toast.info('Anda sudah memberi reaksi pada ulasan ini');
      return;
    }
    
    // Optimistic update: increment count immediately
    const currentCounts = getReactionCounts(review);
    const newCounts = {
      likes: status === 'like' ? currentCounts.likes + 1 : currentCounts.likes,
      dislikes: status === 'dislike' ? currentCounts.dislikes + 1 : currentCounts.dislikes,
    };
    setOptimisticCounts(prev => ({ ...prev, [review.id]: newCounts }));
    
    // Create new reaction
    createReaction(
      { review_id: review.id, status },
      {
        onSuccess: () => {
          toast.success(status === 'like' ? 'Disukai' : 'Tidak disukai');
          // Store that user reacted (without ID since API doesn't return it)
          updateLocalReactions({
            ...localReactions,
            [review.id]: { id: 'local', status }
          });
        },
        onError: (e: any) => {
          // Revert optimistic update on error
          setOptimisticCounts(prev => {
            const newCounts = { ...prev };
            delete newCounts[review.id];
            return newCounts;
          });
          
          const errorMsg = e.response?.data?.error || e.response?.data?.message || '';
          
          // If user already reacted in a previous session
          if (errorMsg.includes('already reacted')) {
            setAlreadyReacted(prev => new Set(prev).add(review.id));
            toast.info('Anda sudah memberi reaksi, reaksi hanya bisa dilakukan sekali pada 1 review');
          } else {
            toast.error(errorMsg || 'Gagal memberi reaksi');
          }
        },
      }
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

      {/* Display existing reviews */}
      {reviews && reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Ulasan Pengguna ({reviews.length})</h3>
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ReviewUserInfo userId={review.user_id} />
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-yellow-400 text-xs sm:text-sm font-bold ml-1">{review.rating}/10</span>
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                  </div>
                </div>
                
                {/* Reaction buttons */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleReaction(review, 'like')}
                    disabled={!token || alreadyReacted.has(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs sm:text-sm ${
                      localReactions[review.id]?.status === 'like'
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : !token || alreadyReacted.has(review.id)
                        ? 'bg-white/5 border-white/10 text-neutral-600 cursor-not-allowed opacity-50'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                    }`}
                    title={!token ? 'Login untuk memberi reaksi' : alreadyReacted.has(review.id) ? 'Anda sudah memberi reaksi' : ''}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{getReactionCounts(review).likes}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(review, 'dislike')}
                    disabled={!token || alreadyReacted.has(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs sm:text-sm ${
                      localReactions[review.id]?.status === 'dislike'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : !token || alreadyReacted.has(review.id)
                        ? 'bg-white/5 border-white/10 text-neutral-600 cursor-not-allowed opacity-50'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                    }`}
                    title={!token ? 'Login untuk memberi reaksi' : alreadyReacted.has(review.id) ? 'Anda sudah memberi reaksi' : ''}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>{getReactionCounts(review).dislikes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
  const gradient = useThemeGradient();

  if (isLoading) {
    return <FilmDetailSkeleton />;
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
      <div className="relative overflow-hidden" style={gradient.style}>
        {film.images?.[0] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(https://film-management-api.labse.id/uploads/${film.images[0]})` }}
            />
          </>
        )}
        
        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center sm:items-end py-6 sm:py-10 lg:py-12">
            {/* Poster */}
            <div className="w-32 sm:w-40 md:w-48 lg:w-64 shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-white/10">
                {film.images?.[0] ? (
                  <img
                    src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <FilmIcon className="w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-neutral-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2.5 sm:space-y-4 lg:space-y-5 pb-2 sm:pb-4 w-full text-center sm:text-left">
              <div>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight break-words px-2 sm:px-0">{film.title}</h1>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 md:mb-4 justify-center sm:justify-start px-2 sm:px-0">
                  {film.genres?.map((genre: any) => (
                    <span key={genre.id} className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[10px] sm:text-xs md:text-sm text-gray-300 capitalize">
                      {genre.name}
                    </span>
                  ))}
                  <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-[#00dc74]/20 border border-[#00dc74]/30 rounded-full text-[10px] sm:text-xs md:text-sm text-[#00dc74]">
                    {AIRING_STATUS_MAP[film.airing_status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[10px] sm:text-xs md:text-sm text-gray-300 justify-center sm:justify-start px-2 sm:px-0">
                  {film.average_rating > 0 && (
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                      <Star className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold text-sm sm:text-base md:text-lg">{film.average_rating.toFixed(1)}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <FilmIcon className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                    <span>{film.total_episodes} Episode</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <Calendar className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />
                    <span className="hidden sm:inline">{new Date(film.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span className="sm:hidden">{new Date(film.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 px-2 sm:px-0">
                <Link
                  href={`/film/${film.id}/watch?ep=1`}
                  className="group px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-[#00dc74] hover:bg-[#00c266] text-black rounded-lg font-bold transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[0_4px_20px_rgba(0,220,116,0.3)] w-full sm:w-auto text-sm sm:text-base"
                >
                  <Play className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 fill-black" />
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
            {film.airing_status !== 'not_yet_aired' && (
              <ReviewSection filmId={film.id} reviews={film.reviews} />
            )}
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
