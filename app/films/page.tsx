'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroCarousel } from '@/components/hero-carousel';
import { FilmGrid } from '@/components/films/film-grid';
import { GenreFilter } from '@/components/films/genre-filter';
import { ComingSoonSection } from '@/components/films/coming-soon-section';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { CardListSkeleton } from '@/components/skeleton-loader';

export default function FilmsPage() {
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(genreFromUrl);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    setSelectedGenre(genreFromUrl);
  }, [genreFromUrl]);
  
  const { data: filmsData, isLoading } = useFilms({ take: 100 });
  const { data: genresData } = useGenres();

  if (genreFromUrl) {
    return <ComingSoonSection />;
  }

  const filteredFilms = selectedGenre
    ? filmsData?.data?.filter((film: any) => {
        if (!film.genres || !Array.isArray(film.genres)) return false;
        return film.genres.some((g: any) => g.id === selectedGenre);
      }) || []
    : filmsData?.data || [];

  const itemsPerPage = 18;
  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage);
  const paginatedFilms = filteredFilms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const heroes = filmsData?.data?.slice(0, 5) || [];

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0b0c0f] pb-12 pt-16">
        <div className="max-w-400 mx-auto px-4 lg:px-8 py-8">
          <CardListSkeleton count={18} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0c0f] pb-12">
      <HeroCarousel heroes={heroes} />

      <div className="max-w-400 mx-auto px-4 lg:px-8 relative z-30 -mt-24 md:-mt-32">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            Semua Film &amp; Drama <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            className={`px-5 py-2.5 border rounded-full text-white transition-all flex items-center gap-2 shrink-0 ${
              showFilters ? 'bg-primary/10 border-primary text-primary' : 'bg-[#1b1c21] border-white/5 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium text-sm">Filter</span>
          </button>
        </header>

        <GenreFilter
          genres={genresData?.data || []}
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <section aria-label="Daftar film">
          <FilmGrid
            films={paginatedFilms}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </main>
  );
}
