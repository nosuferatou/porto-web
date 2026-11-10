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

  // Always start with the placeholder so the server HTML and the initial
  // client render are identical — avoiding the hydration mismatch.
  // The actual time is set only inside useEffect, which runs client-side only.
  const [time, setTime] = useState(PLACEHOLDER);
  const [offset, setOffset] = useState("");

  useEffect(() => {
    // Set initial real values immediately after mount
    setTime(formatTime(tz));
    setOffset(getUtcOffset(tz));

    // Snap to the next whole second, then tick every second
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      setTime(formatTime(tz));
      interval = setInterval(() => setTime(formatTime(tz)), 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [tz]);

  return (
    <span>
      {offset && <span className="text-[var(--color-text-ash)]">{offset} · </span>}
      <span className="font-mono tabular-nums" style={{ minWidth: "6.5ch", display: "inline-block" }}>{time}</span>
    </span>
  );
}
