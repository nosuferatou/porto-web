import React from "react";

export default function PostsLoading() {
  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-3 w-28 bg-[var(--color-border-subtle)] rounded-none" />
          <div className="h-7 w-72 bg-[var(--color-border-gothic)] rounded-none" />
          <div className="h-3 w-96 bg-[var(--color-border-subtle)] rounded-none" />
        </div>
        {/* Filter pills skeleton */}
        <div className="flex gap-2">
          {[80, 120, 100, 90, 80].map((w, i) => (
            <div key={i} className="h-10 bg-[var(--color-border-gothic)] rounded-none" style={{ width: w }} />
          ))}
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] p-0">
              <div className="aspect-video bg-[var(--color-border-gothic)]" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-[var(--color-border-subtle)]" />
                <div className="h-4 w-full bg-[var(--color-border-gothic)]" />
                <div className="h-3 w-4/5 bg-[var(--color-border-subtle)]" />
                <div className="h-3 w-3/5 bg-[var(--color-border-subtle)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
