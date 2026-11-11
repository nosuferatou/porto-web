/**
 * Centralised icon map for skill / technology icons.
 *
 * Keys match the stable `iconKey` values used in PREDEFINED_TOOLS in the
 * Skills CMS page and stored in the Skill.iconKey database column.
 *
 * All icons are pixel-art SVG components from components/icons/PixelIcons.tsx.
 * Unknown keys fall back to PixelVSCodeIcon (generic tool silhouette).
 *
 * Consumed by:
 *  - components/home/SkillGrid.tsx
 *  - components/shared/ToolIconStrip.tsx
 *  - app/posts/[slug]/page.tsx (Forged With section)
 *  - components/posts/PostsArchiveView.tsx (card tool icons)
 *  - components/home/PostsPreviewSection.tsx (homepage card tool icons)
 */

import type { FC } from "react";
import {
  PixelPhotoshopIcon,
  PixelIllustratorIcon,
  PixelFigmaIcon,
  PixelVSCodeIcon,
  PixelNextJSIcon,
  PixelNodeJSIcon,
  PixelKotlinIcon,
  PixelGitHubIcon,
  PixelGitIcon,
  PixelHTMLIcon,
  PixelCSSIcon,
  PixelJavaScriptIcon,
  PixelTypeScriptIcon,
  PixelReactIcon,
  PixelBlenderIcon,
  PixelAfterEffectsIcon,
  PixelPremiereIcon,
  PixelDaVinciIcon,
  PixelPHPIcon,
  PixelMySQLIcon,
  PixelOtherIcon,
} from "@/components/icons";
import type { IconProps } from "@/components/icons";

export type SkillIconComponent = FC<IconProps>;

export const skillIconMap: Record<string, SkillIconComponent> = {
  // Adobe Creative Suite
  photoshop:   PixelPhotoshopIcon,
  illustrator: PixelIllustratorIcon,
  aftereffects:PixelAfterEffectsIcon,
  premiere:    PixelPremiereIcon,
  figma:       PixelFigmaIcon,

  // 3D / Video
  blender:     PixelBlenderIcon,
  davinci:     PixelDaVinciIcon,

  // Editor / Tooling
  vscode:      PixelVSCodeIcon,
  git:         PixelGitIcon,
  github:      PixelGitHubIcon,

  // Web technologies
  html:        PixelHTMLIcon,
  css:         PixelCSSIcon,
  javascript:  PixelJavaScriptIcon,
  typescript:  PixelTypeScriptIcon,
  react:       PixelReactIcon,
  nextjs:      PixelNextJSIcon,
  nodejs:      PixelNodeJSIcon,

  // Other languages / databases
  kotlin:      PixelKotlinIcon,
  php:         PixelPHPIcon,
  mysql:       PixelMySQLIcon,

  // Generic fallback for custom tools
  custom:      PixelOtherIcon,
  other:       PixelOtherIcon,
};

/**
 * Resolve the skill icon component for a given iconKey.
 * Falls back to PixelVSCodeIcon (generic tool) for unknown keys.
 */
export function getSkillIcon(iconKey: string): SkillIconComponent {
  return skillIconMap[iconKey.toLowerCase()] ?? PixelVSCodeIcon;
}
