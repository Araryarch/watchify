import { useThemeStore, themes } from '@/lib/store/themeStore';
import { useMemo } from 'react';

/**
 * Hook to generate dynamic gradient based on current theme
 * Returns gradient classes that match the theme's primary color
 */
export function useThemeGradient() {
  const theme = useThemeStore((state) => state.theme);

  const gradientClass = useMemo(() => {
    const themeColors = themes[theme].colors;
    
    // Convert hex to RGB for gradient manipulation
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const primaryRgb = hexToRgb(themeColors.primary);
    
    // Create gradient variations based on primary color
    // Darken for first color, use primary for middle, lighten for end
    const color1 = `rgb(${Math.max(0, primaryRgb.r - 60)}, ${Math.max(0, primaryRgb.g - 60)}, ${Math.max(0, primaryRgb.b - 60)})`;
    const color2 = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const color3 = `rgb(${Math.min(255, primaryRgb.r + 40)}, ${Math.min(255, primaryRgb.g + 40)}, ${Math.min(255, primaryRgb.b + 40)})`;

    return {
      style: {
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
      },
      colors: {
        from: color1,
        via: color2,
        to: color3,
      },
    };
  }, [theme]);

  return gradientClass;
}
