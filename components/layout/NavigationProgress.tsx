"use client";

/**
 * NavigationProgress — a thin pixel-style top progress bar shown during
 * Next.js App Router page transitions.
 *
 * Strategy: use `usePathname` to detect when navigation has completed and
 * show a brief animated bar whenever the route changes. This covers both
 * client-side soft navigations and transitions that involve data fetching.
 *
 * We deliberately avoid fake "slow crawl" loaders that hold the UI hostage.
 * Instead: the bar sweeps quickly on start, holds briefly, then fades out.
 */

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const prevPathname = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip the very first render (initial page load)
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      return;
    }

    // A pathname change means navigation completed
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      // Cancel any existing animation
      if (timerRef.current) clearTimeout(timerRef.current);

      // Animate: appear at 0 → sweep to 100 → hold → fade out
      setWidth(0);
      setVisible(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWidth(100);
        });
      });

      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400); // bar visible for 400ms after navigation completes
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible && width === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: "2px" }}
    >
      <div
        className="h-full bg-[var(--color-accent-gold)] transition-all"
        style={{
          width: `${width}%`,
          transitionDuration: width === 100 ? "300ms" : "0ms",
          transitionTimingFunction: "ease-out",
          opacity: visible ? 1 : 0,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}
