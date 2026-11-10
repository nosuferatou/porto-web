import React from "react";

export interface PixelFrameProps {
  children: React.ReactNode;
  variant?: "stone" | "relic" | "gold" | "blood";
  cornerStuds?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  className?: string;
}

const variantStyles = {
  stone: {
    outer: "bg-[#100D16] border-2 border-[var(--color-border-gothic)] pixel-shadow",
    inner: "border-2 border-[#1A1624]",
    stud: "bg-[var(--color-border-subtle)]",
  },
  relic: {
    outer: "bg-[#130E1B] border-2 border-[var(--color-border-subtle)] pixel-shadow-lg",
    inner: "border border-[var(--color-accent-gold)]/40",
    stud: "bg-[var(--color-accent-gold)]",
  },
  gold: {
    outer: "bg-[#181309] border-2 border-[var(--color-accent-gold)] pixel-shadow-gold",
    inner: "border border-[var(--color-accent-gold-bright)]/60",
    stud: "bg-[var(--color-accent-gold-bright)]",
  },
  blood: {
    outer: "bg-[#160B0F] border-2 border-[var(--color-accent-blood)] pixel-shadow-blood",
    inner: "border border-[var(--color-accent-blood-bright)]/50",
    stud: "bg-[var(--color-accent-blood-bright)]",
  },
};

const aspectStyles = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
};

export const PixelFrame: React.FC<PixelFrameProps> = ({
  children,
  variant = "relic",
  cornerStuds = true,
  aspectRatio = "auto",
  className = "",
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={`relative p-1.5 sm:p-2 ${styles.outer} ${className}`}>
      {cornerStuds && (
        <>
          <span
            aria-hidden="true"
            className={`absolute -top-1 -left-1 w-2 h-2 ${styles.stud}`}
          />
          <span
            aria-hidden="true"
            className={`absolute -top-1 -right-1 w-2 h-2 ${styles.stud}`}
          />
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 -left-1 w-2 h-2 ${styles.stud}`}
          />
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 -right-1 w-2 h-2 ${styles.stud}`}
          />
        </>
      )}
      <div
        className={`relative overflow-hidden ${styles.inner} ${aspectStyles[aspectRatio]}`}
      >
        {children}
      </div>
    </div>
  );
};
