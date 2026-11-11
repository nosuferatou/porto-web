import React from "react";

/**
 * Root loading.tsx — shown during navigation to the homepage.
 * Uses pixel-style elongated rectangular skeleton blocks that
 * foreshadow the actual homepage content layout.
 */
export default function HomeLoading() {
  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-8 space-y-4">
      <div className="animate-pulse">

        {/* Information Section skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4 pb-8">
          {/* Avatar column */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <div className="w-48 sm:w-56 md:w-full max-w-[280px] aspect-square bg-[var(--color-border-gothic)]" />
            <div className="mt-4 w-full max-w-[280px] h-9 bg-[var(--color-border-subtle)]" />
          </div>
          {/* Bio column */}
          <div className="md:col-span-8 space-y-4">
            <div className="h-3 w-48 bg-[var(--color-border-subtle)]" />
            <div className="h-9 w-72 bg-[var(--color-border-gothic)]" />
            <div className="h-5 w-56 bg-[var(--color-border-subtle)]" />
            <div className="bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] p-4 space-y-2">
              <div className="h-3 w-full bg-[var(--color-border-subtle)]" />
              <div className="h-3 w-5/6 bg-[var(--color-border-subtle)]" />
              <div className="h-3 w-4/6 bg-[var(--color-border-subtle)]" />
              <div className="mt-4 pt-4 border-t border-[var(--color-border-gothic)] grid grid-cols-3 gap-3">
                <div className="h-8 bg-[var(--color-border-gothic)]" />
                <div className="h-8 bg-[var(--color-border-gothic)]" />
                <div className="h-8 bg-[var(--color-border-gothic)]" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-36 bg-[var(--color-border-gothic)]" />
              <div className="h-11 w-32 bg-[var(--color-border-subtle)]" />
            </div>
          </div>
        </div>

        {/* Skills section skeleton */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-56 bg-[var(--color-border-gothic)]" />
            <div className="h-3 w-16 bg-[var(--color-border-subtle)]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-border-gothic)] h-20" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 sm:my-12 h-px bg-[var(--color-border-gothic)]" />

        {/* Featured posts section skeleton */}
        <div className="space-y-6 pb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-[var(--color-border-subtle)]" />
              <div className="h-6 w-56 bg-[var(--color-border-gothic)]" />
            </div>
            <div className="h-9 w-32 bg-[var(--color-border-subtle)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)]">
                <div className="aspect-video bg-[var(--color-border-gothic)]" />
                <div className="p-5 sm:p-6 space-y-2">
                  <div className="h-3 w-24 bg-[var(--color-border-subtle)]" />
                  <div className="h-4 w-full bg-[var(--color-border-gothic)]" />
                  <div className="h-3 w-4/5 bg-[var(--color-border-subtle)]" />
                  <div className="h-3 w-3/5 bg-[var(--color-border-subtle)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
