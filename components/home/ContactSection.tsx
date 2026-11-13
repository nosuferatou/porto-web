"use client";

import React, { useState } from "react";
import { PixelCard, PixelButton, PixelCampfire } from "@/components/ui";
import { contactLinksData, ContactLink } from "@/lib/data";
import {
  PixelMailIcon,
  PixelCopyIcon,
  PixelCheckIcon,
} from "@/components/icons";
import { getContactIcon } from "@/lib/contact-icon-map";

interface ContactSectionProps {
  contacts?: ContactLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contacts = contactLinksData,
}) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  // Direct Channel is stored with platform "Direct Channel" via the CMS.
  const directChannel = contacts.find(
    (c) => c.platform === "Direct Channel"
  );
  const directEmail = directChannel
    ? directChannel.label // label holds the email address
    : "";
  const directLabel = "Direct Channel";

  const handleCopyEmail = async () => {
    if (!directEmail) return;
    try {
      await navigator.clipboard.writeText(directEmail);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <footer
      id="contact"
      aria-label="Contact and Channels"
      className="w-full scroll-mt-20 pt-4 pb-16"
    >
      <div className="text-center mb-8">
        <div className="text-xs font-mono text-[var(--color-accent-gold)] uppercase tracking-wider mb-1">
          ✦ Establish Communication
        </div>
        <h2 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Send a Raven or Dispatch
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] max-w-lg mx-auto mt-2 leading-relaxed">
          Open for technical architectural contracts, pixel art commissions, and high-impact collaborative quests.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Email Copy Card */}
        <PixelCard variant="elevated" cornerStuds className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left min-w-0">
              <div className="w-10 h-10 bg-[var(--color-contact-icon)] border border-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-accent-gold)] shrink-0 pixel-shadow-sm">
                <PixelMailIcon size={20} />
              </div>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] text-[var(--color-accent-gold)] uppercase tracking-widest">
                  {directLabel}
                </span>
                <span className="font-mono text-sm sm:text-base text-[var(--color-text-bone)] font-semibold select-all break-all">
                  {directEmail || "No direct channel configured"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <PixelButton
                variant={copyState === "copied" ? "secondary" : "primary"}
                size="sm"
                onClick={handleCopyEmail}
                disabled={!directEmail}
                aria-label="Copy email address to clipboard"
                className="gap-2"
              >
                {copyState === "copied" ? (
                  <>
                    <PixelCheckIcon size={14} />
                    <span>Copied!</span>
                  </>
                ) : copyState === "error" ? (
                  <span>Copy failed</span>
                ) : (
                  <>
                    <PixelCopyIcon size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </PixelButton>

              <PixelButton
                variant="ghost"
                size="sm"
                href={directEmail ? `mailto:${directEmail}` : undefined}
                disabled={!directEmail}
                aria-label="Open default mail client"
              >
                Open ↗
              </PixelButton>
            </div>
          </div>
        </PixelCard>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {contacts
            .filter(
              (link) => link.platform !== "Direct Channel"
            )
            .map((link) => {
            const IconComponent = getContactIcon(link.iconKey);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] hover:border-[var(--color-accent-gold)] hover:bg-[var(--color-contact-hover)] text-[var(--color-text-bone)] hover:text-[var(--color-accent-gold)] pixel-hover pixel-shadow-sm pixel-focus group min-h-[48px]"
                aria-label={`${link.platform} Profile`}
              >
                <div className="text-[var(--color-text-ash)] group-hover:text-[var(--color-accent-gold)] shrink-0">
                  <IconComponent size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-pixel text-[11px] uppercase tracking-wider truncate">
                    {link.platform}
                  </span>
                  <span className="font-mono text-[9px] text-[var(--color-text-ash)] truncate">
                    {link.label}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 border-t border-[var(--color-border-gothic)] text-center flex flex-col items-center space-y-3">
          <PixelCampfire />
          <p className="font-pixel text-xs text-[var(--color-accent-gold)] tracking-widest uppercase">
            The Obsidian Reliquary
          </p>
          <p className="font-mono text-[11px] text-[var(--color-text-ash)]">
            Handcrafted with Next.js 16 App Router & Tailwind CSS · Designed for Longevity
          </p>
        </div>
      </div>
    </footer>
  );
};
