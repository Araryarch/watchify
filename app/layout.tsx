import "./globals.css";
import { Providers } from "@/components/providers";
import { PageLayout } from "@/components/layout/page-layout";
import { inter, jetbrainsMono } from "@/lib/constants/fonts";
import { themeScript } from "@/lib/constants/theme-script";

export { metadata, viewport } from "@/lib/constants/metadata";

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
        <link rel="preconnect" href="https://film-management-api.labse.id" />
        <link rel="dns-prefetch" href="https://film-management-api.labse.id" />
        <link rel="preload" as="fetch" href="https://film-management-api.labse.id/api/v1/films?take=20&page=1" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background font-sans">
        <Providers>
          <PageLayout>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  );
}
