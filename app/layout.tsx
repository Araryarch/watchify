import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
