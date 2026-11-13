"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeContext";

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  kind: "ember" | "dust" | "leaf";
}

const PARTICLE_COUNT = 12;

const COLORS_DARK: Record<Particle["kind"], string> = {
  ember: "#C9A24B",
  dust: "#8A8397",
  leaf: "#6B5335",
};

const COLORS_DAY: Record<Particle["kind"], string> = {
  ember: "#A67A20",
  dust: "#7A6F60",
  leaf: "#3F563B",
};

const OPACITIES: Record<Particle["kind"], string> = {
  ember: "0.65",
  dust: "0.35",
  leaf: "0.45",
};

function makeParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const roll = Math.random();
    const kind: Particle["kind"] =
      roll < 0.45 ? "ember" : roll < 0.8 ? "dust" : "leaf";
    const duration = 18 + Math.random() * 10;
    particles.push({
      id: i,
      x: Math.round((Math.random() * 92 + 4) * 10) / 10,
      size: kind === "leaf" ? 3 : 2,
      delay: -1 * Math.round(Math.random() * duration * 10) / 10,
      duration: Math.round(duration * 10) / 10,
      drift: Math.round((Math.random() - 0.5) * 40),
      kind,
    });
  }
  return particles;
}

export const FloatingParticles: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const pathname = usePathname();
  const { theme } = useTheme();
  const activeColors = theme === "day" ? COLORS_DAY : COLORS_DARK;

  useEffect(() => {
    setParticles(makeParticles());
  }, []);

  if (pathname?.startsWith("/admin") || particles.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`floating-particles pointer-events-none fixed inset-0 overflow-hidden z-0 ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-particle"
          style={
            {
              "--fp-x": `${p.x}%`,
              "--fp-size": `${p.size}px`,
              "--fp-delay": `${p.delay}s`,
              "--fp-duration": `${p.duration}s`,
              "--fp-drift": `${p.drift}px`,
              "--fp-color": activeColors[p.kind],
              "--fp-opacity": OPACITIES[p.kind],
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
