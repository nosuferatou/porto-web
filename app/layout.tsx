import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { BackgroundEnvironment } from "@/components/ui/BackgroundEnvironment";
import { CelestialThemeToggle } from "@/components/ui/CelestialThemeToggle";
import { ThemeProvider } from "@/components/theme/ThemeContext";

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
  title: "fernando's archive",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.location.pathname;if(!p.startsWith('/admin')){var t=localStorage.getItem('theme_preference');if(t==='day'){document.documentElement.setAttribute('data-theme','day');}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg-abyss)] text-[var(--color-text-bone)] font-sans selection:bg-[var(--color-accent-blood)] selection:text-[var(--color-text-bone)]">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent-blood)] focus:text-[var(--color-text-bone)] focus:border-2 focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow font-pixel text-xs tracking-wider uppercase"
          >
            Skip to content
          </a>
          <NavigationProgress />
          <BackgroundEnvironment />
          <FloatingParticles />
          <CelestialThemeToggle />
          <div id="main-content" className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
