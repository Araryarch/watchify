import { X } from 'lucide-react';

interface GenreFilterProps {
  genres: any[];
  selectedGenre: string | null;
  onGenreChange: (genreId: string | null) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function GenreFilter({ 
  genres, 
  selectedGenre, 
  onGenreChange, 
  showFilters, 
  onToggleFilters 
}: GenreFilterProps) {
  if (!showFilters) return null;

  return (
    <div className="bg-[#1b1c21] border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm">Filter Genre</h3>
        <button
          onClick={onToggleFilters}
          className="lg:hidden text-neutral-400 hover:text-white transition-colors"
          aria-label="Tutup filter"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            selectedGenre === null
              ? 'bg-primary text-black'
              : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          Semua
        </button>
        {genres?.map((genre: any) => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedGenre === genre.id
                ? 'bg-primary text-black'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}
