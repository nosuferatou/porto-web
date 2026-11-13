"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const BackgroundEnvironment: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="bg-environment pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {/* Sky gradient with subtle stars */}
      <div className="bg-env-sky" />

      {/* Distant castle silhouette on the horizon */}
      <div className="bg-env-castle" />

      {/* Far mountain range */}
      <div className="bg-env-mountains-far" />

      {/* Mid forest layer */}
      <div className="bg-env-forest-mid" />

      {/* Near forest layer */}
      <div className="bg-env-forest-near" />

      {/* Fog layers */}
      <div className="bg-env-fog bg-env-fog-1" />
      <div className="bg-env-fog bg-env-fog-2" />

      {/* Bottom fade into page background */}
      <div className="bg-env-ground-fade" />
    </div>
  );
};
