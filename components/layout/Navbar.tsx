"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelMenuIcon, PixelCloseIcon } from "@/components/icons";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "information", label: "Information", href: "/#information" },
  { id: "posts", label: "Posts", href: "/#posts" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

interface NavbarProps {
  profileName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ profileName }) => {
  const [activeSection, setActiveSection] = useState<string>("information");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const firstName = (profileName || "").trim().split(/\s+/)[0] || "Portfolio";

  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = ["information", "posts", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the intersecting section closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHomePage]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    setMobileMenuOpen(false);

    if (isHomePage) {
      e.preventDefault();
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        const yOffset = -70;
        const y =
          targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        setActiveSection(sectionId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-surface-obsidian)] border-b-2 border-[var(--color-border-gothic)] pixel-shadow-sm select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand / Crest */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group pixel-focus py-1"
          aria-label={`Home - ${firstName} Portfolio`}
        >
          <div className="w-8 h-8 bg-[#100D16] border-2 border-[var(--color-accent-gold)] flex items-center justify-center font-pixel text-xs text-[var(--color-accent-gold)] group-hover:bg-[#1E1929] transition-none pixel-shadow-sm">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] tracking-widest uppercase group-hover:text-[var(--color-accent-gold)] transition-none">
              {firstName}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-text-ash)] hidden sm:inline">
              Obsidian Codex
            </span>
          </div>
        </Link>

        {/* Desktop Tabs */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 sm:gap-2"
        >
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-4 py-2 font-pixel text-xs uppercase tracking-wider transition-none pixel-focus ${
                  isActive
                    ? "bg-[#1C1626] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)] pixel-shadow-sm"
                    : "text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] hover:bg-[#181422] border border-transparent"
                }`}
              >
                {isActive ? `[ ${item.label} ]` : item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden flex items-center justify-center w-11 h-11 bg-[var(--color-bg-abyss)] border border-[var(--color-border-gothic)] text-[var(--color-text-bone)] hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] pixel-press pixel-focus"
        >
          {mobileMenuOpen ? <PixelCloseIcon size={18} /> : <PixelMenuIcon size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation"
          className="md:hidden w-full bg-[var(--color-surface-obsidian)] border-b-2 border-[var(--color-border-subtle)] px-4 py-4 space-y-2 pixel-shadow-lg"
        >
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`flex items-center justify-between px-4 py-3 min-h-[44px] font-pixel text-xs uppercase tracking-wider border ${
                  isActive
                    ? "bg-[#1E1729] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]"
                    : "text-[var(--color-text-bone)] border-[var(--color-border-gothic)] hover:bg-[#181422]"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[var(--color-accent-gold)]">
                  {isActive ? "◆" : "›"}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
