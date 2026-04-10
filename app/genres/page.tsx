'use client';

import { useGenres } from '@/lib/hooks/useGenres';
import { Film, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Loading from '../loading';

export default function GenresPage() {
  const { data: genresData, isLoading } = useGenres();

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0b0c0f] pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Semua Kategori</h1>
          <p className="text-neutral-400">Jelajahi tayangan berdasarkan kategori favorit Anda</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {genresData?.data?.map((genre: any) => (
              <Link key={genre.id} href={`/films?genre=${genre.id}`}>
                <div className="group p-6 bg-[#1b1c21] hover:bg-[#202128] border border-white/5 hover:border-primary/50 rounded-xl transition-all cursor-pointer h-full shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 group-hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                      <Film className="w-5 h-5 text-primary group-hover:text-black" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-bold text-white capitalize mb-1">
                    {genre.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Jelajahi koleksi {genre.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
      </div>
    </div>
  );
}
