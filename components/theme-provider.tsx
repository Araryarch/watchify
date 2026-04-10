'use client';

import { useEffect, useState } from 'react';
import { useThemeStore, themes } from '@/lib/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const themeColors = themes[theme].colors;

    // Apply all theme colors to CSS variables
    root.style.setProperty('--background', themeColors.background);
    root.style.setProperty('--foreground', themeColors.foreground);
    root.style.setProperty('--card', themeColors.card);
    root.style.setProperty('--card-foreground', themeColors.cardForeground);
    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--primary-foreground', themeColors.primaryForeground);
    root.style.setProperty('--secondary', themeColors.secondary);
    root.style.setProperty('--secondary-foreground', themeColors.secondaryForeground);
    root.style.setProperty('--muted', themeColors.muted);
    root.style.setProperty('--muted-foreground', themeColors.mutedForeground);
    root.style.setProperty('--accent', themeColors.accent);
    root.style.setProperty('--accent-foreground', themeColors.accentForeground);
    root.style.setProperty('--border', themeColors.border);
    root.style.setProperty('--input', themeColors.input);
    root.style.setProperty('--ring', themeColors.ring);
  }, [theme, mounted]);

  return <>{children}</>;
}
