import React from "react";
import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";

export default function AdminNewPostPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-xs font-pixel text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] uppercase tracking-wider mb-2 pixel-focus"
        >
          <span>‹</span>
          <span>Return to Manuscripts</span>
        </Link>
        <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Forge New Manuscript
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Inscribe a new portfolio entry into the SQLite database.
        </p>
      </div>

      <PostForm isEdit={false} />
    </div>
  );
}
