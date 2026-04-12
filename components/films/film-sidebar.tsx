import { Star, Calendar, Film as FilmIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

interface FilmSidebarProps {
  film: any;
}

const AIRING_STATUS_MAP: Record<string, string> = {
  airing: 'Sedang Tayang',
  not_yet_aired: 'Belum Tayang',
  finished_airing: 'Selesai',
};

export function FilmSidebar({ film }: FilmSidebarProps) {
  return (
    <aside className="space-y-4 sm:space-y-6">
      <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
          Rating
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black text-yellow-400">
            {film.score?.toFixed(1) || 'N/A'}
          </span>
          <span className="text-sm sm:text-base text-neutral-400">/10</span>
        </div>
      </div>

      <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <FilmIcon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
          Informasi
        </h2>
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="text-white font-medium">
              {AIRING_STATUS_MAP[film.airing_status] || film.airing_status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Tayang Dari</span>
            <span className="text-white font-medium">{formatDate(film.aired_from)}</span>
          </div>
          {film.aired_to && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Tayang Hingga</span>
              <span className="text-white font-medium">{formatDate(film.aired_to)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-400">Episode</span>
            <span className="text-white font-medium">{film.episodes || 'N/A'}</span>
          </div>
        </div>
      </div>

      {film.genres && film.genres.length > 0 && (
        <div className="bg-[#1b1c21] border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white">Genre</h2>
          <div className="flex flex-wrap gap-2">
            {film.genres.map((genre: any) => (
              <span
                key={genre.id}
                className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20 text-xs sm:text-sm font-medium capitalize"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
