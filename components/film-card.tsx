import Link from 'next/link';
import { Star, Play, Bookmark, ChevronRight } from 'lucide-react';
import { Film } from '@/lib/api/films';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  let topBadge = '';
  if (film.average_rating !== undefined && film.average_rating >= 8.5) {
     topBadge = 'TOP 10';
  } else if (film.airing_status === 'airing') {
     topBadge = 'Watchify Only';
  } else {
     topBadge = 'Original';
  }

  return (
    <div className="relative w-full group/card shrink-0">
      {/* Spacer to maintain the grid/carousel cell width & height so the layout doesn't break */}
      {/* 125% is approx aspect-[4/5], plus a bit extra base height for the static title */}
      <div className="pt-[140%] md:pt-[135%] w-full pointer-events-none" />

      {/* The actual Card container that lives absolutely over the spacer, and scales smoothly out of bounds */}
      <div className="absolute top-0 left-0 w-full transition-all duration-300 ease-out z-10 origin-bottom sm:origin-center group-hover/card:z-[100] group-hover/card:scale-105 group-hover/card:bg-[#1b1c21] group-hover/card:rounded-lg group-hover/card:shadow-[0_10px_40px_rgba(0,0,0,0.9)] outline outline-1 outline-transparent group-hover/card:outline-white/10 flex flex-col">
          <Link href={`/film/${film.id}`} className="block relative w-full overflow-hidden rounded-md group-hover/card:rounded-b-none group-hover/card:rounded-t-lg bg-[#111216] shadow-sm">
            <div className="aspect-[4/5] relative w-full overflow-hidden transition-all duration-300 group-hover/card:aspect-[16/15]">
              {film.images && film.images[0] ? (
                <Image
                  src={`https://film-management-api.labse.id/api/static/${film.images[0]}`}
                  alt={film.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-neutral-900" />
              )}
              
              <div className="absolute top-0 right-0 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold z-10 rounded-bl-lg transition-all">
                {topBadge}
              </div>

              {/* Bottom Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 to-transparent z-0 transition-opacity duration-300 group-hover/card:opacity-0"></div>
              
              {/* Expandable Gradient for Hover State */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1b1c21] via-[#1b1c21]/60 to-transparent z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

              {/* Normal Episode Info (Bottom Left) -> Hides on Hover */}
              <div className="absolute bottom-1.5 left-2 text-neutral-200 text-[10px] font-medium z-10 drop-shadow-md transition-opacity duration-300 group-hover/card:opacity-0 group-hover/card:invisible">
                {film.total_episodes} Episodes
              </div>

              {/* Quick Play & Bookmark Actions -> Appears on Hover */}
              <div className="absolute bottom-3 right-3 left-3 z-20 flex justify-end gap-2 translate-y-4 opacity-0 invisible group-hover/card:translate-y-0 group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300">
                 <button className="w-9 h-9 rounded-full bg-primary hover:brightness-90 flex items-center justify-center text-primary-foreground shadow-[0_2px_10px_rgba(var(--primary),0.3)] transition-transform hover:scale-105">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                 </button>
                 <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-transform hover:scale-105">
                    <Bookmark className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </Link>

          {/* Normal Title -> Visible normally, shrinks/hides on hover */}
          <div className="text-left px-0.5 mt-1.5 max-h-8 opacity-100 transition-all duration-300 overflow-hidden group-hover/card:max-h-0 group-hover/card:opacity-0 group-hover/card:mt-0">
            <Typography variant="h4" className="text-[13px] font-medium text-neutral-300 truncate">
              {film.title}
            </Typography>
          </div>

          {/* Expanded Details Panel -> Grows to visible on hover */}
          {/* Note: In Next.js, absolute pointer-events management isn't necessary because we are inside a Link already or wrapping it smartly. 
              The container is absolute itself, so expanding height naturally overlaps beneath cards. */}
          <Link href={`/film/${film.id}`} className="block relative w-full">
            <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:max-h-[300px] group-hover/card:opacity-100">
              <div className="p-3 sm:p-4 bg-[#1b1c21] rounded-b-lg flex flex-col justify-start">
                 <Typography variant="h3" className="text-base sm:text-[15px] font-bold text-white mb-2 leading-tight line-clamp-1 border-0 pb-0">
                   {film.title}
                 </Typography>

                 {/* Metadata Row */}
                 <div className="flex items-center gap-2 text-white text-[11px] font-medium mb-3">
                    {film.average_rating !== undefined && film.average_rating > 0 && (
                       <div className="flex items-center gap-1 text-primary">
                          <Star className="w-3 h-3 fill-primary" />
                          <span className="text-[13px] border-r border-white/20 pr-2">{film.average_rating.toFixed(1)}</span>
                       </div>
                    )}
                    {film.release_date && (
                      <span>{new Date(film.release_date).getFullYear()}</span>
                    )}
                    {film.total_episodes > 0 && (
                      <span className="border-l border-white/20 pl-2">{film.total_episodes} Eps</span>
                    )}
                 </div>

                 {/* Genre Pills — from API */}
                 {film.genres && film.genres.length > 0 && (
                   <div className="flex flex-wrap gap-1.5 mb-2.5">
                     {film.genres.slice(0, 3).map((g: any) => (
                       <span key={g.id} className="px-1.5 py-0.5 bg-[#2a2b30] text-neutral-300 text-[10px] rounded-sm border border-white/5 capitalize">
                         {g.name}
                       </span>
                     ))}
                   </div>
                 )}

                 {/* Synopsis */}
                 {film.synopsis && (
                   <Typography variant="p" className="text-[10px] sm:text-[11px] text-neutral-400 leading-snug line-clamp-3 mb-2 mt-0">
                     {film.synopsis}
                   </Typography>
                 )}

                 {/* More info link */}
                 <div className="text-right mt-1">
                   <span className="inline-flex items-center text-[11px] text-primary font-medium hover:underline">
                      more info <ChevronRight className="w-3 h-3" />
                   </span>
                 </div>
              </div>
            </div>
          </Link>
      </div>
    </div>
  );
}
