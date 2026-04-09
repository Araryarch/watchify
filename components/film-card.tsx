import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Film } from '@/lib/api/films';

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  const statusMap = {
    airing: 'Sedang Tayang',
    not_yet_aired: 'Belum Tayang',
    finished_airing: 'Selesai',
  };

  return (
    <Link href={`/film/${film.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 relative">
          {film.images && film.images[0] && (
            <img
              src={`https://film-management-api.labse.id/uploads/${film.images[0]}`}
              alt={film.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              {statusMap[film.airing_status]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{film.title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{film.total_episodes} Episode</span>
            {film.average_rating !== undefined && film.average_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{film.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
