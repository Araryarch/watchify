'use client';

import { useFilms } from '@/lib/hooks/useFilms';
import { useGenresPaginated } from '@/lib/hooks/useGenres';
import { Film, Tags, TvMinimalPlay, Clapperboard } from 'lucide-react';
import { Card, CardHeader, CardDescription, CardTitle, CardAction } from '@/components/ui/card';

export function SectionCards() {
  const { data: filmsAll } = useFilms({ take: 1, page: 1 });
  const { data: filmsAiring } = useFilms({ take: 1, page: 1, filter_by: 'airing_status', filter: 'airing' });
  const { data: filmsFinished } = useFilms({ take: 1, page: 1, filter_by: 'airing_status', filter: 'finished_airing' });
  const { data: genresAll } = useGenresPaginated({ take: 1, page: 1 });

  const totalFilms = filmsAll?.meta?.[0]?.total_data || 0;
  const totalAiring = filmsAiring?.meta?.[0]?.total_data || 0;
  const totalFinished = filmsFinished?.meta?.[0]?.total_data || 0;
  const totalGenres = genresAll?.meta?.[0]?.total_data || 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card mb-8">
      
      {/* Total Film */}
      <Card className="@container/card border-white/5 bg-[#1b1c21]">
        <CardHeader>
          <CardDescription className="text-neutral-400 font-medium">Total Tayangan</CardDescription>
          <CardTitle className="text-2xl font-bold text-white tabular-nums @[250px]/card:text-3xl mt-2">
            {totalFilms}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
              <Film className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Airing */}
      <Card className="@container/card border-white/5 bg-[#1b1c21]">
        <CardHeader>
          <CardDescription className="text-neutral-400 font-medium">Sedang Tayang (Airing)</CardDescription>
          <CardTitle className="text-2xl font-bold text-white tabular-nums @[250px]/card:text-3xl mt-2">
            {totalAiring}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
              <TvMinimalPlay className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Finished */}
      <Card className="@container/card border-white/5 bg-[#1b1c21]">
        <CardHeader>
          <CardDescription className="text-neutral-400 font-medium">Tayangan Selesai</CardDescription>
          <CardTitle className="text-2xl font-bold text-white tabular-nums @[250px]/card:text-3xl mt-2">
            {totalFinished}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
              <Clapperboard className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Total Genre */}
      <Card className="@container/card border-white/5 bg-[#1b1c21]">
        <CardHeader>
          <CardDescription className="text-neutral-400 font-medium">Total Kategori (Genre)</CardDescription>
          <CardTitle className="text-2xl font-bold text-white tabular-nums @[250px]/card:text-3xl mt-2">
            {totalGenres}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
              <Tags className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

    </div>
  );
}
