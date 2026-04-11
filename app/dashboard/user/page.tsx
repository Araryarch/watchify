'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { MessageSquare, Star, Film } from 'lucide-react';
import { Typography } from '@/components/ui/typography';

export default function UserDashboardPage() {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;
  const userId = personalInfo?.id;
  
  const { data: userDetailData } = useUserDetail(userId || '');
  const filmLists = userDetailData?.data?.film_lists || [];
  const reviews = userDetailData?.data?.reviews || [];

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 bg-[#0b0c0f] font-sans min-h-full">
      <div className="flex flex-col gap-4 py-8 md:gap-6 text-white h-full px-4 lg:px-8">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 border-0 pb-0">
            Selamat Datang, {personalInfo?.display_name || personalInfo?.username}!
          </Typography>
          <Typography variant="p" className="text-sm font-medium text-neutral-400 mb-8 mt-0">
            Pantau aktivitas dan statistik tontonan Anda
          </Typography>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card mb-8">
          
          {/* Total Film Lists */}
          <div className="@container/card border-white/5 bg-[#1b1c21] rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm font-medium">Total Film Lists</span>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                  <Film className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tabular-nums">{filmLists.length}</p>
            </div>
          </div>

          {/* Watching */}
          <div className="@container/card border-white/5 bg-[#1b1c21] rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm font-medium">Watching</span>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                  <Film className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tabular-nums">
                {filmLists.filter((item: any) => item.list_status === 'watching').length}
              </p>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="@container/card border-white/5 bg-[#1b1c21] rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm font-medium">Total Reviews</span>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tabular-nums">{totalReviews}</p>
            </div>
          </div>

          {/* Average Rating */}
          <div className="@container/card border-white/5 bg-[#1b1c21] rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400 text-sm font-medium">Avg Rating</span>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <p className="text-3xl font-black text-white tabular-nums">{avgRating}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
