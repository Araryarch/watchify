'use client';

import { FilmCard } from '@/components/film-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { useFilms } from '@/lib/hooks/useFilms';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Loading from './loading';

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
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (filmsLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#0b0c0f] pb-20">
      <HeroCarousel heroes={heroes} />

      {/* Popular Slider */}
      <section className="relative z-30 -mt-28 md:-mt-32 w-full group/section" aria-label="Popular on Watchify">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 hover:text-[#00dc74] cursor-pointer transition-colors drop-shadow-lg">
              Popular on Watchify <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
            </h2>
          </header>

          <div className="w-full relative">
            {recScroll.left && (
              <button onClick={() => slide(recScrollRef, 'left')} aria-label="Geser kiri" className="hidden lg:flex absolute -left-8 md:-left-12 top-[40%] -translate-y-1/2 w-12 h-20 items-center justify-center text-white/40 hover:text-white z-40 transition-colors">
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}
            <div ref={recScrollRef} onScroll={(e) => onScrollContainer(e, setRecScroll)} role="list" className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x pt-10 pb-48 -mb-40 -mx-6 px-6 lg:-mx-12 lg:px-12 scroll-smooth">
              {filmsData?.data?.map((film: any) => (
                <div role="listitem" key={film.id || film.title} className="shrink-0 w-[140px] sm:w-[160px] md:w-[170px] lg:w-[190px] snap-start">
                  <FilmCard film={film} />
                </div>
              ))}
            </div>
            {recScroll.right && (
              <button onClick={() => slide(recScrollRef, 'right')} aria-label="Geser kanan" className="hidden lg:flex absolute -right-8 md:-right-12 top-[40%] -translate-y-1/2 w-12 h-20 items-center justify-center text-white/40 hover:text-white z-40 transition-colors">
                <ChevronRight className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="pt-4 w-full relative z-10 hover:z-20" aria-label="Trending Sekarang">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-1 hover:text-[#00dc74] cursor-pointer transition-colors">
              Trending Sekarang <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
            </h2>
          </header>

          <div className="w-full relative">
            {trendScroll.left && (
              <button onClick={() => slide(trendScrollRef, 'left')} aria-label="Geser kiri" className="hidden lg:flex absolute -left-8 md:-left-12 top-[40%] -translate-y-1/2 w-12 h-20 items-center justify-center text-white/40 hover:text-white z-40 transition-colors">
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}
            <div ref={trendScrollRef} onScroll={(e) => onScrollContainer(e, setTrendScroll)} role="list" className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x pt-10 pb-48 -mb-40 -mx-6 px-6 lg:-mx-12 lg:px-12 scroll-smooth">
              {filmsData?.data?.slice().reverse().map((film: any) => (
                <div role="listitem" key={film.id || film.title} className="shrink-0 w-[140px] sm:w-[160px] md:w-[170px] lg:w-[190px] snap-start">
                  <FilmCard film={film} />
                </div>
              ))}
            </div>
            {trendScroll.right && (
              <button onClick={() => slide(trendScrollRef, 'right')} aria-label="Geser kanan" className="hidden lg:flex absolute -right-8 md:-right-12 top-[40%] -translate-y-1/2 w-12 h-20 items-center justify-center text-white/40 hover:text-white z-40 transition-colors">
                <ChevronRight className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
