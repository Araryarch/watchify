'use client';

import { SectionCards } from "@/components/section-cards"
import { Typography } from "@/components/ui/typography"
import { ChartFilmStatus } from "@/components/chart-film-status"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 bg-[#0b0c0f] font-sans min-h-full">
      <div className="flex flex-col gap-4 py-8 md:gap-6 text-white h-full px-4 lg:px-8">
        <div>
          <Typography variant="h1" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 border-0 pb-0">Selamat Datang di Watchify Admin</Typography>
          <Typography variant="p" className="text-sm font-medium text-neutral-400 mb-8 mt-0">Pantau lalu lintas dan aktivitas database tayangan harian Anda</Typography>
        </div>
        
        {/* Stats Cards */}
        <SectionCards />

        {/* Chart */}
        <div className="mt-4">
          <ChartFilmStatus />
        </div>
      </div>
    </div>
  )
}
