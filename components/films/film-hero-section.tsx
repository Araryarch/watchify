import { Play } from 'lucide-react';
import Link from 'next/link';
import { AddToListButton } from './add-to-list-button';
import { formatDate, getYear } from '@/lib/utils/date';

interface FilmHeroSectionProps {
  film: any;
  gradientStyle: any;
}

const AIRING_STATUS_MAP: Record<string, string> = {
  airing: 'Sedang Tayang',
  not_yet_aired: 'Belum Tayang',
  finished_airing: 'Selesai',
};

export function FilmHeroSection({ film, gradientStyle }: FilmHeroSectionProps) {
  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] flex items-end pb-8 sm:pb-12 overflow-hidden"
      style={gradientStyle}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${film.poster_url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          <div className="w-full md:w-48 lg:w-56 shrink-0 mx-auto md:mx-0">
            <img
              src={film.poster_url}
              alt={film.title}
              className="w-full rounded-xl shadow-2xl border-2 border-white/10"
            />
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">
                {film.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-neutral-300">
                <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full border border-white/20 font-medium">
                  {getYear(film.aired_from)}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-white/10 rounded-full border border-white/20 font-medium">
                  {AIRING_STATUS_MAP[film.airing_status] || film.airing_status}
                </span>
                {film.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-2 sm:px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 font-medium capitalize"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl mx-auto md:mx-0">
              {film.synopsis}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link
                href={`/film/${film.id}/watch`}
                className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary/90 text-black rounded-lg font-bold transition-all shadow-[0_4px_20px_rgba(0,220,116,0.4)] flex items-center justify-center gap-2 sm:gap-3"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                <span className="text-sm sm:text-base">Tonton Sekarang</span>
              </Link>
              <AddToListButton filmId={film.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
