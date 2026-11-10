"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PixelButton } from "@/components/ui";

interface AdminHeaderProps {
  userEmail: string;
}

const navLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/profile", label: "Profile" },
];

function isActive(href: string, pathname: string, exact = false) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore — still redirect
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-surface-obsidian)] border-b-2 border-[var(--color-border-gothic)] select-none pixel-shadow-sm">
      {/* ── Main bar ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Desktop nav */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-pixel text-xs sm:text-sm text-[var(--color-accent-gold)] uppercase tracking-wider pixel-focus shrink-0"
          >
            <span className="w-6 h-6 bg-[#181124] border border-[var(--color-accent-gold)] flex items-center justify-center text-xs" aria-hidden="true">
              ⚔
            </span>
            <span className="hidden sm:inline">Sanctum CMS</span>
          </Link>

          <nav
            aria-label="Admin navigation"
            className="hidden md:flex items-center gap-0.5 border-l border-[var(--color-border-gothic)] pl-4"
          >
            {navLinks.map((item) => {
              const active = isActive(item.href, pathname, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-1.5 font-pixel text-xs uppercase tracking-wide pixel-focus transition-none ${
                    active
                      ? "bg-[#231A30] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]"
                      : "text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] hover:bg-[#1A1424]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Email + Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden lg:block font-mono text-xs text-[var(--color-text-ash)] truncate max-w-[160px]">
            {userEmail}
          </span>

          <PixelButton
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            aria-label="Log out of admin panel"
          >
            Logout
          </PixelButton>
        </div>
      </div>

      {/* ── Mobile sub-nav ── */}
      <nav
        aria-label="Admin navigation (mobile)"
        className="md:hidden flex items-center gap-0.5 px-4 py-2 bg-[#120E18] border-t border-[var(--color-border-gothic)] overflow-x-auto scrollbar-none"
      >
        {navLinks.map((item) => {
          const active = isActive(item.href, pathname, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`px-3 py-1.5 font-pixel text-[11px] uppercase tracking-wide shrink-0 pixel-focus ${
                active
                  ? "bg-[#231A30] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]"
                  : "text-[var(--color-text-ash)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
