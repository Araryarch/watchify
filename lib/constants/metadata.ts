import type { Metadata, Viewport } from "next";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
