'use client';

import { HeroCarousel } from '@/components/hero-carousel';
import { FilmSection } from '@/components/home/film-section';
import { useFilms } from '@/lib/hooks/useFilms';
import Loading from './loading';

export default function HomePage() {
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ take: 20, page: 1 });

  if (filmsLoading) return <Loading />;

  const heroes = filmsData?.data?.slice(0, 5) || [];
  const films = filmsData?.data || [];
  const trendingFilms = [...films].reverse();

  return (
    <main className="min-h-screen bg-[#0b0c0f] pb-20">
      <h1 className="sr-only">Watchify - Streaming Film dan Drama Terbaik</h1>
      
      <HeroCarousel heroes={heroes} />

      <FilmSection
        title="Popular on Watchify"
        films={films}
        ariaLabel="Popular on Watchify"
        className="relative z-30 -mt-28 md:-mt-32 group/section drop-shadow-lg"
      />

      <FilmSection
        title="Trending Sekarang"
        films={trendingFilms}
        ariaLabel="Trending Sekarang"
        className="pt-4 relative z-10 hover:z-20"
      />
    </main>
  );
}
