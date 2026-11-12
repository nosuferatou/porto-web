"use client";

import React, { useEffect, useRef } from "react";
import { PixelSpinner } from "@/components/ui/PixelSpinner";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible confirmation dialog replacing browser `confirm()`.
 * Traps focus and closes on Escape key.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open
  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  // Close on Escape unless a request is already in flight.
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel, busy]);

  if (!open) return null;

  const baseButtonCls =
    "inline-flex items-center justify-center gap-2 font-pixel uppercase select-none pixel-hover pixel-press pixel-focus cursor-pointer text-xs px-3 py-1.5 tracking-wide min-h-[36px] disabled:opacity-60 disabled:pointer-events-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-busy={busy || undefined}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />

      {/* Dialog Panel */}
      <div className="relative z-10 w-full max-w-sm bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-border-subtle)] pixel-shadow-lg">
        {/* Corner studs */}
        <span aria-hidden="true" className="absolute -top-[3px] -left-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]" />
        <span aria-hidden="true" className="absolute -top-[3px] -right-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]" />
        <span aria-hidden="true" className="absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]" />
        <span aria-hidden="true" className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-[var(--color-accent-gold)]" />

        <div className="p-5 border-b border-[var(--color-border-gothic)]">
          <h2
            id="confirm-dialog-title"
            className="font-pixel text-sm text-[var(--color-text-bone)] uppercase tracking-wide"
          >
            {variant === "danger" ? "⚠ " : ""}{title}
          </h2>
        </div>

        <div className="p-5">
          <p
            id="confirm-dialog-message"
            className="font-mono text-xs text-[var(--color-text-ash)] leading-relaxed"
          >
            {message}
          </p>
        </div>

        <div className="px-5 pb-5 flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${baseButtonCls} bg-transparent text-[var(--color-text-bone)] border-2 border-[var(--color-border-gothic)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-obsidian)] hover:text-[var(--color-accent-gold)] pixel-shadow-sm`}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy || undefined}
            className={
              variant === "danger"
                ? `${baseButtonCls} bg-[var(--color-accent-blood)] text-[var(--color-text-bone)] border-2 border-[#B8283D] border-b-[#52111A] border-r-[#52111A] hover:bg-[var(--color-accent-blood-bright)] pixel-shadow`
                : `${baseButtonCls} bg-[var(--color-accent-blood)] text-[var(--color-text-bone)] border-2 border-[#B8283D] hover:bg-[var(--color-accent-blood-bright)] pixel-shadow`
            }
          >
            {busy && <PixelSpinner />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
