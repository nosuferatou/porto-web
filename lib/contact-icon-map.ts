/**
 * Centralised icon map for contact platform icons.
 *
 * Both the public ContactSection and the Admin Contacts CMS import from here
 * so the mapping never diverges. Keys are the stable `iconKey` values stored
 * in the database (always lowercase, no spaces).
 *
 * All icons are pixel-art SVG components from components/icons/PixelIcons.tsx.
 * Unknown keys fall back to PixelOtherIcon.
 */

import type { FC } from "react";
import {
  PixelGitHubIcon,
  PixelGitLabIcon,
  PixelLinkedInIcon,
  PixelInstagramIcon,
  PixelThreadsIcon,
  PixelXIcon,
  PixelFacebookIcon,
  PixelTikTokIcon,
  PixelYouTubeIcon,
  PixelDiscordIcon,
  PixelBehanceIcon,
  PixelDribbbleIcon,
  PixelArtStationIcon,
  PixelPinterestIcon,
  PixelMediumIcon,
  PixelTelegramIcon,
  PixelWhatsAppIcon,
  PixelWebsiteIcon,
  PixelMailIcon,
  PixelOtherIcon,
} from "@/components/icons";

export type IconComponent = FC<{ size?: number; className?: string }>;

export const contactIconMap: Record<string, IconComponent> = {
  github:    PixelGitHubIcon,
  gitlab:    PixelGitLabIcon,
  linkedin:  PixelLinkedInIcon,
  instagram: PixelInstagramIcon,
  threads:   PixelThreadsIcon,
  x:         PixelXIcon,
  facebook:  PixelFacebookIcon,
  tiktok:    PixelTikTokIcon,
  youtube:   PixelYouTubeIcon,
  discord:   PixelDiscordIcon,
  behance:   PixelBehanceIcon,
  dribbble:  PixelDribbbleIcon,
  artstation:PixelArtStationIcon,
  pinterest: PixelPinterestIcon,
  medium:    PixelMediumIcon,
  telegram:  PixelTelegramIcon,
  whatsapp:  PixelWhatsAppIcon,
  website:   PixelWebsiteIcon,
  email:     PixelMailIcon,
  other:     PixelOtherIcon,
};

/** Resolve the icon component for a given iconKey. Falls back to PixelOtherIcon. */
export function getContactIcon(iconKey: string): IconComponent {
  return contactIconMap[iconKey.toLowerCase()] ?? PixelOtherIcon;
}
