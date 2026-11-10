"use client";

import { useState, useEffect } from "react";

const DEFAULT_TZ = "Asia/Jakarta";
const PLACEHOLDER = "--:--:--";

function formatTime(tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return PLACEHOLDER;
  }
}

function getUtcOffset(tz: string): string {
  try {
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).format(new Date());
    const match = formatted.match(/(GMT[+-]\d+(?::\d+)?|GMT)/i);
    return match ? match[1].replace("GMT", "UTC") : "";
  } catch {
    return "";
  }
}

interface SanctuaryClockProps {
  timezone?: string;
}

export function SanctuaryClock({ timezone = DEFAULT_TZ }: SanctuaryClockProps) {
  const tz = timezone || DEFAULT_TZ;

  // Always start with stable placeholder values so server HTML and first
  // client render are identical (hydration safety).
  const [time, setTime] = useState(PLACEHOLDER);
  const [offset, setOffset] = useState("");

  useEffect(() => {
    // All setState calls live inside timer callbacks — never in the
    // synchronous effect body — satisfying react-hooks/set-state-in-effect.
    let interval: ReturnType<typeof setInterval> | undefined;

    // Snap to the next whole-second boundary, then tick every second.
    const msUntilNextSecond = 1000 - (Date.now() % 1000);

    const timeout = setTimeout(() => {
      setTime(formatTime(tz));
      setOffset(getUtcOffset(tz));

      interval = setInterval(() => {
        setTime(formatTime(tz));
        // Re-compute offset each tick so DST transitions are picked up.
        setOffset(getUtcOffset(tz));
      }, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeout);
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [tz]);

  return (
    <span>
      {offset && <span className="text-[var(--color-text-ash)]">{offset} · </span>}
      <span
        className="font-mono tabular-nums"
        style={{ minWidth: "6.5ch", display: "inline-block" }}
      >
        {time}
      </span>
    </span>
  );
}
