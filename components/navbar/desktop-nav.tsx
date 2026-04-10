import Link from 'next/link';
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { navLinks } from './nav-links';

interface DesktopNavProps {
  isCategoryOpen: boolean;
  setIsCategoryOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  categoryRef: React.RefObject<HTMLDivElement>;
  genresData: any;
}

export function DesktopNav({ 
  isCategoryOpen, 
  setIsCategoryOpen, 
  categoryRef, 
  genresData 
}: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {navLinks.map((link) => {
        if (link.type === 'link') {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-neutral-300 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          );
        }

        if (link.type === 'dropdown') {
          return (
            <div key="kategori" className="relative py-2" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen((o) => !o)}
                className={`text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                  isCategoryOpen ? 'text-primary' : 'text-neutral-300 hover:text-primary'
                }`}
              >
                {link.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-[#1b1c21] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/5 z-50 overflow-hidden">
                  <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Pilih Kategori
                    </span>
                    <span className="text-xs text-neutral-600">
                      {genresData?.data?.length || 0} genre
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {genresData?.data?.map((genre: any) => (
                      <Link
                        key={genre.id}
                        href={`/films?genre=${genre.id}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="px-3 py-2.5 bg-white/5 hover:bg-primary/10 rounded-lg text-sm font-medium text-neutral-300 hover:text-primary transition-all capitalize truncate"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <Link
                      href="/genres"
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-bold hover:bg-primary/10 transition-all"
                    >
                      <Tag className="w-4 h-4" />
                      Lihat Semua Genre
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
