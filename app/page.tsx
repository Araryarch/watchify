'use client';

import { FilmCard } from '@/components/film-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { useFilms } from '@/lib/hooks/useFilms';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Loading from './loading';
import { Typography } from '@/components/ui/typography';

export default function HomePage() {
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ take: 20, page: 1 });

  const recScrollRef = useRef<HTMLDivElement>(null);
  const trendScrollRef = useRef<HTMLDivElement>(null);

  const [recScroll, setRecScroll] = useState({ left: false, right: true });
  const [trendScroll, setTrendScroll] = useState({ left: false, right: true });

  useEffect(() => {
    if (!filmsLoading && filmsData?.data) {
      const initScroll = (ref: React.RefObject<HTMLDivElement | null>, setState: Function) => {
        if (ref.current) {
          setState({
            left: ref.current.scrollLeft > 10,
            right: ref.current.scrollWidth > ref.current.clientWidth + 10,
          });
        }
      };
      const timeout = setTimeout(() => {
        initScroll(recScrollRef, setRecScroll);
        initScroll(trendScrollRef, setTrendScroll);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [filmsData, filmsLoading]);

  const onScrollContainer = (e: React.UIEvent<HTMLDivElement>, setState: Function) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    setState({
      left: scrollLeft > 10,
      right: Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10,
    });
  };

  const heroes = filmsData?.data?.slice(0, 5) || [];

  const slide = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const container = ref.current;
      const cardWidth = 190; // lg card width
      const gap = 16; // gap-4
      const scrollAmount = (cardWidth + gap) * 3; // scroll 3 cards at a time
      
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  if (filmsLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#0b0c0f] pb-20">
      {/* Visually hidden h1 for SEO and accessibility */}
      <h1 className="sr-only">Watchify - Streaming Film dan Drama Terbaik</h1>
      
      <HeroCarousel heroes={heroes} />

      {/* Popular Slider */}
      <section className="relative z-30 -mt-28 md:-mt-32 w-full group/section" aria-label="Popular on Watchify">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="w-full flex items-center gap-2">
            {/* Header aligned with cards */}
            <div className="hidden lg:block shrink-0 w-12" />
            <header className="flex-1 flex items-center justify-between mb-4">
              <Typography variant="h3" className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 hover:text-primary cursor-pointer transition-colors drop-shadow-lg border-0 pb-0">
                Popular on Watchify <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
              </Typography>
            </header>
            <div className="hidden lg:block shrink-0 w-12" />
          </div>

          <div className="w-full flex items-center gap-2">
            {/* Left Arrow Wrapper */}
            <div className="hidden lg:block shrink-0 w-12">
              {recScroll.left && (
                <button 
                  onClick={() => slide(recScrollRef, 'left')} 
                  aria-label="Geser kiri" 
                  className="w-12 h-20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
            </div>

            {/* Carousel Content */}
            <div ref={recScrollRef} onScroll={(e) => onScrollContainer(e, setRecScroll)} role="list" className="flex-1 flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pt-10 pb-48 -mb-40" style={{ scrollSnapType: 'x mandatory' }}>
              {filmsData?.data?.map((film: any) => (
                <div role="listitem" key={film.id || film.title} className="shrink-0 w-[140px] sm:w-[160px] md:w-[170px] lg:w-[190px]" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>
                  <FilmCard film={film} />
                </div>
              ))}
              <div className="shrink-0 w-4" aria-hidden="true" />
            </div>

            {/* Right Arrow Wrapper */}
            <div className="hidden lg:block shrink-0 w-12">
              {recScroll.right && (
                <button 
                  onClick={() => slide(recScrollRef, 'right')} 
                  aria-label="Geser kanan" 
                  className="w-12 h-20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="pt-4 w-full relative z-10 hover:z-20" aria-label="Trending Sekarang">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="w-full flex items-center gap-2">
            {/* Header aligned with cards */}
            <div className="hidden lg:block shrink-0 w-12" />
            <header className="flex-1 flex items-center justify-between mb-4">
              <Typography variant="h3" className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 hover:text-primary cursor-pointer transition-colors border-0 pb-0">
                Trending Sekarang <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
              </Typography>
            </header>
            <div className="hidden lg:block shrink-0 w-12" />
          </div>

          <div className="w-full flex items-center gap-2">
            {/* Left Arrow Wrapper */}
            <div className="hidden lg:block shrink-0 w-12">
              {trendScroll.left && (
                <button 
                  onClick={() => slide(trendScrollRef, 'left')} 
                  aria-label="Geser kiri" 
                  className="w-12 h-20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
            </div>

            {/* Carousel Content */}
            <div ref={trendScrollRef} onScroll={(e) => onScrollContainer(e, setTrendScroll)} role="list" className="flex-1 flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pt-10 pb-48 -mb-40" style={{ scrollSnapType: 'x mandatory' }}>
              {filmsData?.data?.slice().reverse().map((film: any) => (
                <div role="listitem" key={film.id || film.title} className="shrink-0 w-[140px] sm:w-[160px] md:w-[170px] lg:w-[190px]" style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>
                  <FilmCard film={film} />
                </div>
              ))}
              <div className="shrink-0 w-4" aria-hidden="true" />
            </div>

            {/* Right Arrow Wrapper */}
            <div className="hidden lg:block shrink-0 w-12">
              {trendScroll.right && (
                <button 
                  onClick={() => slide(trendScrollRef, 'right')} 
                  aria-label="Geser kanan" 
                  className="w-12 h-20 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
