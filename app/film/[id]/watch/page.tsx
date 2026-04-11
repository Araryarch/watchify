'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useFilmDetail } from '@/lib/hooks/useFilms';
import { useAddToFilmList } from '@/lib/hooks/useFilmLists';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { useCreateReaction, useUpdateReaction } from '@/lib/hooks/useReactions';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { useMe } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Play, ChevronLeft, Share2, Monitor,
  Star, Film as FilmIcon, MessageSquare, Clock, List,
  Send, ThumbsUp, ThumbsDown
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ─── Review Components ────────────────────────────────────────────────────────

function ReviewUserInfo({ user }: { user: any }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center">
          <span className="text-[#00dc74] font-bold text-sm sm:text-base">U</span>
        </div>
        <div>
          <p className="text-white font-medium text-sm sm:text-base">Anonymous</p>
        </div>
      </div>
    );
  }

  const displayName = user.display_name || user.username || 'Anonymous';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00dc74]/20 border border-[#00dc74]/30 flex items-center justify-center">
        <span className="text-[#00dc74] font-bold text-sm sm:text-base">{initials}</span>
      </div>
      <div>
        <p className="text-white font-medium text-sm sm:text-base">{displayName}</p>
        {user.bio && (
          <p className="text-neutral-500 text-xs">{user.bio}</p>
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
  const { data: meData } = useMe();
  const currentUserId = meData?.data?.id;
  const { register, handleSubmit, reset, formState } = useForm<{ comment: string }>();
  const [rating, setRating] = useState(0);
  const { mutate: createReview, isPending } = useCreateReview(filmId);
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: updateReaction } = useUpdateReaction();

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

  // Get user's existing reaction for a review
  const getUserReaction = (review: any) => {
    if (!currentUserId || !review.reactions) return null;
    return review.reactions.find((r: any) => r.user_id === currentUserId);
  };

  // Count reactions
  const getReactionCounts = (review: any) => {
    if (!review.reactions) return { likes: 0, dislikes: 0 };
    const likes = review.reactions.filter((r: any) => r.status === 'like').length;
    const dislikes = review.reactions.filter((r: any) => r.status === 'dislike').length;
    return { likes, dislikes };
  };

  const handleReaction = (review: any, status: 'like' | 'dislike') => {
    if (!token || !currentUserId) {
      toast.error('Login terlebih dahulu untuk memberi reaksi');
      return;
    }

    const existingReaction = getUserReaction(review);
    
    if (existingReaction) {
      // User already reacted, update the reaction
      if (existingReaction.status === status) {
        toast.info('Anda sudah memberi reaksi ini');
        return;
      }
      
      // Update to different reaction
      updateReaction(
        { id: existingReaction.id, payload: { status } },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Diubah ke suka' : 'Diubah ke tidak suka');
            // Refresh will happen automatically via react-query
          },
          onError: (e: any) => {
            toast.error(e.response?.data?.error || 'Gagal mengubah reaksi');
          },
        }
      );
    } else {
      // Create new reaction
      createReaction(
        { review_id: review.id, status },
        {
          onSuccess: () => {
            toast.success(status === 'like' ? 'Disukai' : 'Tidak disukai');
            // Refresh will happen automatically via react-query
          },
          onError: (e: any) => {
            const errorMsg = e.response?.data?.error || e.response?.data?.message || '';
            toast.error(errorMsg || 'Gagal memberi reaksi');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 py-6">
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
                      <ReviewUserInfo user={review.user} />
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleReaction(review, 'like')}
                          disabled={!token}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs sm:text-sm ${
                            getUserReaction(review)?.status === 'like'
                              ? 'bg-primary/10 border-primary/30 text-primary'
                              : !token
                              ? 'bg-white/5 border-white/10 text-neutral-600 cursor-not-allowed opacity-50'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{getReactionCounts(review).likes}</span>
                        </button>
                      </TooltipTrigger>
                      {!token && (
                        <TooltipContent>
                          <p>Login untuk memberi reaksi</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleReaction(review, 'dislike')}
                          disabled={!token}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs sm:text-sm ${
                            getUserReaction(review)?.status === 'dislike'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : !token
                              ? 'bg-white/5 border-white/10 text-neutral-600 cursor-not-allowed opacity-50'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{getReactionCounts(review).dislikes}</span>
                        </button>
                      </TooltipTrigger>
                      {!token && (
                        <TooltipContent>
                          <p>Login untuk memberi reaksi</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Episode Grid ─────────────────────────────────────────────────────────────

function EpisodeGrid({ total, current, filmId }: { total: number; current: number; filmId: string }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-6 gap-1.5 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
      {Array.from({ length: total }).map((_, i) => {
        const ep = i + 1;
        const isCurrent = ep === current;
        return (
          <button
            key={ep}
            onClick={() => router.push(`/film/${filmId}/watch?ep=${ep}`)}
            className={`
              aspect-square rounded-lg text-xs font-bold flex items-center justify-center
              border transition-all
              ${isCurrent
                ? 'bg-[#00dc74] text-black border-[#00dc74] shadow-[0_0_12px_rgba(0,220,116,0.4)]'
                : 'bg-[#1b1c21] text-neutral-400 border-white/5 hover:border-[#00dc74]/40 hover:text-white'
              }
            `}
          >
            {ep}
          </button>
        );
      })}
    </div>
  );
}

// ─── Mock Video Player ────────────────────────────────────────────────────────

function VideoPlayer({ posterUrl, title, episode }: { posterUrl?: string; title: string; episode: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className="relative w-full bg-black overflow-hidden group cursor-pointer"
      style={{ aspectRatio: '16/9' }}
      onClick={() => setPlaying(p => !p)}
    >
      {/* Poster / backdrop */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${playing ? 'scale-105 brightness-50' : 'brightness-75'}`}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      {/* Watermark */}
      <div className="absolute top-4 right-4 text-[#00dc74] font-black text-xl tracking-widest opacity-70 select-none">
        WATCHIFY
      </div>

      {/* Episode badge */}
      <div className="absolute top-4 left-4 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
        <span className="text-white text-xs font-bold">Episode {episode}</span>
      </div>

      {/* Center play state */}
      <div className="absolute inset-0 flex items-center justify-center">
        {playing ? (
          <div className="flex flex-col items-center gap-3 select-none">
            {/* Fake loading/playing animation */}
            <div className="w-16 h-16 rounded-full border-4 border-[#00dc74]/30 border-t-[#00dc74] animate-spin" />
            <span className="text-white/60 text-sm font-medium">Memuat tayangan...</span>
            <span className="text-neutral-500 text-xs">Demo mode – video tidak tersedia</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform">
            <div className="w-20 h-20 rounded-full bg-[#00dc74]/20 border-2 border-[#00dc74] flex items-center justify-center shadow-[0_0_40px_rgba(0,220,116,0.4)] backdrop-blur-sm">
              <Play className="w-9 h-9 fill-[#00dc74] text-[#00dc74] ml-1" />
            </div>
            <span className="text-white font-bold text-lg drop-shadow-lg">{title}</span>
            <span className="text-neutral-400 text-sm">Episode {episode}</span>
          </div>
        )}
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="h-full bg-[#00dc74] transition-all duration-1000"
          style={{ width: playing ? '30%' : '0%' }}
        />
      </div>
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function WatchPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const filmId = params.id as string;
  const currentEp = parseInt(searchParams.get('ep') || '1');

  const { data, isLoading } = useFilmDetail(filmId);
  const { token } = useAuthStore();
  const { mutate: addToList } = useAddToFilmList();
  const film = data?.data;

  const handleWatchLater = () => {
    if (!token) { toast.error('Login terlebih dahulu'); return; }
    addToList(
      { film_id: filmId, list_status: 'plan_to_watch' },
      {
        onSuccess: () => toast.success('Ditambahkan ke daftar "Ingin Ditonton"'),
        onError: (e: any) => toast.error(e.response?.data?.error || 'Gagal menambahkan'),
      },
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link berhasil disalin!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-5xl font-black text-[#00dc74] mb-4">404</p>
          <p className="font-bold text-xl">Film tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const posterUrl = film.images?.[0]
    ? `https://film-management-api.labse.id/api/static/${film.images[0]}`
    : undefined;

  const statusMap: Record<string, string> = {
    airing: 'Sedang Tayang',
    not_yet_aired: 'Belum Tayang',
    finished_airing: 'Selesai',
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-white font-sans">
      {/* Top nav bar with gradient */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-teal-900/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/film/${filmId}`} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Link href="/" className="text-[#00dc74] font-black text-lg tracking-widest">WATCHIFY</Link>
          <div className="ml-2 hidden md:flex items-center gap-1 text-sm text-neutral-400">
            <span className="hover:text-white cursor-pointer transition-colors">{film.title}</span>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-white font-bold">Episode {currentEp}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-0 md:px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-5">

          {/* ── LEFT: Player + info ── */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            <div className="rounded-none lg:rounded-xl overflow-hidden border-0 lg:border border-white/5 shadow-2xl">
              <VideoPlayer posterUrl={posterUrl} title={film.title} episode={currentEp} />
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-1">
                <ActionButton icon={<MessageSquare className="w-4 h-4" />} label="Komentar" onClick={() => {}} />
                <ActionButton icon={<Clock className="w-4 h-4" />} label="Tonton Nanti" onClick={handleWatchLater} />
                <ActionButton icon={<Share2 className="w-4 h-4" />} label="Bagikan" onClick={handleShare} />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <ActionButton icon={<Monitor className="w-4 h-4" />} label="Tonton di TV" onClick={() => toast.info('Fitur segera hadir')} />
              </div>
            </div>

            {/* Film meta below player */}
            <div className="px-4 py-5 space-y-3">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-2xl font-black text-white">{film.title}</h1>
                <span className="text-neutral-400 font-bold text-xl">›</span>
                <span className="text-xl font-bold text-neutral-300">Episode {currentEp}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                {film.average_rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{film.average_rating.toFixed(1)}</span>
                    <span className="text-neutral-500">/ 10</span>
                  </div>
                )}
                <MetaBadge color="green">{statusMap[film.airing_status] || 'Selesai'}</MetaBadge>
                <MetaBadge color="default">
                  {new Date(film.release_date).getFullYear()}
                </MetaBadge>
                <MetaBadge color="default">{film.total_episodes} Episode</MetaBadge>
                {film.genres?.map((g: any) => (
                  <MetaBadge key={g.id} color="default" className="capitalize">{g.name}</MetaBadge>
                ))}
              </div>

              {film.synopsis && (
                <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl line-clamp-3">
                  {film.synopsis}
                </p>
              )}
            </div>

            {/* Reviews Section */}
            {film.airing_status !== 'not_yet_aired' && (
              <ReviewSection filmId={film.id} reviews={film.reviews} />
            )}
          </div>

          {/* ── RIGHT: Episode list sidebar ── */}
          <div className="w-full lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-white/5">
            <div className="lg:sticky lg:top-[57px] bg-[#111214] lg:bg-transparent lg:rounded-xl lg:border lg:border-white/5 overflow-hidden">

              {/* Sidebar header */}
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-white font-black text-lg truncate">{film.title}</h2>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                <div className="flex-1 text-center py-3 text-sm font-bold text-[#00dc74] border-b-2 border-[#00dc74]">
                  Episodes
                </div>
              </div>

              {/* Info strip */}
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">
                  Episode 1–{film.total_episodes}
                </span>
                <div className="flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-xs text-neutral-500">{film.total_episodes} eps</span>
                </div>
              </div>

              {/* Episode numbers */}
              <div className="p-4">
                <EpisodeGrid
                  total={film.total_episodes}
                  current={currentEp}
                  filmId={filmId}
                />
              </div>

              {/* Next ep button */}
              {currentEp < film.total_episodes && (
                <div className="px-4 pb-4">
                  <Link
                    href={`/film/${filmId}/watch?ep=${currentEp + 1}`}
                    className="block w-full py-3 rounded-xl bg-[#00dc74] text-black font-bold text-center text-sm hover:bg-[#00c266] transition-all shadow-[0_4px_15px_rgba(0,220,116,0.3)]"
                  >
                    Episode Selanjutnya →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,220,116,0.3); }
      `}</style>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white text-xs font-medium rounded-lg hover:bg-white/5 transition-all"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function MetaBadge({ children, color = 'default', className = '' }: { children: React.ReactNode; color?: 'green' | 'default'; className?: string }) {
  return (
    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
      color === 'green'
        ? 'bg-[#00dc74]/10 text-[#00dc74] border-[#00dc74]/20'
        : 'bg-white/5 text-neutral-400 border-white/10'
    } ${className}`}>
      {children}
    </span>
  );
}

// ─── Page with Suspense (required for useSearchParams) ────────────────────────

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0c0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00dc74] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WatchPageInner />
    </Suspense>
  );
}
