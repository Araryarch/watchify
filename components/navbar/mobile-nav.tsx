import Link from 'next/link';
import { ChevronDown, Tag, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';
import { navLinks } from './nav-links';
import { toast } from 'sonner';

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  mobileGenreOpen: boolean;
  setMobileGenreOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  genresData: any;
  userData: any;
  mounted: boolean;
  logout: () => void;
}

export function MobileNav({
  isMenuOpen,
  setIsMenuOpen,
  mobileGenreOpen,
  setMobileGenreOpen,
  genresData,
  userData,
  mounted,
  logout,
}: MobileNavProps) {
  if (!isMenuOpen) return null;

  return (
    <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#0b0c0f]/95 backdrop-blur-lg border-b border-white/5 animate-fade-in">
      <div className="flex flex-col py-2">
        {navLinks.map((link) => {
          if (link.type === 'link') {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          }

          if (link.type === 'dropdown') {
            return (
              <div key="kategori">
                <button
                  className="w-full text-left px-6 py-4 text-[15px] font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-all flex items-center justify-between"
                  onClick={() => setMobileGenreOpen((o) => !o)}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileGenreOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {mobileGenreOpen && (
                  <div className="px-6 pb-3 bg-black/20">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {genresData?.data?.map((genre: any) => (
                        <Link
                          key={genre.id}
                          href={`/films?genre=${genre.id}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setMobileGenreOpen(false);
                          }}
                          className="px-3 py-2 bg-white/5 rounded-lg text-sm font-medium text-neutral-300 hover:text-primary transition-colors capitalize truncate"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/genres"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setMobileGenreOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-bold"
                    >
                      <Tag className="w-3.5 h-3.5" /> Lihat Semua Genre
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}

        {mounted &&
          (userData ? (
            <>
              <div className="px-6 py-5 flex flex-col border-y border-white/5 bg-white/[0.02] mt-2 group">
                <span className="text-sm font-bold text-white mb-1 truncate">
                  {userData?.data?.personal_info?.display_name ||
                    userData?.data?.personal_info?.username}
                </span>
                <span className="text-xs text-neutral-400 truncate">
                  {userData?.data?.personal_info?.email}
                </span>
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
                  toast.success('Berhasil logout. Sampai jumpa!');
                  setTimeout(() => (window.location.href = '/login'), 500);
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
          ))}
      </div>
    </div>
  );
}
