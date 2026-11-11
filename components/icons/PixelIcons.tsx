import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
}

export const PixelMenuIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="3" width="12" height="2" />
    <rect x="2" y="7" width="12" height="2" />
    <rect x="2" y="11" width="12" height="2" />
  </svg>
);

export const PixelCloseIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="2" height="2" />
    <rect x="5" y="5" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="9" y="5" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
  </svg>
);

export const PixelCopyIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <path d="M4 2h8v2H4V2zm-2 4h10v1H2V6zm0 2h1v6H2V8zm1 6h9v1H3v-1zm9-6h1v6h-1V8zm2-6h-2v1h2v8h-1v1h2V2z" />
  </svg>
);

export const PixelCheckIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="11" y="4" width="2" height="2" />
    <rect x="9" y="6" width="2" height="2" />
    <rect x="7" y="8" width="2" height="2" />
    <rect x="5" y="6" width="2" height="2" />
    <rect x="3" y="4" width="2" height="2" />
  </svg>
);

export const PixelExternalIcon: React.FC<IconProps> = ({ className = "", size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="9" y="2" width="5" height="1" />
    <rect x="13" y="2" width="1" height="5" />
    <rect x="11" y="4" width="1" height="1" />
    <rect x="9" y="6" width="1" height="1" />
    <rect x="7" y="8" width="1" height="1" />
    <rect x="3" y="6" width="4" height="1" />
    <rect x="2" y="6" width="1" height="8" />
    <rect x="3" y="13" width="8" height="1" />
    <rect x="10" y="9" width="1" height="4" />
  </svg>
);

export const PixelArrowRightIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="7" width="9" height="2" />
    <rect x="9" y="5" width="2" height="2" />
    <rect x="11" y="7" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
  </svg>
);

/* Skill Icons */
export const PixelPhotoshopIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="12" height="12" fill="#15121C" />
    <rect x="2" y="2" width="12" height="1" fill="#3B82F6" />
    <rect x="2" y="13" width="12" height="1" fill="#3B82F6" />
    <rect x="2" y="2" width="1" height="12" fill="#3B82F6" />
    <rect x="13" y="2" width="1" height="12" fill="#3B82F6" />
    {/* 'Ps' */}
    <rect x="4" y="5" width="1" height="6" fill="#60A5FA" />
    <rect x="5" y="5" width="2" height="1" fill="#60A5FA" />
    <rect x="6" y="6" width="1" height="2" fill="#60A5FA" />
    <rect x="5" y="8" width="2" height="1" fill="#60A5FA" />
    <rect x="9" y="6" width="2" height="1" fill="#60A5FA" />
    <rect x="8" y="7" width="1" height="1" fill="#60A5FA" />
    <rect x="9" y="8" width="1" height="1" fill="#60A5FA" />
    <rect x="10" y="9" width="1" height="1" fill="#60A5FA" />
    <rect x="8" y="10" width="2" height="1" fill="#60A5FA" />
  </svg>
);

export const PixelIllustratorIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="12" height="12" fill="#15121C" />
    <rect x="2" y="2" width="12" height="1" fill="#F59E0B" />
    <rect x="2" y="13" width="12" height="1" fill="#F59E0B" />
    <rect x="2" y="2" width="1" height="12" fill="#F59E0B" />
    <rect x="13" y="2" width="1" height="12" fill="#F59E0B" />
    {/* 'Ai' */}
    <rect x="5" y="5" width="1" height="6" fill="#FBBF24" />
    <rect x="4" y="8" width="1" height="3" fill="#FBBF24" />
    <rect x="6" y="8" width="1" height="3" fill="#FBBF24" />
    <rect x="4" y="8" width="3" height="1" fill="#FBBF24" />
    <rect x="9" y="5" width="1" height="1" fill="#FBBF24" />
    <rect x="9" y="7" width="1" height="4" fill="#FBBF24" />
  </svg>
);

export const PixelFigmaIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="3" width="3" height="3" fill="#F87171" />
    <rect x="8" y="3" width="3" height="3" fill="#FB923C" />
    <rect x="5" y="6" width="3" height="3" fill="#C084FC" />
    <rect x="8" y="6" width="3" height="3" fill="#38BDF8" />
    <rect x="5" y="9" width="3" height="3" fill="#4ADE80" />
  </svg>
);

export const PixelVSCodeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="3" y="6" width="2" height="4" fill="#38BDF8" />
    <rect x="5" y="4" width="2" height="8" fill="#0284C7" />
    <rect x="7" y="3" width="3" height="10" fill="#0369A1" />
    <rect x="10" y="4" width="3" height="8" fill="#0284C7" />
    <rect x="8" y="6" width="2" height="4" fill="#BAE6FD" />
  </svg>
);

export const PixelNextJSIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="12" height="12" fill="#0B0A10" />
    <rect x="2" y="2" width="12" height="1" fill="#D9D2C3" />
    <rect x="2" y="13" width="12" height="1" fill="#D9D2C3" />
    <rect x="2" y="2" width="1" height="12" fill="#D9D2C3" />
    <rect x="13" y="2" width="1" height="12" fill="#D9D2C3" />
    <rect x="4" y="5" width="1" height="6" fill="#D9D2C3" />
    <rect x="5" y="6" width="1" height="1" fill="#D9D2C3" />
    <rect x="6" y="7" width="1" height="1" fill="#D9D2C3" />
    <rect x="7" y="8" width="1" height="1" fill="#D9D2C3" />
    <rect x="8" y="9" width="1" height="1" fill="#D9D2C3" />
    <rect x="9" y="5" width="1" height="6" fill="#D9D2C3" />
    <rect x="11" y="9" width="1" height="2" fill="#D9D2C3" />
  </svg>
);

export const PixelNodeJSIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="3" width="6" height="2" fill="#22C55E" />
    <rect x="3" y="5" width="2" height="6" fill="#22C55E" />
    <rect x="11" y="5" width="2" height="6" fill="#22C55E" />
    <rect x="5" y="11" width="6" height="2" fill="#22C55E" />
    <rect x="6" y="6" width="1" height="4" fill="#15803D" />
    <rect x="7" y="7" width="1" height="1" fill="#15803D" />
    <rect x="8" y="8" width="1" height="1" fill="#15803D" />
    <rect x="9" y="6" width="1" height="4" fill="#15803D" />
  </svg>
);

export const PixelKotlinIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="2" height="10" fill="#A855F7" />
    <rect x="5" y="7" width="2" height="2" fill="#C084FC" />
    <rect x="7" y="5" width="2" height="2" fill="#E879F9" />
    <rect x="9" y="3" width="3" height="2" fill="#F43F5E" />
    <rect x="7" y="9" width="2" height="2" fill="#818CF8" />
    <rect x="9" y="11" width="3" height="2" fill="#6366F1" />
  </svg>
);

/* Social & Contact Icons */
export const PixelGitHubIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Dark background fill */}
    <rect x="5" y="2" width="6" height="1" fill="#E8EAF6" />
    <rect x="3" y="3" width="10" height="1" fill="#E8EAF6" />
    <rect x="2" y="4" width="12" height="5" fill="#E8EAF6" />
    <rect x="3" y="9" width="10" height="3" fill="#E8EAF6" />
    <rect x="5" y="12" width="6" height="2" fill="#E8EAF6" />
    {/* Eyes (dark cutout) */}
    <rect x="4" y="6" width="2" height="2" fill="#24292E" />
    <rect x="10" y="6" width="2" height="2" fill="#24292E" />
    {/* Ear/arm extensions */}
    <rect x="2" y="10" width="1" height="3" fill="#E8EAF6" />
    <rect x="13" y="10" width="1" height="3" fill="#E8EAF6" />
  </svg>
);

export const PixelLinkedInIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Background tile */}
    <rect x="2" y="2" width="12" height="12" fill="#0A66C2" />
    {/* LinkedIn "in" letterform (white) */}
    <rect x="3" y="4" width="2" height="2" fill="#FFFFFF" />
    <rect x="3" y="7" width="2" height="6" fill="#FFFFFF" />
    <rect x="7" y="7" width="2" height="6" fill="#FFFFFF" />
    <rect x="9" y="7" width="2" height="1" fill="#FFFFFF" />
    <rect x="11" y="8" width="2" height="5" fill="#FFFFFF" />
  </svg>
);

export const PixelInstagramIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Gradient approximation: purple top, orange bottom */}
    <rect x="3" y="3" width="10" height="1" fill="#833AB4" />
    <rect x="2" y="4" width="1" height="4" fill="#833AB4" />
    <rect x="13" y="4" width="1" height="4" fill="#833AB4" />
    <rect x="3" y="4" width="10" height="4" fill="#833AB4" />
    <rect x="3" y="8" width="10" height="4" fill="#FD1D1D" />
    <rect x="2" y="8" width="1" height="4" fill="#FD1D1D" />
    <rect x="13" y="8" width="1" height="4" fill="#FD1D1D" />
    <rect x="3" y="12" width="10" height="1" fill="#F77737" />
    {/* Lens ring (white) */}
    <rect x="6" y="6" width="4" height="4" fill="#FFFFFF" />
    <rect x="7" y="7" width="2" height="2" fill="#833AB4" />
    {/* Corner dot */}
    <rect x="11" y="4" width="1" height="1" fill="#FFFFFF" />
  </svg>
);

export const PixelBehanceIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Behance blue background */}
    <rect x="2" y="2" width="12" height="12" fill="#1769FF" />
    {/* Left "B" glyph (white) */}
    <rect x="3" y="4" width="4" height="7" fill="#FFFFFF" />
    <rect x="4" y="5" width="2" height="1" fill="#1769FF" />
    <rect x="4" y="8" width="2" height="1" fill="#1769FF" />
    {/* Right double-stroke (white) — Behance's right side of the "e" */}
    <rect x="9" y="3" width="4" height="1" fill="#FFFFFF" />
    <rect x="9" y="6" width="4" height="4" fill="#FFFFFF" />
    <rect x="10" y="7" width="2" height="2" fill="#1769FF" />
  </svg>
);

export const PixelMailIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    {/* Envelope body — warm dark */}
    <rect x="2" y="3" width="12" height="1" />
    <rect x="2" y="12" width="12" height="1" />
    <rect x="2" y="4" width="1" height="8" />
    <rect x="13" y="4" width="1" height="8" />
    {/* Chevron fold lines — gold tint for the dark fantasy palette */}
    <rect x="4" y="5" width="2" height="1" fill="#C9A84C" />
    <rect x="10" y="5" width="2" height="1" fill="#C9A84C" />
    <rect x="6" y="6" width="1" height="1" fill="#C9A84C" />
    <rect x="9" y="6" width="1" height="1" fill="#C9A84C" />
    <rect x="7" y="7" width="2" height="1" fill="#C9A84C" />
  </svg>
);

/* ─── Contact Platform Icons ─────────────────────────────────────────────────
   All follow the same pixel-art convention:
   · 16×16 viewBox, pure <rect> elements, fill="currentColor"
   · Designed to match the existing PixelInstagramIcon density and style
   · Recognisable silhouette within the tight pixel grid
   ─────────────────────────────────────────────────────────────────────────── */

export const PixelGitLabIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Orange-fox inspired diamond: central body + side wings + top peak */}
    <rect x="7" y="2" width="2" height="2" fill="#FC6D26" />
    <rect x="6" y="4" width="4" height="2" fill="#FC6D26" />
    <rect x="4" y="5" width="8" height="2" fill="#FC6D26" />
    <rect x="3" y="7" width="10" height="2" fill="#E24329" />
    <rect x="4" y="9" width="8" height="2" fill="#FC6D26" />
    <rect x="6" y="11" width="4" height="2" fill="#FC6D26" />
    <rect x="7" y="13" width="2" height="1" fill="#FC6D26" />
  </svg>
);

export const PixelThreadsIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* "@" silhouette: outer ring + inner dot + right-side open spiral */}
    <rect x="5" y="3" width="6" height="1" />
    <rect x="3" y="4" width="2" height="1" />
    <rect x="11" y="4" width="2" height="1" />
    <rect x="2" y="5" width="1" height="4" />
    <rect x="6" y="5" width="4" height="1" />
    <rect x="6" y="8" width="4" height="1" />
    <rect x="6" y="6" width="1" height="2" />
    <rect x="9" y="6" width="1" height="2" />
    <rect x="13" y="5" width="1" height="2" />
    <rect x="3" y="9" width="2" height="1" />
    <rect x="11" y="9" width="2" height="2" />
    <rect x="5" y="10" width="6" height="1" />
    <rect x="10" y="11" width="2" height="1" />
    <rect x="9" y="12" width="3" height="1" />
  </svg>
);

export const PixelXIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* X diagonal cross — two thick diagonal stripes */}
    <rect x="3" y="3" width="2" height="2" />
    <rect x="5" y="5" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="9" y="9" width="2" height="2" />
    <rect x="11" y="11" width="2" height="2" />
    <rect x="11" y="3" width="2" height="2" />
    <rect x="9" y="5" width="2" height="2" />
    <rect x="5" y="9" width="2" height="2" />
    <rect x="3" y="11" width="2" height="2" />
  </svg>
);

export const PixelFacebookIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Lowercase "f" letterform — Facebook's core brand mark */}
    <rect x="7" y="2" width="4" height="2" fill="#1877F2" />
    <rect x="6" y="4" width="2" height="2" fill="#1877F2" />
    <rect x="6" y="6" width="5" height="2" fill="#1877F2" />
    <rect x="6" y="8" width="2" height="6" fill="#1877F2" />
    <rect x="5" y="8" width="1" height="1" fill="#1877F2" />
  </svg>
);

export const PixelTikTokIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Musical note / TikTok "d" shape: stem + circle + right notch */}
    <rect x="6" y="2" width="4" height="2" />
    <rect x="9" y="4" width="2" height="2" />
    <rect x="6" y="4" width="1" height="8" />
    <rect x="4" y="10" width="4" height="2" />
    <rect x="3" y="11" width="2" height="2" />
    <rect x="5" y="12" width="4" height="1" />
    {/* Cyan/red highlight on the right notch — TikTok brand colours */}
    <rect x="10" y="3" width="1" height="1" fill="#69C9D0" />
    <rect x="11" y="2" width="1" height="2" fill="#EE1D52" />
  </svg>
);

export const PixelYouTubeIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Rounded rect (YouTube red) with a white play triangle */}
    <rect x="2" y="4" width="12" height="1" fill="#FF0000" />
    <rect x="2" y="11" width="12" height="1" fill="#FF0000" />
    <rect x="2" y="5" width="1" height="6" fill="#FF0000" />
    <rect x="13" y="5" width="1" height="6" fill="#FF0000" />
    <rect x="3" y="5" width="10" height="6" fill="#FF0000" />
    {/* Play triangle (white) */}
    <rect x="6" y="7" width="1" height="2" fill="#FFFFFF" />
    <rect x="7" y="7" width="1" height="2" fill="#FFFFFF" />
    <rect x="8" y="7" width="1" height="2" fill="#FFFFFF" />
    <rect x="7" y="6" width="1" height="1" fill="#FFFFFF" />
    <rect x="7" y="9" width="1" height="1" fill="#FFFFFF" />
    <rect x="9" y="7" width="1" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelDiscordIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Controller-headset hybrid: rounded body + eyes + ear bumps */}
    <rect x="4" y="3" width="8" height="1" fill="#5865F2" />
    <rect x="3" y="4" width="10" height="1" fill="#5865F2" />
    <rect x="2" y="5" width="12" height="5" fill="#5865F2" />
    <rect x="3" y="10" width="4" height="2" fill="#5865F2" />
    <rect x="9" y="10" width="4" height="2" fill="#5865F2" />
    {/* Eyes */}
    <rect x="5" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="9" y="7" width="2" height="2" fill="#FFFFFF" />
    {/* Ear bumps */}
    <rect x="2" y="4" width="1" height="1" fill="#5865F2" />
    <rect x="13" y="4" width="1" height="1" fill="#5865F2" />
    <rect x="1" y="5" width="1" height="3" fill="#5865F2" />
    <rect x="14" y="5" width="1" height="3" fill="#5865F2" />
  </svg>
);

export const PixelDribbbleIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Circle outline with a diagonal stripe — Dribbble's ball mark */}
    <rect x="5" y="2" width="6" height="1" fill="#EA4C89" />
    <rect x="3" y="3" width="2" height="1" fill="#EA4C89" />
    <rect x="11" y="3" width="2" height="1" fill="#EA4C89" />
    <rect x="2" y="4" width="1" height="8" fill="#EA4C89" />
    <rect x="13" y="4" width="1" height="8" fill="#EA4C89" />
    <rect x="3" y="12" width="2" height="1" fill="#EA4C89" />
    <rect x="11" y="12" width="2" height="1" fill="#EA4C89" />
    <rect x="5" y="13" width="6" height="1" fill="#EA4C89" />
    {/* Diagonal stripe (darker) */}
    <rect x="4" y="5" width="2" height="2" fill="#C03171" />
    <rect x="6" y="7" width="2" height="2" fill="#C03171" />
    <rect x="8" y="9" width="2" height="2" fill="#C03171" />
    <rect x="10" y="11" width="2" height="1" fill="#C03171" />
  </svg>
);

export const PixelArtStationIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* ArtStation "A" chevron over a stepped base platform */}
    {/* Chevron "A" */}
    <rect x="7" y="2" width="2" height="2" fill="#13AFF0" />
    <rect x="5" y="4" width="2" height="2" fill="#13AFF0" />
    <rect x="9" y="4" width="2" height="2" fill="#13AFF0" />
    <rect x="4" y="6" width="2" height="2" fill="#13AFF0" />
    <rect x="10" y="6" width="2" height="2" fill="#13AFF0" />
    <rect x="5" y="7" width="6" height="1" fill="#13AFF0" />
    {/* Stepped base */}
    <rect x="3" y="10" width="10" height="2" />
    <rect x="4" y="12" width="8" height="1" />
    <rect x="5" y="13" width="6" height="1" />
  </svg>
);

export const PixelPinterestIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Rounded "P" with a pin-drop needle at the bottom */}
    <rect x="5" y="2" width="6" height="1" fill="#E60023" />
    <rect x="4" y="3" width="8" height="1" fill="#E60023" />
    <rect x="3" y="4" width="2" height="6" fill="#E60023" />
    <rect x="11" y="4" width="2" height="6" fill="#E60023" />
    <rect x="5" y="10" width="6" height="1" fill="#E60023" />
    <rect x="4" y="9" width="8" height="1" fill="#E60023" />
    {/* Inner circle cutout (lighter — acts as negative space with CSS) */}
    <rect x="5" y="5" width="6" height="4" fill="#E60023" />
    <rect x="6" y="6" width="4" height="2" fill="#0B0A10" />
    {/* Needle */}
    <rect x="7" y="11" width="2" height="3" fill="#E60023" />
    <rect x="7" y="14" width="2" height="1" fill="#C0001A" />
  </svg>
);

export const PixelMediumIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Two overlapping circles — Medium's dot logo */}
    {/* Large left circle */}
    <rect x="2" y="5" width="6" height="1" />
    <rect x="1" y="6" width="8" height="6" />
    <rect x="2" y="12" width="6" height="1" />
    {/* Small right circle */}
    <rect x="11" y="6" width="4" height="1" />
    <rect x="10" y="7" width="6" height="4" />
    <rect x="11" y="11" width="4" height="1" />
    {/* Slight inner relief */}
    <rect x="3" y="7" width="4" height="4" fill="#0B0A10" />
    <rect x="12" y="8" width="2" height="2" fill="#0B0A10" />
  </svg>
);

export const PixelTelegramIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Paper plane — angled arrow pointing top-right */}
    <rect x="2" y="7" width="10" height="2" fill="#2AABEE" />
    <rect x="10" y="5" width="2" height="2" fill="#2AABEE" />
    <rect x="12" y="3" width="2" height="2" fill="#2AABEE" />
    <rect x="10" y="9" width="2" height="2" fill="#2AABEE" />
    <rect x="8" y="11" width="2" height="2" fill="#2AABEE" />
    {/* Wing fold line */}
    <rect x="6" y="8" width="4" height="1" fill="#1A8ABD" />
  </svg>
);

export const PixelWhatsAppIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Phone handset inside a rounded speech-bubble circle */}
    {/* Outer circle */}
    <rect x="4" y="2" width="8" height="1" fill="#25D366" />
    <rect x="2" y="4" width="12" height="8" fill="#25D366" />
    <rect x="3" y="3" width="10" height="1" fill="#25D366" />
    <rect x="3" y="12" width="8" height="1" fill="#25D366" />
    <rect x="4" y="13" width="4" height="1" fill="#25D366" />
    {/* Phone handset (white) */}
    <rect x="5" y="6" width="2" height="1" fill="#FFFFFF" />
    <rect x="5" y="7" width="1" height="3" fill="#FFFFFF" />
    <rect x="5" y="10" width="2" height="1" fill="#FFFFFF" />
    <rect x="9" y="5" width="2" height="1" fill="#FFFFFF" />
    <rect x="10" y="6" width="1" height="3" fill="#FFFFFF" />
    <rect x="9" y="9" width="2" height="1" fill="#FFFFFF" />
    <rect x="6" y="8" width="4" height="1" fill="#FFFFFF" />
  </svg>
);

export const PixelWebsiteIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Globe: outer circle + horizontal equator + vertical meridian */}
    {/* Outer ring */}
    <rect x="5" y="2" width="6" height="1" />
    <rect x="3" y="3" width="2" height="1" />
    <rect x="11" y="3" width="2" height="1" />
    <rect x="2" y="4" width="1" height="8" />
    <rect x="13" y="4" width="1" height="8" />
    <rect x="3" y="12" width="2" height="1" />
    <rect x="11" y="12" width="2" height="1" />
    <rect x="5" y="13" width="6" height="1" />
    {/* Equator */}
    <rect x="3" y="7" width="10" height="2" />
    {/* Meridian */}
    <rect x="7" y="3" width="2" height="10" />
    {/* Inner fill to give depth */}
    <rect x="4" y="4" width="8" height="3" fill="#0B0A10" />
    <rect x="4" y="9" width="8" height="3" fill="#0B0A10" />
    <rect x="3" y="4" width="4" height="3" fill="#0B0A10" />
    <rect x="9" y="4" width="4" height="3" fill="#0B0A10" />
    <rect x="3" y="9" width="4" height="3" fill="#0B0A10" />
    <rect x="9" y="9" width="4" height="3" fill="#0B0A10" />
  </svg>
);

export const PixelOtherIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Diamond / 4-pointed star — generic pixel-art fallback */}
    <rect x="7" y="2" width="2" height="2" />
    <rect x="6" y="4" width="4" height="1" />
    <rect x="5" y="5" width="6" height="1" />
    <rect x="4" y="6" width="8" height="1" />
    <rect x="3" y="7" width="10" height="2" />
    <rect x="4" y="9" width="8" height="1" />
    <rect x="5" y="10" width="6" height="1" />
    <rect x="6" y="11" width="4" height="1" />
    <rect x="7" y="12" width="2" height="2" />
  </svg>
);

/* ─── Additional Skill / Technology Icons ────────────────────────────────────
   Same pixel-art convention: 16×16 viewBox, <rect> elements, fill via color.
   ─────────────────────────────────────────────────────────────────────────── */

export const PixelGitIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Git branch diamond mark */}
    <rect x="7" y="2" width="2" height="2" fill="#F05032" />
    <rect x="6" y="4" width="4" height="1" fill="#F05032" />
    <rect x="4" y="5" width="8" height="2" fill="#F05032" />
    <rect x="5" y="7" width="6" height="1" fill="#F05032" />
    {/* Stem */}
    <rect x="7" y="8" width="2" height="6" fill="#F05032" />
    {/* Circle at bottom */}
    <rect x="6" y="12" width="4" height="2" fill="#F05032" />
  </svg>
);

export const PixelHTMLIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* HTML5 orange shield */}
    <rect x="3" y="2" width="10" height="1" fill="#E44D26" />
    <rect x="2" y="3" width="12" height="10" fill="#E44D26" />
    <rect x="4" y="13" width="8" height="1" fill="#E44D26" />
    <rect x="6" y="14" width="4" height="1" fill="#E44D26" />
    {/* White "5" glyph */}
    <rect x="5" y="5" width="5" height="1" fill="#FFFFFF" />
    <rect x="5" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="8" width="5" height="1" fill="#FFFFFF" />
    <rect x="8" y="9" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="11" width="5" height="1" fill="#FFFFFF" />
  </svg>
);

export const PixelCSSIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* CSS3 blue shield */}
    <rect x="3" y="2" width="10" height="1" fill="#264DE4" />
    <rect x="2" y="3" width="12" height="10" fill="#264DE4" />
    <rect x="4" y="13" width="8" height="1" fill="#264DE4" />
    <rect x="6" y="14" width="4" height="1" fill="#264DE4" />
    {/* White "3" glyph */}
    <rect x="5" y="5" width="5" height="1" fill="#FFFFFF" />
    <rect x="8" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="8" width="5" height="1" fill="#FFFFFF" />
    <rect x="8" y="9" width="2" height="2" fill="#FFFFFF" />
    <rect x="5" y="11" width="5" height="1" fill="#FFFFFF" />
  </svg>
);

export const PixelJavaScriptIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Yellow background */}
    <rect x="2" y="2" width="12" height="12" fill="#F7DF1E" />
    {/* Black "JS" */}
    <rect x="4" y="5" width="1" height="6" fill="#000000" />
    <rect x="4" y="11" width="3" height="1" fill="#000000" />
    <rect x="4" y="10" width="1" height="1" fill="#000000" />
    <rect x="9" y="5" width="1" height="4" fill="#000000" />
    <rect x="10" y="9" width="1" height="1" fill="#000000" />
    <rect x="9" y="10" width="2" height="1" fill="#000000" />
    <rect x="11" y="5" width="1" height="6" fill="#000000" />
  </svg>
);

export const PixelTypeScriptIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Blue background */}
    <rect x="2" y="2" width="12" height="12" fill="#3178C6" />
    {/* White "TS" */}
    <rect x="4" y="5" width="5" height="1" fill="#FFFFFF" />
    <rect x="6" y="6" width="1" height="5" fill="#FFFFFF" />
    <rect x="10" y="5" width="1" height="6" fill="#FFFFFF" />
    <rect x="10" y="8" width="2" height="1" fill="#FFFFFF" />
    <rect x="11" y="9" width="1" height="2" fill="#FFFFFF" />
    <rect x="10" y="11" width="2" height="1" fill="#FFFFFF" />
  </svg>
);

export const PixelReactIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* React atom: three orbital ellipses + center dot */}
    {/* Horizontal ellipse */}
    <rect x="2" y="7" width="12" height="2" fill="#61DAFB" />
    {/* Diagonal ellipse 1 */}
    <rect x="3" y="4" width="2" height="2" fill="#61DAFB" />
    <rect x="5" y="6" width="2" height="2" fill="#61DAFB" />
    <rect x="9" y="8" width="2" height="2" fill="#61DAFB" />
    <rect x="11" y="10" width="2" height="2" fill="#61DAFB" />
    {/* Diagonal ellipse 2 */}
    <rect x="11" y="4" width="2" height="2" fill="#61DAFB" />
    <rect x="9" y="6" width="2" height="2" fill="#61DAFB" />
    <rect x="5" y="8" width="2" height="2" fill="#61DAFB" />
    <rect x="3" y="10" width="2" height="2" fill="#61DAFB" />
    {/* Center nucleus */}
    <rect x="7" y="7" width="2" height="2" fill="#61DAFB" />
  </svg>
);

export const PixelBlenderIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Blender stylized B with circular arc */}
    <rect x="3" y="4" width="6" height="1" fill="#EA7600" />
    <rect x="2" y="5" width="1" height="6" fill="#EA7600" />
    <rect x="3" y="11" width="6" height="1" fill="#EA7600" />
    <rect x="9" y="5" width="2" height="2" fill="#EA7600" />
    <rect x="11" y="7" width="2" height="2" fill="#EA7600" />
    <rect x="9" y="9" width="2" height="2" fill="#EA7600" />
    <rect x="3" y="7" width="6" height="1" fill="#EA7600" />
    <rect x="3" y="5" width="6" height="1" fill="#EA7600" />
    <rect x="3" y="9" width="6" height="1" fill="#EA7600" />
  </svg>
);

export const PixelAfterEffectsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Dark purple background with Ae */}
    <rect x="2" y="2" width="12" height="12" fill="#15121C" />
    <rect x="2" y="2" width="12" height="1" fill="#9999FF" />
    <rect x="2" y="13" width="12" height="1" fill="#9999FF" />
    <rect x="2" y="2" width="1" height="12" fill="#9999FF" />
    <rect x="13" y="2" width="1" height="12" fill="#9999FF" />
    {/* 'A' */}
    <rect x="4" y="5" width="1" height="6" fill="#9999FF" />
    <rect x="5" y="5" width="2" height="1" fill="#9999FF" />
    <rect x="6" y="6" width="1" height="1" fill="#9999FF" />
    <rect x="4" y="8" width="3" height="1" fill="#9999FF" />
    {/* 'e' */}
    <rect x="9" y="7" width="2" height="1" fill="#9999FF" />
    <rect x="8" y="8" width="1" height="2" fill="#9999FF" />
    <rect x="10" y="8" width="1" height="1" fill="#9999FF" />
    <rect x="9" y="10" width="2" height="1" fill="#9999FF" />
    <rect x="8" y="9" width="3" height="1" fill="#9999FF" />
  </svg>
);

export const PixelPremiereIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* Dark background with Pr */}
    <rect x="2" y="2" width="12" height="12" fill="#15121C" />
    <rect x="2" y="2" width="12" height="1" fill="#EA77FF" />
    <rect x="2" y="13" width="12" height="1" fill="#EA77FF" />
    <rect x="2" y="2" width="1" height="12" fill="#EA77FF" />
    <rect x="13" y="2" width="1" height="12" fill="#EA77FF" />
    {/* 'Pr' */}
    <rect x="4" y="5" width="1" height="6" fill="#EA77FF" />
    <rect x="5" y="5" width="2" height="1" fill="#EA77FF" />
    <rect x="6" y="6" width="1" height="2" fill="#EA77FF" />
    <rect x="5" y="8" width="2" height="1" fill="#EA77FF" />
    <rect x="9" y="5" width="1" height="6" fill="#EA77FF" />
    <rect x="10" y="6" width="1" height="1" fill="#EA77FF" />
    <rect x="10" y="8" width="2" height="1" fill="#EA77FF" />
    <rect x="11" y="9" width="1" height="2" fill="#EA77FF" />
  </svg>
);

export const PixelDaVinciIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* DaVinci Resolve dark background + D mark */}
    <rect x="2" y="2" width="12" height="12" fill="#1A1A2E" />
    <rect x="2" y="2" width="12" height="1" fill="#FF6B35" />
    <rect x="2" y="13" width="12" height="1" fill="#FF6B35" />
    <rect x="2" y="2" width="1" height="12" fill="#FF6B35" />
    <rect x="13" y="2" width="1" height="12" fill="#FF6B35" />
    {/* Stylized "Dr" */}
    <rect x="4" y="5" width="1" height="6" fill="#FF6B35" />
    <rect x="5" y="5" width="3" height="1" fill="#FF6B35" />
    <rect x="7" y="6" width="1" height="4" fill="#FF6B35" />
    <rect x="5" y="10" width="3" height="1" fill="#FF6B35" />
    <rect x="10" y="5" width="1" height="6" fill="#FF6B35" />
    <rect x="11" y="6" width="1" height="1" fill="#FF6B35" />
    <rect x="11" y="8" width="2" height="1" fill="#FF6B35" />
    <rect x="12" y="9" width="1" height="2" fill="#FF6B35" />
  </svg>
);

export const PixelPHPIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* PHP purple ellipse with white text */}
    <rect x="2" y="5" width="12" height="1" fill="#8892BF" />
    <rect x="1" y="6" width="14" height="4" fill="#8892BF" />
    <rect x="2" y="10" width="12" height="1" fill="#8892BF" />
    {/* 'PHP' letters in dark */}
    <rect x="3" y="7" width="1" height="2" fill="#15121C" />
    <rect x="4" y="7" width="1" height="1" fill="#15121C" />
    <rect x="5" y="7" width="1" height="2" fill="#15121C" />
    <rect x="7" y="7" width="1" height="2" fill="#15121C" />
    <rect x="8" y="7" width="1" height="1" fill="#15121C" />
    <rect x="9" y="7" width="1" height="2" fill="#15121C" />
    <rect x="11" y="7" width="1" height="2" fill="#15121C" />
    <rect x="12" y="7" width="1" height="1" fill="#15121C" />
    <rect x="13" y="7" width="0" height="2" fill="#15121C" />
  </svg>
);

export const PixelMySQLIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
    className={`pixelated ${className}`} aria-hidden="true">
    {/* MySQL dolphin silhouette in blue */}
    <rect x="6" y="2" width="4" height="1" fill="#00758F" />
    <rect x="5" y="3" width="6" height="2" fill="#00758F" />
    <rect x="4" y="5" width="8" height="2" fill="#00758F" />
    <rect x="5" y="7" width="6" height="2" fill="#00758F" />
    <rect x="6" y="9" width="4" height="2" fill="#00758F" />
    <rect x="4" y="11" width="2" height="2" fill="#00758F" />
    <rect x="10" y="11" width="2" height="2" fill="#00758F" />
    {/* Eye */}
    <rect x="9" y="4" width="1" height="1" fill="#FFFFFF" />
  </svg>
);
