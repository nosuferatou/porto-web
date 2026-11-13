"use client";

import React from "react";
import { useTheme } from "@/components/theme/ThemeContext";

/**
 * Pixel-art Crescent Moon (24×24 grid)
 * Gothic parchment tones with ivory highlights and crater shade.
 */
const PixelMoonIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
    aria-hidden="true"
  >
    {/* Darker shadow / crater edge */}
    <rect x="8" y="2" width="6" height="1" fill="#C5BCA8" />
    <rect x="6" y="3" width="2" height="1" fill="#C5BCA8" />
    <rect x="13" y="3" width="3" height="1" fill="#A89F8B" />
    <rect x="5" y="4" width="2" height="1" fill="#C5BCA8" />
    <rect x="14" y="4" width="2" height="1" fill="#9C927D" />
    <rect x="4" y="5" width="2" height="1" fill="#C5BCA8" />
    <rect x="13" y="5" width="2" height="1" fill="#8A806C" />
    <rect x="3" y="6" width="2" height="2" fill="#E8E2D2" />
    <rect x="11" y="6" width="3" height="1" fill="#8A806C" />
    <rect x="10" y="7" width="2" height="1" fill="#8A806C" />
    <rect x="2" y="8" width="2" height="8" fill="#E8E2D2" />
    <rect x="9" y="8" width="2" height="2" fill="#8A806C" />
    <rect x="8" y="10" width="2" height="4" fill="#8A806C" />
    <rect x="9" y="14" width="2" height="2" fill="#8A806C" />
    <rect x="10" y="16" width="2" height="1" fill="#8A806C" />
    <rect x="11" y="17" width="3" height="1" fill="#8A806C" />
    <rect x="3" y="16" width="2" height="2" fill="#E8E2D2" />
    <rect x="4" y="18" width="2" height="1" fill="#C5BCA8" />
    <rect x="13" y="18" width="2" height="1" fill="#8A806C" />
    <rect x="5" y="19" width="2" height="1" fill="#C5BCA8" />
    <rect x="14" y="19" width="2" height="1" fill="#9C927D" />
    <rect x="6" y="20" width="2" height="1" fill="#C5BCA8" />
    <rect x="13" y="20" width="3" height="1" fill="#A89F8B" />
    <rect x="8" y="21" width="6" height="1" fill="#C5BCA8" />

    {/* Luminous moon face */}
    <rect x="8" y="3" width="5" height="1" fill="#FAF6EE" />
    <rect x="7" y="4" width="7" height="1" fill="#FAF6EE" />
    <rect x="6" y="5" width="7" height="1" fill="#FAF6EE" />
    <rect x="5" y="6" width="6" height="2" fill="#FAF6EE" />
    <rect x="4" y="8" width="5" height="8" fill="#FAF6EE" />
    <rect x="5" y="16" width="5" height="2" fill="#FAF6EE" />
    <rect x="6" y="18" width="7" height="1" fill="#FAF6EE" />
    <rect x="7" y="19" width="7" height="1" fill="#FAF6EE" />
    <rect x="8" y="20" width="5" height="1" fill="#FAF6EE" />

    {/* Craters & specular highlights */}
    <rect x="4" y="9" width="2" height="2" fill="#FFFFFF" />
    <rect x="3" y="11" width="1" height="2" fill="#FFFFFF" />
    <rect x="5" y="12" width="2" height="2" fill="#D5CDBC" />
    <rect x="6" y="8" width="2" height="1" fill="#D5CDBC" />
    <rect x="6" y="15" width="2" height="1" fill="#D5CDBC" />
    <rect x="7" y="5" width="2" height="1" fill="#FFFFFF" />
  </svg>
);

/**
 * Pixel-art Golden Sun (24×24 grid)
 * Warm sunlit gold and ivory with stepped cardinal and diagonal rays.
 */
const PixelSunIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pixelated ${className}`}
    style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
    aria-hidden="true"
  >
    {/* Cardinal Ray Tips */}
    <rect x="11" y="0" width="2" height="1" fill="#FFF4CC" />
    <rect x="11" y="1" width="2" height="3" fill="#DFB75E" />
    <rect x="11" y="20" width="2" height="3" fill="#C9A24B" />
    <rect x="11" y="23" width="2" height="1" fill="#9E6914" />

    <rect x="0" y="11" width="1" height="2" fill="#FFF4CC" />
    <rect x="1" y="11" width="3" height="2" fill="#DFB75E" />
    <rect x="20" y="11" width="3" height="2" fill="#C9A24B" />
    <rect x="23" y="11" width="1" height="2" fill="#9E6914" />

    {/* Diagonal Stepped Rays */}
    <rect x="3" y="3" width="2" height="2" fill="#DFB75E" />
    <rect x="5" y="5" width="2" height="2" fill="#F4D378" />
    <rect x="19" y="3" width="2" height="2" fill="#DFB75E" />
    <rect x="17" y="5" width="2" height="2" fill="#F4D378" />
    <rect x="3" y="19" width="2" height="2" fill="#C9A24B" />
    <rect x="5" y="17" width="2" height="2" fill="#E5A932" />
    <rect x="19" y="19" width="2" height="2" fill="#C9A24B" />
    <rect x="17" y="17" width="2" height="2" fill="#E5A932" />

    {/* Outer Disc Rim */}
    <rect x="9" y="5" width="6" height="1" fill="#C9A24B" />
    <rect x="7" y="6" width="2" height="1" fill="#C9A24B" />
    <rect x="15" y="6" width="2" height="1" fill="#C9A24B" />
    <rect x="6" y="7" width="1" height="2" fill="#C9A24B" />
    <rect x="17" y="7" width="1" height="2" fill="#C9A24B" />
    <rect x="5" y="9" width="1" height="6" fill="#C9A24B" />
    <rect x="18" y="9" width="1" height="6" fill="#B37A1D" />
    <rect x="6" y="15" width="1" height="2" fill="#B37A1D" />
    <rect x="17" y="15" width="1" height="2" fill="#B37A1D" />
    <rect x="7" y="17" width="2" height="1" fill="#B37A1D" />
    <rect x="15" y="17" width="2" height="1" fill="#B37A1D" />
    <rect x="9" y="18" width="6" height="1" fill="#9E6914" />

    {/* Radiant Solar Body */}
    <rect x="8" y="6" width="8" height="1" fill="#FCE99B" />
    <rect x="7" y="7" width="10" height="2" fill="#FCE99B" />
    <rect x="6" y="9" width="12" height="6" fill="#F4D378" />
    <rect x="7" y="15" width="10" height="2" fill="#E5A932" />
    <rect x="8" y="17" width="8" height="1" fill="#D39222" />

    {/* Bright Solar Flare Center */}
    <rect x="8" y="8" width="6" height="4" fill="#FFFDF2" />
    <rect x="9" y="7" width="4" height="6" fill="#FFFDF2" />
    <rect x="10" y="9" width="3" height="2" fill="#FFFFFF" />
  </svg>
);

export const CelestialThemeToggle: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { theme, toggleTheme, isAdmin } = useTheme();

  // Admin routes are strictly locked to dark mode and must not render the toggle
  if (isAdmin) {
    return null;
  }

  const isDay = theme === "day";

  return (
    <div
      className={`celestial-toggle-container fixed z-30 pointer-events-auto ${className}`}
      style={{
        top: "clamp(76px, 8vh, 100px)",
        right: "clamp(20px, 10vw, 150px)",
      }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          isDay
            ? "Switch to Dark Mode (Crescent Moon)"
            : "Switch to Day Mode (Golden Sun)"
        }
        aria-pressed={isDay}
        title={
          isDay
            ? "Nightfall: Return to the Obsidian Codex"
            : "Daybreak: Awaken the Sunlit Codex"
        }
        className="celestial-toggle group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-abyss)]"
      >
        {/* One halo marks the celestial object whose mode is active. */}
        <span
          aria-hidden="true"
          className={`celestial-halo absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
            isDay ? "celestial-halo-sun" : "celestial-halo-moon"
          }`}
        />

        {/* Crossfading pixel silhouettes reads as a lunar-to-solar change. */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
          {/* Crescent Moon */}
          <div
            className={`celestial-icon absolute inset-0 flex items-center justify-center transition-all duration-[350ms] ease-out ${
              isDay
                ? "opacity-0 -rotate-90 scale-50 pointer-events-none"
                : "opacity-100 rotate-0 scale-100"
            }`}
          >
            <PixelMoonIcon className="w-full h-full drop-shadow-[0_2px_8px_rgba(217,210,195,0.4)]" />
          </div>

          {/* Golden Sun */}
          <div
            className={`celestial-icon absolute inset-0 flex items-center justify-center transition-all duration-[350ms] ease-out ${
              isDay
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-50 pointer-events-none"
            }`}
          >
            <PixelSunIcon className="w-full h-full drop-shadow-[0_2px_12px_rgba(201,162,75,0.55)]" />
          </div>
        </div>

        {/* Screen reader live region text */}
        <span className="sr-only">
          Current theme: {isDay ? "Day Mode" : "Dark Mode"}
        </span>
      </button>
    </div>
  );
};
