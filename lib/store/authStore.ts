import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'USER';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  setAuth: (token: string, role: UserRole) => void;
  clearAuth: () => void;
}

// ─── Cookie helpers (for middleware access) ───────────────────────────────────

const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];
    return value ? decodeURIComponent(value) : null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      setAuth: (token, role) => set({ token, role }),
      clearAuth: () => set({ token: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
