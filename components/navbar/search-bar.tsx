import Link from 'next/link';
import { Search } from 'lucide-react';

interface SearchBarProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  popularSearches: any[];
}

export function SearchBar({ isSearchFocused, setIsSearchFocused, popularSearches }: SearchBarProps) {
  return (
    <div className="relative hidden lg:block w-72">
      <div
        className={`flex items-center bg-[#2a2b30] rounded-sm transition-all border ${
          isSearchFocused
            ? 'border-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]'
            : 'border-transparent'
        }`}
      >
        <input
          type="text"
          placeholder="The Best Thing ( AI English..."
          className="w-full bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-neutral-400 focus:outline-none transition-all"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
        {/* Vertical Divider & Icon */}
        <div className="flex items-center pr-3 pl-2 border-l border-neutral-600/50 h-5">
          <Search className="w-4 h-4 text-white hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Popular Searches Dropdown Overlay */}
      {isSearchFocused && (
        <div className="absolute top-full right-0 mt-1 w-[320px] bg-[#1b1c21] rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden animate-fade-in z-50">
          <div className="px-4 py-3 pb-2 text-xs font-semibold text-neutral-400">
            Popular Searches
          </div>
          <div className="flex flex-col pb-2">
            {popularSearches.map((item: any, index: number) => (
              <Link
                key={index}
                href={`/film/${item.id || ''}`}
                className="flex items-center gap-4 px-4 py-2.5 hover:bg-white/5 transition-colors"
              >
                <span
                  className={`text-[15px] font-bold w-4 text-center ${
                    index < 3 ? 'text-primary' : 'text-white'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-[14px] text-neutral-200 truncate">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
