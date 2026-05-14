import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FileVerse AI | Neon Converter Universal AI File Toolkit",
  description:
    "A futuristic AI-powered universal file toolkit for PDFs, images, video, audio, document conversion, OCR, smart automation, and encrypted cloud workspaces.",
  manifest: "/manifest.json",
  keywords: [
    "AI PDF tools",
    "Neon Converter",
    "FileVerse AI",
    "PDF compressor",
    "image converter",
    "AI document analyzer",
    "universal file converter"
  ],
  openGraph: {
    title: "FileVerse AI",
    description: "The AI operating system for every file.",
    type: "website"
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
