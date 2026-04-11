'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Film, MessageSquare, Star } from 'lucide-react';
import { Card, CardHeader, CardDescription, CardTitle, CardAction } from '@/components/ui/card';

export function UserSectionCards() {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;
  const userId = personalInfo?.id;
  
  const { data: userDetailData } = useUserDetail(userId || '');
  const filmLists = userDetailData?.data?.film_lists || [];
  const reviews = userDetailData?.data?.reviews || [];

  const totalFilmLists = filmLists.length;
  const totalWatching = filmLists.filter((item: any) => item.list_status === 'watching').length;
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 mb-8">
      
      {/* Total Film Lists */}
      <Card className="@container/card border border-border bg-card">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Total Film Lists</CardDescription>
          <CardTitle className="text-2xl font-bold text-foreground tabular-nums @[250px]/card:text-3xl mt-2">
            {totalFilmLists}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
              <Film className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Watching */}
      <Card className="@container/card border border-border bg-card">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Sedang Ditonton</CardDescription>
          <CardTitle className="text-2xl font-bold text-foreground tabular-nums @[250px]/card:text-3xl mt-2">
            {totalWatching}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
              <Film className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Total Reviews */}
      <Card className="@container/card border border-border bg-card">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Total Reviews</CardDescription>
          <CardTitle className="text-2xl font-bold text-foreground tabular-nums @[250px]/card:text-3xl mt-2">
            {totalReviews}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Average Rating */}
      <Card className="@container/card border border-border bg-card">
        <CardHeader>
          <CardDescription className="text-muted-foreground font-medium">Rating Rata-rata</CardDescription>
          <CardTitle className="text-2xl font-bold text-foreground tabular-nums @[250px]/card:text-3xl mt-2">
            {avgRating}
          </CardTitle>
          <CardAction>
            <div className="p-2.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </CardAction>
        </CardHeader>
      </Card>

    </div>
  );
}
