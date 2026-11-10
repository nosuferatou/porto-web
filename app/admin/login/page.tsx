"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PixelCard, PixelButton, PixelFrame } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication ward refused entry.");
        setLoading(false);
        return;
      }

      router.push(data.redirect || "/admin");
      router.refresh();
    } catch {
      setError("Failed to communicate with the authentication sanctum.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[var(--color-bg-abyss)] selection:bg-[var(--color-accent-blood)] selection:text-[var(--color-text-bone)]">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-pixel text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] uppercase tracking-wider pixel-focus"
          >
            <span>‹</span>
            <span>Return to Mortal Realm</span>
          </Link>
        </div>

        {/* Portal Login Card */}
        <PixelCard variant="elevated" cornerStuds className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <PixelFrame
              variant="gold"
              aspectRatio="square"
              className="w-14 h-14 mx-auto mb-3"
            >
              <div className="w-full h-full bg-[#181124] flex items-center justify-center font-pixel text-xl text-[var(--color-accent-gold)] select-none">
                ⚔
              </div>
            </PixelFrame>
            <h1 className="font-pixel text-lg sm:text-xl text-[var(--color-text-bone)] uppercase tracking-wider">
              Sanctum Portal
            </h1>
            <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
              Enter master credentials to access the Codex CMS.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 p-3 bg-[#1C0D12] border-2 border-[var(--color-accent-blood)] text-[#E05368] font-mono text-xs pixel-shadow-sm flex items-start gap-2"
            >
              <span className="font-pixel text-sm">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1.5"
              >
                Archivist Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@obsidian.relic"
                className="w-full px-3.5 py-2.5 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow-sm transition-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wider mb-1.5"
              >
                Master Cipher
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0B0A10] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-bone)] font-mono text-xs focus:border-[var(--color-accent-gold)] focus:outline-none pixel-shadow-sm transition-none"
              />
            </div>

            <div className="pt-2">
              <PixelButton
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Unlocking Ward..." : "Dispel Ward & Enter"}
              </PixelButton>
            </div>
          </form>

        </PixelCard>
      </div>
    </div>
  );
}
