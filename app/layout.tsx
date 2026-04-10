import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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

import { TooltipProvider } from "@/components/ui/tooltip";

import { HeaderWrapper } from "@/components/header-wrapper";
import { Toaster } from "@/components/ui/sonner";

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
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black font-sans">
        <QueryProvider>
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
        </QueryProvider>
      </body>
    </html>
  );
}
