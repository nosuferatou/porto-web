/**
 * Route-level skeleton for server-rendered admin pages (Overview, Edit Post).
 * Client pages keep their own in-page skeletons for post-fetch loading.
 */
export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">Loading admin page</span>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-52 bg-[var(--color-border-gothic)]" />
          <div className="h-3 w-64 bg-[var(--color-border-subtle)]" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 bg-[var(--color-border-gothic)]" />
          <div className="h-9 w-24 bg-[var(--color-border-gothic)]" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-border-gothic)] p-4 text-center space-y-3"
          >
            <div className="h-3 w-20 mx-auto bg-[var(--color-border-subtle)]" />
            <div className="h-8 w-12 mx-auto bg-[var(--color-border-gothic)]" />
            <div className="h-2.5 w-24 mx-auto bg-[var(--color-border-subtle)]" />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 bg-[var(--color-border-gothic)]" />
        ))}
      </div>

      {/* Recent posts table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 bg-[var(--color-border-gothic)]" />
          <div className="h-3 w-24 bg-[var(--color-border-subtle)]" />
        </div>
        <div className="bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border-gothic)] p-0 overflow-hidden">
          <div className="bg-[#120E18] h-10 border-b border-[var(--color-border-gothic)]" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3.5 border-b border-[var(--color-border-gothic)] last:border-b-0"
            >
              <div className="h-3 w-4 bg-[var(--color-border-subtle)]" />
              <div className="h-3 flex-1 bg-[var(--color-border-gothic)]" />
              <div className="h-3 w-20 bg-[var(--color-border-subtle)] hidden sm:block" />
              <div className="h-5 w-20 bg-[var(--color-border-gothic)]" />
              <div className="h-6 w-24 bg-[var(--color-border-gothic)] ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
