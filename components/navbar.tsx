'use client';

import Link from 'next/link';
import { Search, User, Menu, X, LogOut, LayoutDashboard, Settings, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useFilms } from '@/lib/hooks/useFilms';
import { useGenres } from '@/lib/hooks/useGenres';
import { useAuth, useMe } from '@/lib/hooks/useAuth';
import { toast } from 'sonner';

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
            <div className="hidden lg:flex items-center gap-6">
              <Link 
                href="/" 
                className="text-[15px] font-medium text-white hover:text-primary transition-colors"
              >
                Beranda
              </Link>
              <Link 
                href="/films" 
                className="text-[15px] font-medium text-neutral-300 hover:text-primary transition-colors"
              >
                Film
              </Link>
              
              <div className="relative py-2" ref={categoryRef}>
                <button
                  onClick={() => setIsCategoryOpen(o => !o)}
                  className={`text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                    isCategoryOpen ? 'text-primary' : 'text-neutral-300 hover:text-primary'
                  }`}
                >
                  Kategori
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-[#1b1c21] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/5 z-50 overflow-hidden">
                    <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pilih Kategori</span>
                      <span className="text-xs text-neutral-600">{genresData?.data?.length || 0} genre</span>
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
            </div>
          </div>

          {/* Right Actions & Search */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Inline Search Bar */}
            <div className="relative hidden lg:block w-72">
               <div className={`flex items-center bg-[#2a2b30] rounded-sm transition-all border ${isSearchFocused ? 'border-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]' : 'border-transparent'}`}>
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
                             <span className={`text-[15px] font-bold w-4 text-center ${index < 3 ? 'text-primary' : 'text-white'}`}>
                               {index + 1}
                             </span>
                             <span className="text-[14px] text-neutral-200 truncate">
                               {item.title}
                             </span>
                          </Link>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Mobile Search Icon (Shows on small screens) */}
            <button 
              className="lg:hidden w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center backdrop-blur-sm"
              onClick={() => setIsSearchFocused(!isSearchFocused)}
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center gap-3">
              {mounted && (
                userData ? (
                  <div className="relative group py-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="absolute top-full right-0 mt-1 w-[240px] bg-[#1b1c21] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.9)] border border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                        <p className="text-sm font-bold text-white truncate">{userData?.data?.personal_info?.display_name || userData?.data?.personal_info?.username}</p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">{userData?.data?.personal_info?.email}</p>
                      </div>
                      <div className="flex flex-col py-2">
                         <Link href="/dashboard" className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-3">
                           <LayoutDashboard className="w-4 h-4" /> Dashboard
                         </Link>
                         <Link href="/settings" className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-3">
                           <Settings className="w-4 h-4" /> Pengaturan
                         </Link>
                         <div className="h-px bg-white/5 my-2" />
                         <button onClick={() => { 
                           logout(); 
                           toast.success('Berhasil logout. Sampai jumpa! 👋');
                           setTimeout(() => window.location.href = '/login', 500);
                         }} className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3">
                           <LogOut className="w-4 h-4" /> Keluar
                         </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm tracking-wide hover:brightness-90 transition-all shadow-[0_4px_15px_rgba(var(--primary),0.3)]">
                    Login Access
                  </Link>
                )
              )}
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
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0b0c0f]/95 backdrop-blur-lg border-b border-white/5 animate-fade-in">
            <div className="flex flex-col py-2">
              <Link
                href="/"
                className="px-6 py-4 text-[15px] font-medium text-white hover:text-primary hover:bg-white/5 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/films"
                className="px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Drama & Film
              </Link>
              <button
                className="w-full text-left px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all flex items-center justify-between"
                onClick={() => setMobileGenreOpen(o => !o)}
              >
                <span>Kategori</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileGenreOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {mobileGenreOpen && (
                <div className="px-6 pb-3 bg-black/20">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {genresData?.data?.map((genre: any) => (
                      <Link
                        key={genre.id}
                        href={`/films?genre=${genre.id}`}
                        onClick={() => { setIsMenuOpen(false); setMobileGenreOpen(false); }}
                        className="px-3 py-2 bg-white/5 rounded-lg text-sm font-medium text-neutral-300 hover:text-primary transition-colors capitalize truncate"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/genres"
                    onClick={() => { setIsMenuOpen(false); setMobileGenreOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-bold"
                  >
                    <Tag className="w-3.5 h-3.5" /> Lihat Semua Genre
                  </Link>
                </div>
              )}
              {mounted && (
                userData ? (
                  <>
                  <div className="px-6 py-5 flex flex-col border-y border-white/5 bg-white/[0.02] mt-2 group">
                     <span className="text-sm font-bold text-white mb-1 truncate">{userData?.data?.personal_info?.display_name || userData?.data?.personal_info?.username}</span>
                     <span className="text-xs text-neutral-400 truncate">{userData?.data?.personal_info?.email}</span>
                  </div>
                  <Link
                     href="/dashboard"
                     className="px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link
                     href="/settings"
                     className="px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all flex items-center gap-3"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Pengaturan
                  </Link>
                  <button
                     className="w-full text-left px-6 py-4 text-[15px] font-medium text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                     onClick={() => { 
                       logout(); 
                       toast.success('Berhasil logout. Sampai jumpa! 👋');
                       setTimeout(() => window.location.href = '/login', 500);
                     }}
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                  </>
                ) : (
                  <Link
                     href="/login"
                     className="px-6 py-4 text-[15px] font-medium text-primary hover:bg-white/5 transition-all flex items-center gap-2"
                     onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" /> Login / Register
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
