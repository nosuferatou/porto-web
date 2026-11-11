/**
 * ToolIconStrip
 *
 * Renders a compact horizontal row of pixel-art icons for a list of tool names.
 * Used on post cards (archive and homepage), post detail pages, and anywhere
 * a "Forged With" section appears.
 *
 * Tool names are matched to icons via the centralised skill-icon-map.
 * Unknown tool names get the generic PixelOtherIcon fallback.
 */

import React from "react";
import { getSkillIcon } from "@/lib/skill-icon-map";

interface ToolIconStripProps {
  /** Array of tool names (e.g. ["Next.js", "TypeScript", "Figma"]) */
  tools: string[];
  /** Icon render size in px (default 18) */
  size?: number;
  /** Maximum number of icons to show before "+N more" (default 6, 0 = no limit) */
  maxVisible?: number;
  className?: string;
}

/**
 * Map a display tool name to its icon key by normalising the name:
 *   "Next.js" → "nextjs", "VS Code" → "vscode", etc.
 */
function nameToIconKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export const ToolIconStrip: React.FC<ToolIconStripProps> = ({
  tools,
  size = 18,
  maxVisible = 6,
  className = "",
}) => {
  if (!tools || tools.length === 0) return null;

  const visibleTools = maxVisible > 0 ? tools.slice(0, maxVisible) : tools;
  const overflow = maxVisible > 0 ? tools.length - maxVisible : 0;

  return (
    <div
      className={`flex items-center gap-1.5 flex-wrap ${className}`}
      aria-label={`Tools: ${tools.join(", ")}`}
    >
      {visibleTools.map((tool) => {
        const IconComponent = getSkillIcon(nameToIconKey(tool));
        return (
          <span
            key={tool}
            title={tool}
            aria-label={tool}
            className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
          >
            <IconComponent size={size} />
          </span>
        );
      })}
      {overflow > 0 && (
        <span
          className="font-mono text-[10px] text-[var(--color-text-ash)] shrink-0"
          title={tools.slice(maxVisible).join(", ")}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
};
