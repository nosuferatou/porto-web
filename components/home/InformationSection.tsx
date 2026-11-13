import React from "react";
import { PixelFrame, PixelCard, PixelButton } from "@/components/ui";
import { profileData, Profile } from "@/lib/data";
import { SanctuaryClock } from "./SanctuaryClock";

interface InformationSectionProps {
  profile?: Profile;
}

export const InformationSection: React.FC<InformationSectionProps> = ({
  profile = profileData,
}) => {
  return (
    <section
      id="information"
      aria-label="Personal Information and Profile"
      className="w-full scroll-mt-20 pt-4 pb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Avatar Relic Frame */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start">
          <PixelFrame
            variant="relic"
            aspectRatio="square"
            cornerStuds
            className="w-48 sm:w-56 md:w-full max-w-[280px]"
          >
            {profile.photoPlaceholder &&
            (profile.photoPlaceholder.startsWith("/") ||
            profile.photoPlaceholder.startsWith("https://")) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoPlaceholder}
                alt={profile.name}
                className="w-full h-full object-cover pixelated"
              />
            ) : (
              <div className="w-full h-full min-h-[220px] bg-[var(--color-surface-obsidian)] flex flex-col items-center justify-center p-6 text-center select-none relative group">
                <div className="w-24 h-24 mb-3 border-2 border-[var(--color-border-subtle)] bg-[var(--color-bg-abyss)] flex items-center justify-center font-pixel text-4xl text-[var(--color-accent-gold)] pixel-shadow-sm group-hover:border-[var(--color-accent-gold)] pixel-hover">
                  ⚔
                </div>
                <div className="font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-widest">
                  {profile.name}
                </div>
                <div className="font-mono text-[10px] text-[var(--color-accent-gold)] mt-1">
                  Level 99 Architect
                </div>
              </div>
            )}
          </PixelFrame>

          {/* Status Pill */}
          <div className="mt-4 w-full max-w-[280px] mx-auto md:mx-0 px-3 py-2 bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] flex items-center gap-2 pixel-shadow-sm">
            <span
              aria-hidden="true"
              className={`w-2 h-2 shrink-0 pixelated ${profile.status === "Dead" ? "bg-[var(--color-status-dead)]" : profile.status === "Sleeping" ? "bg-[var(--color-status-muted)]" : profile.status === "Busy" ? "bg-[var(--color-status-busy)]" : profile.status === "AFK" ? "bg-[var(--color-status-muted)]" : profile.status === "Respawning" ? "bg-[var(--color-status-respawning)]" : "bg-[var(--color-status-active)]"}`}
            />
            <span className="font-mono text-[11px] text-[var(--color-text-ash)] truncate">
              {profile.status}
            </span>
          </div>
        </div>

        {/* Bio Information */}
        <div className="md:col-span-8 flex flex-col space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-accent-gold)] uppercase tracking-wider">
            <span>◆ Codex Registry</span>
            <span>·</span>
            <span>{profile.location}</span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-[var(--color-text-bone)] uppercase tracking-wide leading-tight">
            {profile.name}
          </h1>

          <div className="font-mono text-sm sm:text-base text-[var(--color-accent-gold)] uppercase tracking-wider font-semibold">
            {profile.title}
          </div>

          <PixelCard variant="default" className="mt-2">
            <p className="font-sans text-sm sm:text-base text-[var(--color-text-bone)] leading-relaxed">
              {profile.bio}
            </p>
            <div className="mt-4 pt-4 border-t border-[var(--color-border-gothic)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono text-[var(--color-text-ash)] text-left">
              <div>
                <span className="block text-[var(--color-accent-gold)] uppercase text-[10px]">
                  Specialty
                </span>
                {profile.specialty || "Web & Pixel Art"}
              </div>
              <div>
                <span className="block text-[var(--color-accent-gold)] uppercase text-[10px]">
                  Discipline
                </span>
                {profile.discipline || "Fullstack Craft"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[var(--color-accent-gold)] uppercase text-[10px]">
                  Sanctuary
                </span>
                <SanctuaryClock timezone={profile.timezone} />
              </div>
            </div>
          </PixelCard>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-2">
            <PixelButton href="#posts" variant="primary" size="md">
              View Grimoire
            </PixelButton>
            <PixelButton href="#contact" variant="secondary" size="md">
              Send Raven
            </PixelButton>
          </div>
        </div>
      </div>
    </section>
  );
};
