'use client';

import { useState } from 'react';
import { FilmCard } from '@/components/film-card';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

export default function FilmsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  const { data: filmsData, isLoading } = useFilms({
    take: 12,
    page,
    filter: searchQuery || undefined,
    filter_by: searchQuery ? 'title' : undefined,
  });
  
  const { data: genresData } = useGenres();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Jelajahi Film</h1>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Cari
            </Button>
          </form>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Genre:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedGenre === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedGenre(null)}
              >
                Semua
              </Badge>
              {genresData?.data?.map((genre: any) => (
                <Badge
                  key={genre.id}
                  variant={selectedGenre === genre.id ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Films Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
              {filmsData?.data?.map((film: any) => (
                <FilmCard key={film.id || film.title} film={film} />
              ))}
            </div>

            {/* Pagination */}
            {filmsData?.meta?.[0] && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm">
                    Halaman {page} dari {filmsData.meta[0].total_page}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= filmsData.meta[0].total_page}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
