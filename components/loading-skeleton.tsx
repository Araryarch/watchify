export function FilmCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-2/3 bg-muted animate-pulse rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
      </div>
    </div>
  );
}

export function FilmDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[60vh] md:h-[70vh] bg-muted animate-pulse" />
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-full" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function GenreCardSkeleton() {
  return (
    <div className="h-32 bg-muted animate-pulse rounded-lg" />
  );
}
