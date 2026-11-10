"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PixelCard, PixelButton, PixelBadge } from "@/components/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminAlert, AdminAlertMessage } from "@/components/admin/AdminAlert";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  glyph: string;
  updatedAt: string;
}

type Filter = "all" | "published" | "draft";

export default function AdminPostsListPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [alert, setAlert] = useState<AdminAlertMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PostItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const showAlert = (text: string, type: AdminAlertMessage["type"] = "error") => {
    setAlert({ text, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showAlert(`"${deleteTarget.title}" has been purged.`, "success");
        await loadPosts();
      } else {
        const data = await res.json();
        showAlert(data.error || "Failed to purge manuscript.");
      }
    } catch {
      showAlert("Failed to purge manuscript.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const featuredCount = posts.filter((p) => p.featured).length;

  const filteredPosts = posts.filter((p) => {
    if (filter === "published") return p.status === "published";
    if (filter === "draft") return p.status === "draft";
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-12 font-pixel text-xs text-[var(--color-accent-gold)]">
        Cataloguing Manuscripts...
      </div>
    );
  }

  const filterBtn = (value: Filter, label: string, count: number) => (
    <button
      type="button"
      onClick={() => setFilter(value)}
      className={`px-3 py-1 font-pixel text-xs uppercase tracking-wide pixel-focus cursor-pointer ${
        filter === value
          ? "bg-[#231A30] text-[var(--color-accent-gold)] border border-[var(--color-accent-gold)]"
          : "text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)]"
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
            Manuscript Archives
          </h1>
          <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
            {posts.length} total — {publishedCount} published, {draftCount} draft
            {featuredCount > 0 && `, ${featuredCount} featured`}
          </p>
        </div>
        <PixelButton href="/admin/posts/new" variant="primary" size="sm">
          + Forge New Manuscript
        </PixelButton>
      </div>

      <AdminAlert message={alert} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterBtn("all", "All", posts.length)}
        {filterBtn("published", "Published", publishedCount)}
        {filterBtn("draft", "Drafts", draftCount)}
      </div>

      {/* Table */}
      <PixelCard variant="default" className="p-0 overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <p className="font-pixel text-xs text-[var(--color-text-ash)] uppercase tracking-wide">
              {filter === "all"
                ? "The Codex is empty."
                : filter === "published"
                ? "No published manuscripts."
                : "No drafts in the archive."}
            </p>
            {filter === "all" && (
              <PixelButton href="/admin/posts/new" variant="primary" size="sm">
                Forge the First Manuscript
              </PixelButton>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#120E18] border-b border-[var(--color-border-gothic)] text-[var(--color-text-ash)] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5 hidden sm:table-cell">Slug</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 hidden md:table-cell">Featured</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-gothic)]">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#181324]">
                    <td className="p-3.5 font-medium text-[var(--color-text-bone)]">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{post.glyph}</span>
                        <span className="truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[var(--color-text-ash)] truncate max-w-[150px] hidden sm:table-cell">
                      {post.slug}
                    </td>
                    <td className="p-3.5 text-[var(--color-text-ash)]">{post.category}</td>
                    <td className="p-3.5">
                      <PixelBadge
                        variant={post.status === "published" ? "gold" : "default"}
                        size="sm"
                      >
                        {post.status}
                      </PixelBadge>
                    </td>
                    <td className="p-3.5 hidden md:table-cell">
                      {post.featured ? (
                        <span className="text-[var(--color-accent-gold)] font-pixel text-xs">★ Yes</span>
                      ) : (
                        <span className="text-[var(--color-text-ash)]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                      {post.status === "published" && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-transparent border border-[var(--color-border-gothic)] text-[var(--color-text-ash)] hover:border-[var(--color-border-subtle)] hover:text-[var(--color-text-bone)] font-pixel text-[10px] uppercase tracking-wider pixel-focus inline-block"
                          aria-label={`View ${post.title} on public site`}
                        >
                          View ↗
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="px-2.5 py-1 bg-[#100D16] border border-[var(--color-border-subtle)] text-[var(--color-accent-gold)] hover:border-[var(--color-accent-gold)] font-pixel text-[11px] uppercase tracking-wider pixel-focus inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(post)}
                        className="px-2.5 py-1 bg-[#1A0A0E] border border-[var(--color-accent-blood)] text-[#E05368] hover:bg-[var(--color-accent-blood)] hover:text-[var(--color-text-bone)] font-pixel text-[10px] uppercase tracking-wider pixel-focus cursor-pointer"
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PixelCard>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Purge Manuscript"
        message={`Permanently purge "${deleteTarget?.title}" from the Codex? This action cannot be undone and will remove the post from the public site immediately.`}
        confirmLabel={deleting ? "Purging..." : "Purge"}
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
