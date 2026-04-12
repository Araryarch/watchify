'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeroCarousel } from '@/components/hero-carousel';
import { FilmGrid } from '@/components/films/film-grid';
import { GenreFilter } from '@/components/films/genre-filter';
import { ComingSoonSection } from '@/components/films/coming-soon-section';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { SlidersHorizontal, ChevronRight, Search, X } from 'lucide-react';
import { CardListSkeleton } from '@/components/skeleton-loader';

export default function FilmsPage() {
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  const searchFromUrl = searchParams.get('search');
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(genreFromUrl);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    setSelectedGenre(genreFromUrl);
  }, [genreFromUrl]);

  useEffect(() => {
    setSearchQuery(searchFromUrl || '');
  }, [searchFromUrl]);
  
  const { data: filmsData, isLoading } = useFilms({ take: 100 });
  const { data: genresData } = useGenres();

  if (genreFromUrl) {
    return <ComingSoonSection />;
  }

  // Filter by genre
  let filteredFilms = selectedGenre
    ? filmsData?.data?.filter((film: any) => {
        if (!film.genres || !Array.isArray(film.genres)) return false;
        return film.genres.some((g: any) => g.id === selectedGenre);
      }) || []
    : filmsData?.data || [];

  // Filter by search query
  if (searchQuery) {
    filteredFilms = filteredFilms.filter((film: any) =>
      film.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
      {!searchQuery && <HeroCarousel heroes={heroes} />}

      <div className={`max-w-400 mx-auto px-4 lg:px-8 relative z-30 ${searchQuery ? 'pt-24' : '-mt-24 md:-mt-32'}`}>
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Semua Film & Drama'} 
            <ChevronRight className="w-6 h-6 text-neutral-400" aria-hidden="true" />
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari film..."
                className="w-full bg-[#1b1c21] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-primary outline-none"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
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
          </div>
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
