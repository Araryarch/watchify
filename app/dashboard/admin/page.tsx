'use client';

import { SectionCards } from "@/components/section-cards"
import { Typography } from "@/components/ui/typography"
import { useMe } from '@/lib/hooks/useAuth';
import { useUserDetail } from '@/lib/hooks/useUsers';
import { Star, Film, List } from 'lucide-react';

export default function Page() {
  const { data: userData } = useMe();
  const user = userData?.data?.personal_info;
  const userId = userData?.data?.personal_info?.id;
  
  // Get detailed user data including film_lists and reviews
  const { data: userDetailData } = useUserDetail(userId || '');
  const userDetail = userDetailData?.data;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 bg-[#0b0c0f] font-sans min-h-full">
      <div className="flex flex-col gap-4 py-8 md:gap-6 text-white h-full px-4 lg:px-8">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 border-0 pb-0">Selamat Datang di Watchify Admin</Typography>
          <Typography variant="p" className="text-sm font-medium text-neutral-400 mb-8 mt-0">Pantau lalu lintas dan aktivitas database tayangan harian Anda</Typography>
        </div>
        <SectionCards />

        {/* Admin Activity Section */}
        {userDetail && (
          <div className="mt-8">
            <Typography variant="h2" className="text-xl sm:text-2xl font-bold mb-4 border-0 pb-0">Aktivitas Saya</Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Film Lists */}
              {userDetail.film_lists && userDetail.film_lists.length > 0 && (
                <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <List className="w-5 h-5 text-primary" />
                    <Typography variant="h3" className="text-lg font-bold border-0 pb-0 mb-0">Daftar Tontonan ({userDetail.film_lists.length})</Typography>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userDetail.film_lists.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <Film className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{item.film_title}</p>
                          <p className="text-xs text-neutral-500 capitalize">{item.list_status.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {userDetail.reviews && userDetail.reviews.length > 0 && (
                <div className="bg-[#1b1c21] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-primary" />
                    <Typography variant="h3" className="text-lg font-bold border-0 pb-0 mb-0">Ulasan Saya ({userDetail.reviews.length})</Typography>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userDetail.reviews.map((review: any, index: number) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium text-sm">{review.film}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(review.rating, 5) }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-yellow-400 text-xs font-bold ml-1">{review.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
