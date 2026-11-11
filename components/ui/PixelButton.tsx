import React from "react";
import Link from "next/link";

export interface PixelButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

const variantStyles = {
  primary:
    "bg-[var(--color-accent-blood)] text-[var(--color-text-bone)] border-2 border-[#B8283D] border-b-[#52111A] border-r-[#52111A] hover:bg-[var(--color-accent-blood-bright)] hover:border-[#DF364E] active:border-t-[#52111A] active:border-l-[#52111A] pixel-shadow",
  secondary:
    "bg-[var(--color-surface-obsidian)] text-[var(--color-accent-gold)] border-2 border-[var(--color-accent-gold)] hover:bg-[#1E1929] hover:text-[var(--color-accent-gold-bright)] hover:border-[var(--color-accent-gold-bright)] pixel-shadow",
  ghost:
    "bg-transparent text-[var(--color-text-bone)] border-2 border-[var(--color-border-gothic)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-obsidian)] hover:text-[var(--color-accent-gold)] pixel-shadow-sm",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs min-h-[44px] tracking-wide",
  md: "px-5 py-2.5 text-sm min-h-[44px] tracking-wider",
  lg: "px-6 py-3.5 text-base min-h-[48px] tracking-widest",
};

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  target,
  rel,
  "aria-label": ariaLabel,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-pixel uppercase select-none transition-none pixel-press pixel-focus disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none cursor-pointer";

  const combinedClasses = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href && !disabled) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    // Hash-only links (e.g. "#posts") must render as plain <a> so the browser
    // handles smooth scrolling natively. Next.js <Link> treats hash hrefs as
    // route pushes, which can cause re-renders and make buttons feel unresponsive.
    const isHashOnly = href.startsWith("#");
    if (isExternal || isHashOnly) {
      return (
        <a
          href={href}
          onClick={onClick}
          target={isExternal ? (target ?? "_blank") : target}
          rel={isExternal ? (rel ?? "noopener noreferrer") : rel}
          aria-label={ariaLabel}
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combinedClasses}
    >
      {children}
    </button>
  );
};
