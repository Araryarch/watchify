import { Skeleton } from '@/components/ui/skeleton';

export function FilmCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function FilmDetailSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Skeleton - match the structure of actual page */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-gradient-to-br from-purple-800 via-blue-800 to-teal-800">
        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center sm:items-end h-full justify-end pb-8 sm:pb-10 lg:pb-12">
            <Skeleton className="w-40 sm:w-40 md:w-48 lg:w-64 aspect-[2/3] rounded-lg bg-white/10" />
            <div className="flex-1 space-y-3 sm:space-y-4 pb-2 sm:pb-4 w-full">
              <Skeleton className="h-10 w-3/4 bg-white/10" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 bg-white/10" />
                <Skeleton className="h-6 w-20 bg-white/10" />
                <Skeleton className="h-6 w-24 bg-white/10" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-40 bg-white/10" />
                <Skeleton className="h-12 w-40 bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <FilmCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0c0f] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
