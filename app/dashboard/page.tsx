import { SectionCards } from "@/components/section-cards"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 bg-[#0b0c0f] font-sans min-h-full">
      <div className="flex flex-col gap-4 py-8 md:gap-6 text-white h-full px-4 lg:px-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Selamat Datang di Watchify Admin</h1>
          <p className="text-sm font-medium text-neutral-400 mb-8">Pantau lalu lintas dan aktivitas database tayangan harian Anda</p>
        </div>
        <SectionCards />
      </div>
    </div>
  )
}
