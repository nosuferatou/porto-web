import React from "react";

interface PixelSpinnerProps {
  className?: string;
}

/**
 * Three-square pixel activity indicator for inline button use.
 * Decorative by default: the surrounding button carries the busy state.
 */
export const PixelSpinner: React.FC<PixelSpinnerProps> = ({ className = "" }) => (
  <span aria-hidden="true" className={`inline-flex items-end gap-0.5 shrink-0 ${className}`}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1 h-1 bg-current animate-pulse"
        style={{ animationDelay: `${i * 140}ms` }}
      />
    ))}
  </span>
);
