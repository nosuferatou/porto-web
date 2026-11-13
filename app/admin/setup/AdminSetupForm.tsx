"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PixelCard, PixelButton, PixelFrame } from "@/components/ui";

const passwordRules = [
  { label: "At least 12 characters", test: (p: string) => p.length >= 12 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /[0-9]/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function AdminSetupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStrength, setShowStrength] = useState(false);

  const allRulesMet = passwordRules.every((r) => r.test(password));
  const passwordsMatch = password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!allRulesMet) {
      setError("Password does not meet the requirements below.");
      setShowStrength(true);
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword: confirm }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Setup failed.");
        setLoading(false);
        return;
      }

      // Full browser navigation ensures the new session cookie is present
      // in the first admin request (same fix as login page).
      window.location.assign(data.redirect || "/admin");
    } catch {
      setError("Failed to reach the server.");
      setLoading(false);
    }
  };

  return (
    <div data-admin-root>
      <div className="mb-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-pixel text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] uppercase tracking-wider pixel-focus"
        >
          <span>‹</span>
          <span>Return to Mortal Realm</span>
        </Link>
      </div>

      <PixelCard variant="elevated" cornerStuds className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <PixelFrame
            variant="gold"
            aspectRatio="square"
            className="w-14 h-14 mx-auto mb-3"
          >
            <div className="w-full h-full bg-[#181124] flex items-center justify-center font-pixel text-xl text-[var(--color-accent-gold)] select-none">
              ✦
            </div>
          </PixelFrame>
          <h1 className="font-pixel text-lg sm:text-xl text-[var(--color-text-bone)] uppercase tracking-wider">
            First-Run Setup
          </h1>
          <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
            Create the administrator account for the Obsidian Codex.
          </p>
        </div>

        <div className="mb-5 p-3 bg-[#0E0E1A] border border-[var(--color-border-subtle)] font-mono text-[11px] text-[var(--color-text-ash)] leading-relaxed">
          This page is only available once. After submitting, the setup route is permanently closed.
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3 bg-[#1C0D12] border-2 border-[var(--color-accent-blood)] text-[#E05368] font-mono text-xs pixel-shadow-sm flex items-start gap-2"
          >
            <span className="font-pixel text-sm shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="setup-email"
              className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1.5"
            >
              Admin Email
            </label>
            <input
              id="setup-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              className="w-full px-3.5 py-2.5 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="setup-password"
              className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <input
              id="setup-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowStrength(true);
              }}
              placeholder="Strong password"
              className="w-full px-3.5 py-2.5 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow-sm"
            />

            {showStrength && (
              <ul className="mt-2 space-y-1" aria-label="Password requirements">
                {passwordRules.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={`font-mono text-[10px] flex items-center gap-1.5 ${
                        met ? "text-[#4ADE80]" : "text-[var(--color-text-ash)]"
                      }`}
                    >
                      <span aria-hidden="true">{met ? "✓" : "·"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="setup-confirm"
              className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1.5"
            >
              Confirm Password
            </label>
            <input
              id="setup-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full px-3.5 py-2.5 bg-[#0B0A10] border-2 text-[var(--color-text-bone)] font-mono text-xs focus:outline-none pixel-shadow-sm ${
                confirm.length > 0 && !passwordsMatch
                  ? "border-[var(--color-accent-blood)] focus:border-[var(--color-accent-blood)]"
                  : "border-[var(--color-border-subtle)] focus:border-[var(--color-accent-gold)]"
              }`}
            />
            {confirm.length > 0 && !passwordsMatch && (
              <p className="font-mono text-[10px] text-[#E05368] mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="pt-2">
            <PixelButton
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </PixelButton>
          </div>
        </form>
      </PixelCard>
    </div>
  );
}
