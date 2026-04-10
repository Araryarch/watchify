'use client';

import { useState } from 'react';
import { FilmCard } from '@/components/film-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Loading from '../loading';

export default function FilmsPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: filmsData, isLoading } = useFilms({
    take: 18,
    page,
    ...(selectedGenre ? { genre: selectedGenre } : {}) as any
  });
  const { data: genresData } = useGenres();

  const heroes = filmsData?.data?.slice(0, 5) || [];

  if (isLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#0b0c0f] pb-12">
      <HeroCarousel heroes={heroes} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 relative z-30 -mt-24 md:-mt-32">
        {/* Page header + filter toggle */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            Semua Film &amp; Drama <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="genre-filter-panel"
            className={`px-5 py-2.5 border rounded-full text-white transition-all flex items-center gap-2 shrink-0 ${
              showFilters ? 'bg-[#00dc74]/10 border-[#00dc74] text-[#00dc74]' : 'bg-[#1b1c21] border-white/5 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium text-sm">Filter</span>
          </button>
        </header>

        {/* Genre filter panel */}
        {showFilters && (
          <section
            id="genre-filter-panel"
            aria-label="Filter genre"
            className="mb-8 p-5 bg-[#1b1c21] border border-white/5 rounded-xl animate-fade-in drop-shadow-xl"
          >
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Pilih Kategori</p>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              <li>
                <button
                  onClick={() => setSelectedGenre(null)}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all text-sm ${
                    selectedGenre === null
                      ? 'bg-[#00dc74] text-black shadow-[0_2px_10px_rgba(0,220,116,0.3)]'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  Semua
                </button>
              </li>
              {genresData?.data?.map((genre: any) => (
                <li key={genre.id}>
                  <button
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`px-4 py-1.5 rounded-full font-medium transition-all capitalize text-sm ${
                      selectedGenre === genre.id
                        ? 'bg-[#00dc74] text-black shadow-[0_2px_10px_rgba(0,220,116,0.3)]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {genre.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Film grid */}
        <section aria-label="Daftar film">
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 mb-16 list-none p-0 m-0">
            {filmsData?.data?.map((film: any) => (
              <li key={film.id || film.title}>
                <FilmCard film={film} />
              </li>
            ))}
          </ol>

          {/* Pagination */}
          {filmsData?.meta?.[0] && filmsData.meta[0].total_page > 1 && (
            <nav aria-label="Navigasi halaman" className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Halaman sebelumnya"
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-full text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <p className="flex items-center gap-2 px-5 py-2 bg-[#1b1c21] rounded-full border border-white/5 text-sm text-neutral-400">
                Halaman <strong className="text-white">{page}</strong> dari{' '}
                <strong className="text-white">{filmsData.meta[0].total_page}</strong>
              </p>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= filmsData.meta[0].total_page}
                aria-label="Halaman berikutnya"
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-full text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}

