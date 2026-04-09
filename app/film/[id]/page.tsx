'use client';

import { useParams } from 'next/navigation';
import { useFilmDetail } from '@/lib/hooks/useFilms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Calendar, Film as FilmIcon, Play } from 'lucide-react';

export default function FilmDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data, isLoading } = useFilmDetail(id);
  const film = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Film tidak ditemukan</h2>
          <p className="text-muted-foreground">Film yang Anda cari tidak tersedia</p>
        </div>
      </div>
    );
  }

  const statusMap = {
    airing: 'Sedang Tayang',
    not_yet_aired: 'Belum Tayang',
    finished_airing: 'Selesai',
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-gray-900 to-black">
        {film.images && film.images[0] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
              style={{
                backgroundImage: `url(https://film-management-api.labse.id/uploads/${film.images[0]})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        )}
        
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end h-full pb-8">
            <div className="w-48 md:w-64 flex-shrink-0">
              <Card className="overflow-hidden shadow-2xl">
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900">
                  {film.images && film.images[0] && (
                    <img
                      src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
                      alt={film.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </Card>
            </div>

            <div className="flex-1 text-white space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">{film.title}</h1>
              
              <div className="flex flex-wrap gap-2">
                {film.genres?.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-black/50 border-white/20 text-white">
                  {statusMap[film.airing_status as keyof typeof statusMap]}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                {film.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{film.average_rating.toFixed(1)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FilmIcon className="w-5 h-5" />
                  <span>{film.total_episodes} Episode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(film.release_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Tonton Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
          <p className="text-muted-foreground leading-relaxed">
            {film.synopsis || 'Sinopsis tidak tersedia.'}
          </p>

          {film.images && film.images.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Galeri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {film.images.map((image: string, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <img
                      src={`https://film-management-api.labse.id/uploads/${image}`}
                      alt={`${film.title} - ${index + 1}`}
                      className="w-full aspect-video object-cover hover:scale-105 transition-transform"
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
