'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { useAuth, useMe } from '@/lib/hooks/useAuth';

import { DesktopNav } from './navbar/desktop-nav';
import { MobileNav } from './navbar/mobile-nav';
import { SearchBar } from './navbar/search-bar';
import { UserMenu } from './navbar/user-menu';

export function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close category dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch films for search recommendations
  const { data: filmsData } = useFilms({ take: 9 });
  const popularSearches = filmsData?.data || [];
  
  // Fetch genres for Dropdown
  const { data: genresData } = useGenres();

  // Auth Status
  const { data: userData } = useMe();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#0b0c0f]/90 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Desktop Nav Group */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black tracking-widest text-primary group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] transition-all">
                WATCHIFY
              </span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav
              isCategoryOpen={isCategoryOpen}
              setIsCategoryOpen={setIsCategoryOpen}
              categoryRef={categoryRef}
              genresData={genresData}
            />
          </div>

          {/* Right Actions & Search */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Inline Search Bar */}
            <SearchBar
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              popularSearches={popularSearches}
            />

            {/* Mobile Search Icon (Shows on small screens) */}
            <button 
              className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center backdrop-blur-sm"
              onClick={() => setIsSearchFocused(!isSearchFocused)}
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-3">
              <UserMenu userData={userData} mounted={mounted} logout={logout} />
            </div>

            <button
              className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center backdrop-blur-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchFocused && (
          <div className="lg:hidden animate-fade-in absolute top-16 left-0 right-0 px-4 py-4 bg-[#0b0c0f]/95 backdrop-blur-lg border-b border-white/5">
            <div className="relative max-w-2xl mx-auto flex">
              <input
                type="text"
                placeholder="Cari drama, film..."
                className="w-full bg-[#2a2b30] px-4 py-2 text-sm text-white focus:outline-none rounded-sm border-2 border-transparent focus:border-primary transition-all"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <MobileNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          mobileGenreOpen={mobileGenreOpen}
          setMobileGenreOpen={setMobileGenreOpen}
          genresData={genresData}
          userData={userData}
          mounted={mounted}
          logout={logout}
        />
      </div>
    </nav>
  );
}
