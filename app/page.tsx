'use client';

import { Button } from '@/components/ui/button';
import { FilmCard } from '@/components/film-card';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { Badge } from '@/components/ui/badge';
import { Play, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: filmsData, isLoading: filmsLoading } = useFilms({ take: 8, page: 1 });
  const { data: genresData } = useGenres();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Watchify</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Nikmati ribuan film dan series berkualitas HD. Streaming tanpa batas, kapan saja, di mana saja.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/films">
              <Button size="lg" className="gap-2 text-base">
                <Play className="w-5 h-5" />
                Mulai Nonton
              </Button>
            </Link>
            <Link href="/genres">
              <Button size="lg" variant="outline" className="gap-2 text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                <TrendingUp className="w-5 h-5" />
                Jelajahi Genre
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Films Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Film Trending</h2>
            <Link href="/films">
              <Button variant="ghost">Lihat Semua</Button>
            </Link>
          </div>

          {filmsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filmsData?.data?.slice(0, 8).map((film: any) => (
                <FilmCard key={film.id || film.title} film={film} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Genre Populer</h2>
          <div className="flex flex-wrap gap-3">
            {genresData?.data?.slice(0, 12).map((genre: any) => (
              <Link key={genre.id} href={`/films?genre=${genre.id}`}>
                <Badge variant="secondary" className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Kenapa Memilih Watchify?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Streaming Tanpa Batas</h3>
              <p className="text-muted-foreground">
                Tonton film favorit Anda kapan saja tanpa batasan
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Multi Device</h3>
              <p className="text-muted-foreground">
                Akses dari smartphone, tablet, atau komputer Anda
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Kualitas HD</h3>
              <p className="text-muted-foreground">
                Nikmati pengalaman menonton dengan kualitas terbaik
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
