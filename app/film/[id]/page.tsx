'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useFilmDetail } from '@/lib/hooks/useFilms';
import { useThemeGradient } from '@/lib/hooks/useThemeGradient';
import { formatDate } from '@/lib/utils/date';
import { Calendar, Film as FilmIcon, Star, Play } from 'lucide-react';
import { FilmDetailSkeleton } from '@/components/skeleton-loader';
import { AddToListButton } from '@/components/films/add-to-list-button';
import { ReviewSection } from '@/components/reviews/review-section';

const AIRING_STATUS_MAP: Record<string, string> = {
  airing: 'Sedang Tayang',
  not_yet_aired: 'Belum Tayang',
  finished_airing: 'Selesai',
};

export default function FilmDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useFilmDetail(id);
  const film = data?.data;
  const gradient = useThemeGradient();

  if (isLoading) return <FilmDetailSkeleton />;

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
      <div className="relative overflow-hidden" style={gradient.style}>
        {film.images?.[0] && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(https://film-management-api.labse.id/api/static/${film.images[0]})` }}
          />
        )}
        
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        <div className="max-w-350 mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center sm:items-end py-6 sm:py-10 lg:py-12">
            <div className="w-32 sm:w-40 md:w-48 lg:w-64 shrink-0">
              <div className="aspect-2/3 rounded-lg overflow-hidden shadow-2xl border border-white/10">
                {film.images?.[0] ? (
                  <img
                    src={`https://film-management-api.labse.id/api/static/${film.images[0]}`}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <FilmIcon className="w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 text-neutral-600" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2.5 sm:space-y-4 lg:space-y-5 pb-2 sm:pb-4 w-full text-center sm:text-left">
              <div>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight wrap-break-word px-2 sm:px-0">
                  {film.title}
                </h1>
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
                    {film.release_date ? (
                      <>
                        <span className="hidden sm:inline">{formatDate(film.release_date, 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="sm:hidden">{formatDate(film.release_date, 'id-ID', { year: 'numeric', month: 'short' })}</span>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>

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

      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {film.synopsis || 'Sinopsis tidak tersedia.'}
              </p>
            </div>

            {film.images && film.images.length > 1 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Galeri</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {film.images.map((image: string, index: number) => (
                    <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <img
                        src={`https://film-management-api.labse.id/api/static/${image}`}
                        alt={`${film.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {film.airing_status !== 'not_yet_aired' && (
              <ReviewSection filmId={film.id} reviews={film.reviews} />
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#111214] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Info Tayangan</h3>
              <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Status</span>
                  <span className="text-white font-medium">{AIRING_STATUS_MAP[film.airing_status]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Total Episode</span>
                  <span className="text-white font-medium">{film.total_episodes} EPS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Rilis</span>
                  <span className="text-white font-medium">
                    {film.release_date ? formatDate(film.release_date, 'id-ID') : '-'}
                  </span>
                </div>
                {film.average_rating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-300">Rating</span>
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
