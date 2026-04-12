'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { MessageSquare, Star } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ReviewsTable } from '@/components/dashboard/reviews-table';

export default function AdminReviewsPage() {
  const { data: userData } = useMe();
  const userId = userData?.data?.personal_info?.id;
  const { data: userDetailData, isLoading } = useUserDetail(userId || '');
  const reviews = userDetailData?.data?.reviews || [];

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const totalLikes = reviews.reduce((sum: number, r: any) => sum + (r.likes || 0), 0);

  return (
    <div className="flex-1 w-full bg-[#0b0c0f] font-sans text-white p-4 sm:p-6 lg:p-8 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Typography variant="h2" className="text-3xl font-black mb-2 border-0 pb-0">Ulasan Saya</Typography>
          <Typography variant="p" className="text-neutral-400 mt-0">Lihat semua ulasan yang sudah Anda tulis</Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard label="Total Reviews" value={totalReviews} icon={MessageSquare} />
          <StatsCard label="Avg Rating" value={avgRating} icon={Star} iconColor="text-yellow-400" />
          <StatsCard label="Total Likes" value={totalLikes} icon={Star} iconColor="text-green-400" />
        </div>

        <ReviewsTable reviews={reviews} isLoading={isLoading} />
      </div>
    </div>
  );
}
