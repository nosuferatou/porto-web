import React from "react";

/**
 * A small decorative pixel-art campfire with animated flames and warm glow.
 * Pure CSS — no canvas, no JS animation loops.
 */
export const PixelCampfire: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pixel-campfire pointer-events-none select-none ${className}`}
    >
      <div className="campfire-glow" />

      <div className="campfire-body">
        <div className="flame flame-outer" />
        <div className="flame flame-mid" />
        <div className="flame flame-core" />
        <div className="flame flame-tip" />

        <div className="ember ember-1" />
        <div className="ember ember-2" />
        <div className="ember ember-3" />
        <div className="ember ember-4" />

        <div className="logs">
          <div className="log log-left" />
          <div className="log log-right" />
          <div className="log-coals" />
          <div className="stone stone-left" />
          <div className="stone stone-right" />
        </div>
      </div>
    </div>
  );
};
