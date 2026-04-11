'use client';

import { useMe } from '@/lib/hooks/useAuth';
import { UserSectionCards } from "@/components/user-section-cards"
import { Typography } from "@/components/ui/typography"
import { ChartUserReviews } from "@/components/chart-user-reviews"

export default function Page() {
  const { data: userData } = useMe();
  const personalInfo = userData?.data?.personal_info;
  const userName = personalInfo?.display_name || personalInfo?.username || 'User';

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 bg-background font-sans min-h-full">
      <div className="flex flex-col gap-4 py-8 md:gap-6 text-foreground h-full px-4 lg:px-8">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 border-0 pb-0">
            Selamat Datang, {userName}!
          </Typography>
          <Typography variant="p" className="text-sm font-medium text-muted-foreground mb-8 mt-0">
            Pantau aktivitas dan statistik tontonan Anda
          </Typography>
        </div>
        
        {/* Stats Cards */}
        <UserSectionCards />

        {/* Chart */}
        <div className="mt-4">
          <ChartUserReviews />
        </div>
      </div>
    </div>
  )
}
