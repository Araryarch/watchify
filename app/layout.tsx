import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: "Watchify - Platform Streaming Film Terbaik",
  description: "Tonton ribuan film dan series favorit Anda di Watchify. Platform streaming dengan koleksi film terlengkap dan berkualitas HD.",
  keywords: ["streaming", "film", "movie", "series", "watchify", "nonton film online"],
  authors: [{ name: "Watchify" }],
  openGraph: {
    title: "Watchify - Platform Streaming Film Terbaik",
    description: "Tonton ribuan film dan series favorit Anda di Watchify",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watchify - Platform Streaming Film Terbaik",
    description: "Tonton ribuan film dan series favorit Anda di Watchify",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Inline script to prevent theme flash
const themeScript = `
(function() {
  try {
    const stored = localStorage.getItem('watchify-theme');
    if (!stored) return;
    
    const { state } = JSON.parse(stored);
    const theme = state?.theme || 'watchify';
    
    const themeColors = {
      watchify: { background: '#0b0c0f', foreground: '#ffffff', card: '#14151a', cardForeground: '#ffffff', primary: '#00dc74', primaryForeground: '#000000', secondary: '#22232b', secondaryForeground: '#ffffff', muted: '#22232b', mutedForeground: '#a3a3a3', accent: '#22232b', accentForeground: '#ffffff', border: '#2a2b33', input: '#2a2b33', ring: '#00dc74' },
      'catppuccin-mocha': { background: '#1e1e2e', foreground: '#cdd6f4', card: '#181825', cardForeground: '#cdd6f4', primary: '#89b4fa', primaryForeground: '#1e1e2e', secondary: '#313244', secondaryForeground: '#cdd6f4', muted: '#313244', mutedForeground: '#a6adc8', accent: '#313244', accentForeground: '#cdd6f4', border: '#45475a', input: '#45475a', ring: '#89b4fa' },
      'catppuccin-macchiato': { background: '#24273a', foreground: '#cad3f5', card: '#1e2030', cardForeground: '#cad3f5', primary: '#8aadf4', primaryForeground: '#24273a', secondary: '#363a4f', secondaryForeground: '#cad3f5', muted: '#363a4f', mutedForeground: '#a5adcb', accent: '#363a4f', accentForeground: '#cad3f5', border: '#494d64', input: '#494d64', ring: '#8aadf4' },
      dracula: { background: '#282a36', foreground: '#f8f8f2', card: '#21222c', cardForeground: '#f8f8f2', primary: '#bd93f9', primaryForeground: '#282a36', secondary: '#44475a', secondaryForeground: '#f8f8f2', muted: '#44475a', mutedForeground: '#6272a4', accent: '#44475a', accentForeground: '#f8f8f2', border: '#6272a4', input: '#44475a', ring: '#bd93f9' },
      nord: { background: '#2e3440', foreground: '#eceff4', card: '#3b4252', cardForeground: '#eceff4', primary: '#88c0d0', primaryForeground: '#2e3440', secondary: '#434c5e', secondaryForeground: '#eceff4', muted: '#434c5e', mutedForeground: '#d8dee9', accent: '#434c5e', accentForeground: '#eceff4', border: '#4c566a', input: '#4c566a', ring: '#88c0d0' },
      'tokyo-night': { background: '#1a1b26', foreground: '#c0caf5', card: '#16161e', cardForeground: '#c0caf5', primary: '#7aa2f7', primaryForeground: '#1a1b26', secondary: '#24283b', secondaryForeground: '#c0caf5', muted: '#24283b', mutedForeground: '#565f89', accent: '#24283b', accentForeground: '#c0caf5', border: '#414868', input: '#414868', ring: '#7aa2f7' },
      gruvbox: { background: '#282828', foreground: '#ebdbb2', card: '#1d2021', cardForeground: '#ebdbb2', primary: '#b8bb26', primaryForeground: '#282828', secondary: '#3c3836', secondaryForeground: '#ebdbb2', muted: '#3c3836', mutedForeground: '#a89984', accent: '#3c3836', accentForeground: '#ebdbb2', border: '#504945', input: '#504945', ring: '#b8bb26' },
      'rose-pine': { background: '#191724', foreground: '#e0def4', card: '#1f1d2e', cardForeground: '#e0def4', primary: '#c4a7e7', primaryForeground: '#191724', secondary: '#26233a', secondaryForeground: '#e0def4', muted: '#26233a', mutedForeground: '#908caa', accent: '#26233a', accentForeground: '#e0def4', border: '#403d52', input: '#403d52', ring: '#c4a7e7' },
      'one-dark': { background: '#282c34', foreground: '#abb2bf', card: '#21252b', cardForeground: '#abb2bf', primary: '#61afef', primaryForeground: '#282c34', secondary: '#2c313c', secondaryForeground: '#abb2bf', muted: '#2c313c', mutedForeground: '#5c6370', accent: '#2c313c', accentForeground: '#abb2bf', border: '#3e4451', input: '#3e4451', ring: '#61afef' }
    };
    
    const colors = themeColors[theme] || themeColors.watchify;
    const root = document.documentElement;
    
    Object.keys(colors).forEach(key => {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(cssVar, colors[key]);
    });
  } catch (e) {
    console.error('Theme init error:', e);
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Preconnect to API domain */}
        <link rel="preconnect" href="https://film-management-api.labse.id" />
        <link rel="dns-prefetch" href="https://film-management-api.labse.id" />
        {/* Preload critical resources */}
        <link rel="preload" as="fetch" href="https://film-management-api.labse.id/api/v1/films?take=20&page=1" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background font-sans">
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>
              <HeaderWrapper>
                <Navbar />
              </HeaderWrapper>
              <main className="flex-1">{children}</main>
              <HeaderWrapper>
                <Footer />
              </HeaderWrapper>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
