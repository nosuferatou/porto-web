import React from "react";

export interface GothicDividerProps {
  label?: string;
  variant?: "simple" | "runic" | "skull" | "chain";
  className?: string;
}

export const GothicDivider: React.FC<GothicDividerProps> = ({
  label,
  variant = "runic",
  className = "",
}) => {
  const getGlyph = () => {
    switch (variant) {
      case "skull":
        return "☠";
      case "chain":
        return "⛓";
      case "simple":
        return "◆";
      case "runic":
      default:
        return "✦ ❖ ✦";
    }
  };

  return (
    <div
      role="separator"
      aria-label={label ?? "Section divider"}
      className={`w-full flex items-center justify-center my-8 sm:my-12 ${className}`}
    >
      <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-border-gothic)] to-[var(--color-border-subtle)]" />
      <div className="px-3 sm:px-4 flex items-center gap-2 text-[var(--color-accent-gold)] font-pixel text-xs sm:text-sm select-none uppercase tracking-widest">
        {label ? (
          <>
            <span aria-hidden="true" className="text-[var(--color-accent-blood)]">
              [
            </span>
            <span>{label}</span>
            <span aria-hidden="true" className="text-[var(--color-accent-blood)]">
              ]
            </span>
          </>
        ) : (
          <span aria-hidden="true" className="tracking-widest">
            {getGlyph()}
          </span>
        )}
      </div>
      <div className="flex-1 h-[2px] bg-gradient-to-r from-[var(--color-border-subtle)] via-[var(--color-border-gothic)] to-transparent" />
    </div>
  );
};
