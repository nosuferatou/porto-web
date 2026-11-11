/**
 * ToolList
 *
 * Displays a list of tools with their pixel-art icon AND display name.
 * Used on the post detail page so visitors who don't recognise the icons
 * can still identify the tools by name.
 *
 * Tool names stored in the database (e.g. "Next.js", "Photoshop") are
 * resolved to their icon via the same normalisation used by ToolIconStrip.
 * Display labels use the tool name as stored — no renaming.
 */

import React from "react";
import { getSkillIcon } from "@/lib/skill-icon-map";

interface ToolListProps {
  tools: string[];
  size?: number;
}

function nameToIconKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export const ToolList: React.FC<ToolListProps> = ({ tools, size = 18 }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {tools.map((tool) => {
        const IconComponent = getSkillIcon(nameToIconKey(tool));
        return (
          <div key={tool} className="flex items-center gap-1.5">
            <span className="shrink-0 opacity-90">
              <IconComponent size={size} />
            </span>
            <span className="font-mono text-xs text-[var(--color-text-bone)]">
              {tool}
            </span>
          </div>
        );
      })}
    </div>
  );
};
