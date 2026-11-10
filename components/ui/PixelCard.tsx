import React from "react";

export interface PixelCardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "gold" | "blood";
  interactive?: boolean;
  cornerStuds?: boolean;
  className?: string;
  as?: "div" | "article" | "section";
}

const variantStyles = {
  default:
    "bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-border-gothic)] text-[var(--color-text-bone)] pixel-shadow",
  elevated:
    "bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] pixel-shadow-lg",
  gold:
    "bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-accent-gold)] text-[var(--color-text-bone)] pixel-shadow-gold",
  blood:
    "bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-accent-blood)] text-[var(--color-text-bone)] pixel-shadow-blood",
};

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  variant = "default",
  interactive = false,
  cornerStuds = false,
  className = "",
  as: Component = "div",
}) => {
  const interactiveClasses = interactive
    ? "transition-none hover:-translate-y-1 hover:border-[var(--color-accent-gold)] hover:shadow-[5px_5px_0px_0px_#000000] cursor-pointer"
    : "";

  return (
    <Component
      className={`relative p-5 sm:p-6 ${variantStyles[variant]} ${interactiveClasses} ${className}`}
    >
      {cornerStuds && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]"
          />
          <span
            aria-hidden="true"
            className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]"
          />
        </>
      )}
      {children}
    </Component>
  );
};
