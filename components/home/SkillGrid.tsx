"use client";

import React, { useState } from "react";
import { PixelCard } from "@/components/ui";
import { Skill } from "@/lib/data";
import {
  PixelPhotoshopIcon,
  PixelIllustratorIcon,
  PixelFigmaIcon,
  PixelVSCodeIcon,
  PixelNextJSIcon,
  PixelNodeJSIcon,
  PixelKotlinIcon,
} from "@/components/icons";

// Map of built-in predefined iconKeys to their pixel icon components.
// Skills with a custom iconUrl skip this map entirely and render an <img> instead.
const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  photoshop: PixelPhotoshopIcon,
  illustrator: PixelIllustratorIcon,
  figma: PixelFigmaIcon,
  vscode: PixelVSCodeIcon,
  nextjs: PixelNextJSIcon,
  nodejs: PixelNodeJSIcon,
  kotlin: PixelKotlinIcon,
};

/** Renders the icon for a skill: custom upload → <img>, predefined → pixel SVG, unknown → VS Code fallback. */
function SkillIcon({
  iconKey,
  iconUrl,
  name,
  size = 32,
}: {
  iconKey: string;
  iconUrl?: string;
  name: string;
  size?: number;
}) {
  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt={name}
        width={size}
        height={size}
        className="pixelated object-contain"
        style={{ width: size, height: size, imageRendering: "pixelated" }}
      />
    );
  }

  const IconComponent = iconMap[iconKey] ?? PixelVSCodeIcon;
  return <IconComponent size={size} />;
}

interface SkillGridProps {
  skills?: Skill[];
}

export const SkillGrid: React.FC<SkillGridProps> = ({ skills = [] }) => {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  if (skills.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-sm sm:text-base text-[var(--color-text-bone)] uppercase tracking-wider">
          Mastered Disciplines & Tools
        </h2>
        <span className="font-mono text-xs text-[var(--color-accent-gold)]">
          {skills.length} Relics
        </span>
      </div>

      {/* Grid of Skills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {skills.map((skill) => {
          const isSelected = activeSkill?.id === skill.id;

          return (
            <button
              key={skill.id}
              type="button"
              onMouseEnter={() => setActiveSkill(skill)}
              onFocus={() => setActiveSkill(skill)}
              onClick={() => setActiveSkill(skill)}
              aria-label={`${skill.name} - ${skill.category}`}
              className={`p-3 bg-[var(--color-surface-obsidian)] border-2 transition-none pixel-focus pixel-press text-left flex flex-col items-center justify-center text-center group cursor-pointer ${
                isSelected
                  ? "border-[var(--color-accent-gold)] bg-[#1D1728] pixel-shadow-gold"
                  : "border-[var(--color-border-gothic)] hover:border-[var(--color-accent-gold)] hover:bg-[#1A1524] pixel-shadow-sm"
              }`}
            >
              <div className="w-10 h-10 mb-2 flex items-center justify-center">
                <SkillIcon
                  iconKey={skill.iconKey}
                  iconUrl={skill.iconUrl}
                  name={skill.name}
                  size={32}
                />
              </div>
              <span className="font-pixel text-[11px] sm:text-xs text-[var(--color-text-bone)] group-hover:text-[var(--color-accent-gold)] tracking-wide uppercase">
                {skill.name}
              </span>
              <span className="font-mono text-[9px] text-[var(--color-text-ash)] mt-0.5">
                {skill.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Tooltip / Skill Detail View */}
      <div className="mt-3">
        <PixelCard variant="default" className="py-2.5 px-4 min-h-[52px] flex items-center">
          {activeSkill ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-1 text-xs">
              <div className="font-mono text-[var(--color-text-bone)]">
                <span className="text-[var(--color-accent-gold)] font-pixel text-xs mr-2 uppercase">
                  {activeSkill.name}:
                </span>
                {activeSkill.description}
              </div>
              <span className="font-mono text-[10px] text-[var(--color-accent-gold)] shrink-0 uppercase tracking-widest">
                [ {activeSkill.category} ]
              </span>
            </div>
          ) : (
            <div className="font-mono text-xs text-[var(--color-text-ash)] flex items-center gap-2">
              <span className="text-[var(--color-accent-gold)]">✦</span>
              <span>Hover or focus any discipline relic to read its arcane description.</span>
            </div>
          )}
        </PixelCard>
      </div>
    </div>
  );
};
