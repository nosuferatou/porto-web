"use client";

import React from "react";

export interface AdminAlertMessage {
  text: string;
  type: "success" | "error" | "info";
}

interface AdminAlertProps {
  message: AdminAlertMessage | null;
  className?: string;
}

/**
 * Consistent inline alert for admin pages.
 * Replaces both the profile page's success/error message pattern and the
 * skills/contacts pages' basic error string pattern.
 */
export const AdminAlert: React.FC<AdminAlertProps> = ({ message, className = "" }) => {
  if (!message) return null;

  const styles: Record<AdminAlertMessage["type"], string> = {
    success: "bg-[#101812] border-[#22C55E] text-[#4ADE80]",
    error: "bg-[#1C0D12] border-[var(--color-accent-blood)] text-[#E05368]",
    info: "bg-[#0E0E1A] border-[var(--color-border-subtle)] text-[var(--color-text-ash)]",
  };

  const icons: Record<AdminAlertMessage["type"], string> = {
    success: "✓",
    error: "⚠",
    info: "ℹ",
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-3 border-2 font-mono text-xs pixel-shadow-sm flex items-center gap-2 ${styles[message.type]} ${className}`}
    >
      <span className="font-pixel text-sm shrink-0">{icons[message.type]}</span>
      <span>{message.text}</span>
    </div>
  );
};
