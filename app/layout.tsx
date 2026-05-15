import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://neon-converter.vercel.app"),
  title: "Neon Converter | Free PDF Tools, Image Converter, OCR Scanner",
  description:
    "Free online PDF tools and image converter. Merge PDF, split PDF, rotate PDF, JPG to PDF, PDF to PNG, compress images, resize images, clean scans, and extract text with OCR.",
  manifest: "/manifest.json",
  keywords: [
    "free PDF tools",
    "Neon Converter",
    "merge PDF online",
    "split PDF online",
    "PDF compressor",
    "JPG to PDF",
    "PDF to PNG",
    "image converter",
    "compress image online",
    "CamScanner alternative",
    "OCR scanner online",
    "free file converter"
  ],
  openGraph: {
    title: "Neon Converter",
    description: "Free PDF tools, image converter, scan cleanup, and OCR in your browser.",
    type: "website"
  },
  alternates: {
    canonical: "/"
  }
};

export const viewport: Viewport = {
  themeColor: "#070912",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
