import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Film } from '@/lib/api/films';
import { Typography } from '@/components/ui/typography';

interface HeroCarouselProps {
  heroes: Film[];
}

export function HeroCarousel({ heroes }: HeroCarouselProps) {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    if (heroes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroes.length);
    }, 8000); // Slower interval for better UX
    return () => clearInterval(interval);
  }, [heroes.length]);

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroes.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + heroes.length) % heroes.length);

  if (heroes.length === 0) {
    return (
      <section className="relative h-[85vh] w-full bg-[#0b0c0f] animate-pulse" />
    );
  }

  return (
    <section className="relative h-[85vh] w-full bg-neutral-900 group/hero">
      {heroes.map((film: any, idx: number) => (
        <div 
          key={film.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
             {/* Left gradient for text readability */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0f]/90 via-[#0b0c0f]/40 to-transparent z-10 w-full md:w-3/5" />
             {/* Bottom gradient to blend into content rows smoothly */}
             <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent z-10" />
             <img
                src={film.images && film.images.length > 0 ? `https://film-management-api.labse.id/uploads/${film.images[0]}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80"}
                alt={film.title}
                onError={(e) => {
                   (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80";
                }}
                className="w-full h-full object-cover object-center md:object-right"
             />
          </div>
          
          {/* Hero Content (Vertically Centered on Left) */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div className="max-w-[1600px] w-full mx-auto px-6 lg:px-12 mt-16 md:mt-20">
              <div className="max-w-xl md:max-w-2xl space-y-4">
                
                {/* Title */}
                <Typography variant="h1" className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.1] drop-shadow-lg tracking-tight border-0 pb-0">
                  {film.title}
                </Typography>

                {/* Badges Row 1 */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                   <span className="px-2 py-0.5 bg-[#00dc74] text-black text-xs font-bold rounded-sm">
                     TOP 1
                   </span>
                   <span className="px-2 py-0.5 bg-white/20 text-neutral-200 text-xs font-semibold rounded-sm backdrop-blur-sm">
                     High Popularity
                   </span>
                   <span className="px-2 py-0.5 bg-[#00dc74]/20 text-[#00dc74] text-xs font-bold rounded-sm border border-[#00dc74]/30">
                     Original
                   </span>
                </div>

                {/* Metadata Row 2 */}
                <div className="flex items-center gap-3 text-white text-sm font-medium">
                   {film.average_rating !== undefined && film.average_rating > 0 && (
                      <div className="flex items-center gap-1 text-[#00dc74]">
                         <Star className="w-4 h-4 fill-[#00dc74]" />
                         <span className="text-base">{film.average_rating.toFixed(1)}</span>
                      </div>
                   )}
                   <span className="text-neutral-300">|</span>
                   <span>{film.release_date ? new Date(film.release_date).getFullYear() : '2024'}</span>
                   <span className="text-neutral-300">|</span>
                   <span>13+</span>
                   <span className="text-neutral-300">|</span>
                   <span>{film.total_episodes} Episodes</span>
                </div>
                
                {/* Synopsis */}
                <Typography variant="p" className="text-sm md:text-[15px] text-neutral-300 leading-relaxed line-clamp-3 max-w-xl drop-shadow-md">
                  {film.synopsis || "Sebuah drama fantasi romantis yang menakjubkan. Saat rahasia dunia terbuka, cinta sejati akan diuji oleh takdir. Saksikan episodenya sekarang secara eksklusif."}
                </Typography>
                
                {/* Circular Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <Link href={`/film/${film.id}`}>
                    <button className="w-14 h-14 rounded-full bg-[#00dc74] hover:bg-[#00c266] text-black flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-[0_4px_20px_rgba(0,220,116,0.4)]">
                      <Play className="w-6 h-6 fill-black translate-x-0.5" />
                    </button>
                  </Link>
                  <button className="w-14 h-14 rounded-full bg-[#1b1c21] hover:bg-neutral-700/80 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                     <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Huge side arrows for Hero navigation */}
      <button onClick={prevHero} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-20 flex items-center justify-center text-white/50 hover:text-white z-30 transition-colors opacity-0 group-hover/hero:opacity-100">
         <ChevronLeft className="w-12 h-12" />
      </button>
      <button onClick={nextHero} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-20 flex items-center justify-center text-white/50 hover:text-white z-30 transition-colors opacity-0 group-hover/hero:opacity-100">
         <ChevronRight className="w-12 h-12" />
      </button>

      {/* Carousel Indicators (Squares) */}
      <div className="absolute bottom-[20%] right-8 z-30 flex gap-1.5 hidden md:flex">
        {heroes.map((_: any, idx: number) => (
           <button
             key={idx}
             onClick={() => setCurrentHero(idx)}
             className={`h-1.5 rounded-sm transition-all duration-300 ${
               idx === currentHero ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
             }`}
           />
        ))}
      </div>
    </section>
  );
}
