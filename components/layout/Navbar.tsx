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

  // A soft navigation should never leave the drawer open behind the new page.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (isHomePage) {
      e.preventDefault();
      // Close mobile menu first. After state update, calculate scroll position
      // in a microtask so the layout has settled (menu collapse changes heights).
      setMobileMenuOpen(false);
      requestAnimationFrame(() => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          // Use scrollIntoView for reliable cross-browser/mobile behaviour.
          // Measure the top bar only; the open drawer also lives inside <header>.
          const navHeight =
            document
              .querySelector("header")
              ?.firstElementChild?.getBoundingClientRect().height ?? 64;
          const y =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            8;
          window.scrollTo({ top: y, behavior: "smooth" });
          setActiveSection(sectionId);
        }
      });
    } else {
      setMobileMenuOpen(false);
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
          <div className="w-8 h-8 bg-[#100D16] border-2 border-[var(--color-accent-gold)] flex items-center justify-center font-pixel text-xs text-[var(--color-accent-gold)] group-hover:bg-[#1E1929] pixel-hover pixel-shadow-sm">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] tracking-widest uppercase group-hover:text-[var(--color-accent-gold)] pixel-hover">
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
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`relative px-4 py-2 font-pixel text-xs uppercase tracking-wider pixel-hover pixel-focus ${
                  isActive
                    ? "bg-[#1C1626] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)] pixel-shadow-sm"
                    : "text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] hover:bg-[#181422] border border-transparent"
                }`}
              >
                {isActive ? `[ ${item.label} ]` : item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden flex items-center justify-center w-11 h-11 bg-[var(--color-bg-abyss)] border border-[var(--color-border-gothic)] text-[var(--color-text-bone)] hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] pixel-hover pixel-press pixel-focus"
        >
          {mobileMenuOpen ? <PixelCloseIcon size={18} /> : <PixelMenuIcon size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-label="Mobile Navigation"
          className="md:hidden w-full bg-[var(--color-surface-obsidian)] border-b-2 border-[var(--color-border-subtle)] px-4 py-4 space-y-2 pixel-shadow-lg"
        >
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`flex items-center justify-between px-4 py-3 min-h-[44px] font-pixel text-xs uppercase tracking-wider border pixel-hover ${
                  isActive
                    ? "bg-[#1E1729] text-[var(--color-accent-gold)] border-[var(--color-accent-gold)]"
                    : "text-[var(--color-text-bone)] border-[var(--color-border-gothic)] hover:bg-[#181422] hover:border-[var(--color-accent-gold)]"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[var(--color-accent-gold)]">
                  {isActive ? "◆" : "›"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
