import React from "react";

export interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "blood" | "magic";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default:
    "bg-[var(--color-surface-obsidian)] text-[var(--color-text-ash)] border border-[var(--color-border-gothic)]",
  gold:
    "bg-[var(--color-badge-gold-bg)] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]",
  blood:
    "bg-[var(--color-badge-blood-bg)] text-[var(--color-badge-blood-text)] border border-[var(--color-accent-blood)]",
  magic:
    "bg-[var(--color-badge-magic-bg)] text-[var(--color-badge-magic-text)] border border-[var(--color-magic-shadow)]",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[11px] font-mono tracking-tight",
  md: "px-2.5 py-1 text-xs font-mono tracking-wide",
};

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center uppercase select-none pixel-shadow-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
