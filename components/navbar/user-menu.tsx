import Link from 'next/link';
import { User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface UserMenuProps {
  userData: any;
  mounted: boolean;
  logout: () => void;
}

export function UserMenu({ userData, mounted, logout }: UserMenuProps) {
  if (!mounted) return null;

  if (!userData) {
    return (
      <Link
        href="/login"
        className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm tracking-wide hover:brightness-90 transition-all shadow-[0_4px_15px_rgba(var(--primary),0.3)]"
      >
        Login Access
      </Link>
    );
  }

  return (
    <div className="relative group py-2">
      <div className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
        <User className="w-4 h-4" />
      </div>
      <div className="absolute top-full right-0 mt-1 w-[240px] bg-[#1b1c21] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.9)] border border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-sm font-bold text-white truncate">
            {userData?.data?.personal_info?.display_name ||
              userData?.data?.personal_info?.username}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            {userData?.data?.personal_info?.email}
          </p>
        </div>
        <div className="flex flex-col py-2">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-3"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link
            href="/settings"
            className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-3"
          >
            <Settings className="w-4 h-4" /> Pengaturan
          </Link>
          <div className="h-px bg-white/5 my-2" />
          <button
            onClick={() => {
              logout();
              toast.success('Berhasil logout. Sampai jumpa!');
              setTimeout(() => (window.location.href = '/login'), 500);
            }}
            className="w-full text-left px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-3"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
