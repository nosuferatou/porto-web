import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { NavigationProgress } from "@/components/layout/NavigationProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dark Fantasy Portfolio",
  description: "Personal portfolio website with Dark Fantasy Pixel Art aesthetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg-abyss)] text-[var(--color-text-bone)] font-sans selection:bg-[var(--color-accent-blood)] selection:text-[var(--color-text-bone)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent-blood)] focus:text-[var(--color-text-bone)] focus:border-2 focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow font-pixel text-xs tracking-wider uppercase"
        >
          Skip to content
        </a>
        <NavigationProgress />
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
