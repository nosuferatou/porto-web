import React from "react";

export default function PostDetailLoading() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 w-full py-8 space-y-8">
      <div className="animate-pulse space-y-8">
        {/* Breadcrumb */}
        <div className="h-4 w-40 bg-[var(--color-border-subtle)]" />
        {/* Header */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-24 bg-[var(--color-border-gothic)]" />
          </div>
          <div className="h-10 w-3/4 bg-[var(--color-border-gothic)]" />
          <div className="h-4 w-full bg-[var(--color-border-subtle)]" />
          <div className="h-4 w-5/6 bg-[var(--color-border-subtle)]" />
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)]">
            <div className="space-y-1">
              <div className="h-2.5 w-20 bg-[var(--color-border-subtle)]" />
              <div className="h-3.5 w-32 bg-[var(--color-border-gothic)]" />
            </div>
            <div className="space-y-1">
              <div className="h-2.5 w-20 bg-[var(--color-border-subtle)]" />
              <div className="h-5 w-28 bg-[var(--color-border-gothic)]" />
            </div>
          </div>
        </div>
        {/* Banner */}
        <div className="aspect-video w-full bg-[var(--color-border-gothic)]" />
        {/* Content */}
        <div className="bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] p-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-[var(--color-border-subtle)]" style={{ width: i % 2 === 0 ? "80%" : "100%" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
