'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilmCard } from '@/components/film-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Construction, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Loading from '../loading';

import { CardListSkeleton } from '@/components/skeleton-loader';

export default function FilmsPage() {
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get('genre');
  
  const [selectedGenre, setSelectedGenre] = useState<string | null>(genreFromUrl);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sync selectedGenre with URL parameter
  useEffect(() => {
    setSelectedGenre(genreFromUrl);
  }, [genreFromUrl]);
  
  const { data: filmsData, isLoading } = useFilms({ take: 100 }); // Fetch all films
  const { data: genresData } = useGenres();

  // If genre parameter exists, show coming soon
  if (genreFromUrl) {
    return (
      <main className="min-h-screen bg-[#0b0c0f] pt-16 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center space-y-6 py-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <Construction className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Coming Soon
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto">
            Fitur filter film berdasarkan genre sedang dalam pengembangan. 
            Kami sedang bekerja keras untuk menghadirkan pengalaman terbaik untuk Anda!
          </p>

          {/* Features list */}
          <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-6 sm:p-8 mt-8 text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4 text-center">
              Yang Akan Datang
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Filter film berdasarkan genre favorit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Pencarian film yang lebih canggih</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Sorting berdasarkan rating, tahun, dan popularitas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Rekomendasi film personal</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/films"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg transition-all shadow-[0_4px_20px_rgba(0,220,116,0.3)]"
            >
              Lihat Semua Film
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all border border-white/10"
            >
              Kembali ke Beranda
            </Link>
          </div>

          {/* Additional info */}
          <p className="text-xs sm:text-sm text-neutral-500 pt-4">
            Pantau terus update terbaru dari kami
          </p>
        </div>
      </main>
    );
  }

  // Client-side filtering - now genres data is complete from enriched endpoint
  const filteredFilms = selectedGenre
    ? filmsData?.data?.filter((film: any) => {
        if (!film.genres || !Array.isArray(film.genres)) return false;
        
        // Genres should be array of objects {id, name} from enriched endpoint
        return film.genres.some((g: any) => g.id === selectedGenre);
      }) || []
    : filmsData?.data || [];

  // Client-side pagination
  const itemsPerPage = 18;
  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage);
  const paginatedFilms = filteredFilms.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const heroes = filmsData?.data?.slice(0, 5) || [];

  const handleGenreChange = (genreId: string | null) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset to page 1 when changing genre
  };

  if (isLoading) return (
    <main className="min-h-screen bg-[#0b0c0f] pb-12 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        <CardListSkeleton count={18} />
      </div>
    </main>
  );

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
              showFilters ? 'bg-primary/10 border-primary text-primary' : 'bg-[#1b1c21] border-white/5 hover:border-white/20'
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
                  onClick={() => handleGenreChange(null)}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all text-sm ${
                    selectedGenre === null
                      ? 'bg-primary text-black shadow-[0_2px_10px_rgba(var(--primary),0.3)]'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  Semua
                </button>
              </li>
              {genresData?.data?.map((genre: any) => (
                <li key={genre.id}>
                  <button
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-4 py-1.5 rounded-full font-medium transition-all capitalize text-sm ${
                      selectedGenre === genre.id
                        ? 'bg-primary text-black shadow-[0_2px_10px_rgba(var(--primary),0.3)]'
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
          {paginatedFilms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-lg">Tidak ada film ditemukan untuk genre ini.</p>
            </div>
          ) : (
            <>
              <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 mb-16 list-none p-0 m-0">
                {paginatedFilms.map((film: any) => (
                  <li key={film.id || film.title}>
                    <FilmCard film={film} />
                  </li>
                ))}
              </ol>

              {/* Pagination */}
              {totalPages > 1 && (
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
                    <strong className="text-white">{totalPages}</strong>
                  </p>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages}
                    aria-label="Halaman berikutnya"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 rounded-full text-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
