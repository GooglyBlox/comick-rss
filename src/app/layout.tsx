/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comick.io RSS Generator | Stay Updated with Latest Manga Chapters",
  description:
    "Professional RSS feed generator for Comick.io follows. Stay updated with the latest manga, manhwa, and webtoon chapters through your favorite RSS reader.",
  keywords: ["comick", "rss", "manga", "manhwa", "webtoon", "feeds", "generator", "rss reader"],
  authors: [{ name: "GooglyBlox" }],
  openGraph: {
    title: "Comick.io RSS Generator",
    description: "Generate RSS feeds from your Comick.io follows to stay updated with latest chapters",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}