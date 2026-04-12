'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { useFilms } from '@/lib/hooks/useFilms';
import Image from 'next/image';

interface SearchBarProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  popularSearches: any[];
}

export function SearchBar({ isSearchFocused, setIsSearchFocused, popularSearches }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results only when there's a query
  const { data: searchResults, isLoading } = useFilms(
    {
      take: 5,
      page: 1,
      filter: debouncedQuery,
      filter_by: 'title',
    },
    {
      enabled: debouncedQuery.length > 0, // Only fetch when there's a search query
    }
  );

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  const showResults = isSearchFocused && searchQuery.length > 0;
  const hasResults = searchResults?.data && searchResults.data.length > 0;

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
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari film atau drama..."
          className="w-full bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-neutral-400 focus:outline-none transition-all"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
        
        <div className="flex items-center pr-3 pl-2 border-l border-neutral-600/50 h-5 gap-2">
          {searchQuery && (
            <button
              onClick={handleClear}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {isLoading && debouncedQuery ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-white hover:text-primary cursor-pointer transition-colors" />
          )}
        </div>
      </div>

      {/* Search Results or Popular Searches Dropdown */}
      {isSearchFocused && (
        <div className="absolute top-full right-0 mt-1 w-[380px] bg-[#1b1c21] rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden animate-fade-in z-50 max-h-[500px] overflow-y-auto">
          {showResults ? (
            <>
              <div className="px-4 py-3 pb-2 text-xs font-semibold text-neutral-400 flex items-center justify-between">
                <span>Hasil Pencarian</span>
                {searchResults?.data && (
                  <span className="text-neutral-500">
                    {searchResults.data.length} hasil
                  </span>
                )}
              </div>
              <div className="flex flex-col pb-2">
                {isLoading && !searchResults ? (
                  <div className="px-4 py-8 text-center text-neutral-400 text-sm">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Mencari...
                  </div>
                ) : hasResults ? (
                  <>
                    {searchResults.data.map((film: any) => (
                      <Link
                        key={film.id}
                        href={`/film/${film.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-12 h-16 shrink-0 rounded overflow-hidden bg-neutral-800">
                          {film.images && film.images.length > 0 ? (
                            <Image
                              src={`https://film-management-api.labse.id/api/static/${film.images[0]}`}
                              alt={film.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Search className="w-5 h-5 text-neutral-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">
                            {film.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {film.average_rating && film.average_rating > 0 && (
                              <span className="text-xs text-yellow-400">
                                ★ {film.average_rating.toFixed(1)}
                              </span>
                            )}
                            {film.release_date && (() => {
                              const year = new Date(film.release_date).getFullYear();
                              return !isNaN(year) && year > 0 ? (
                                <span className="text-xs text-neutral-400">
                                  {year}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/films?search=${encodeURIComponent(searchQuery)}`}
                      onClick={handleResultClick}
                      className="px-4 py-3 text-center text-sm text-primary hover:bg-white/5 transition-colors border-t border-white/5 mt-2"
                    >
                      Lihat semua hasil untuk "{searchQuery}"
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center text-neutral-400 text-sm">
                    Tidak ada hasil untuk "{searchQuery}"
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 pb-2 text-xs font-semibold text-neutral-400">
                Popular Searches
              </div>
              <div className="flex flex-col pb-2">
                {popularSearches.map((item: any, index: number) => (
                  <Link
                    key={index}
                    href={`/film/${item.id || ''}`}
                    onClick={handleResultClick}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
