import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { PixelCard, PixelButton, PixelBadge, GothicDivider } from "@/components/ui";

export const instant = false;

export default async function AdminDashboardPage() {
  const user = await validateAdminSession();
  if (!user) {
    redirect("/admin/login");
  }

  const [
    postsCount,
    publishedCount,
    draftCount,
    featuredCount,
    skillsCount,
    contactsCount,
    profile,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.count({ where: { featured: true } }),
    prisma.skill.count(),
    prisma.contactLink.count(),
    prisma.profile.findFirst({
      select: { name: true, title: true, bio: true, photoUrl: true },
    }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        featured: true,
        glyph: true,
        updatedAt: true,
      },
    }),
  ]);

  // Simple profile completeness check
  const profileFields = [
    !!profile?.name,
    !!profile?.title,
    !!profile?.bio,
    !!profile?.photoUrl,
  ];
  const profileComplete = profileFields.filter(Boolean).length;
  const profilePct = Math.round((profileComplete / profileFields.length) * 100);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wider">
            Sanctum Overview
          </h1>
          <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
            Welcome back
            {profile?.name ? `, ${profile.name}` : ""} — manage the Obsidian Codex.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-pixel uppercase select-none pixel-press pixel-focus text-xs px-3 py-1.5 tracking-wide min-h-[36px] bg-transparent text-[var(--color-text-bone)] border-2 border-[var(--color-border-gothic)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-obsidian)] hover:text-[var(--color-accent-gold)] pixel-shadow-sm"
          >
            Public Site ↗
          </a>
          <PixelButton href="/admin/posts/new" variant="primary" size="sm">
            + New Post
          </PixelButton>
        </div>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PixelCard variant="default" className="p-4 text-center">
          <div className="font-mono text-xs text-[var(--color-text-ash)] uppercase tracking-wider">
            Total Posts
          </div>
          <div className="font-pixel text-3xl text-[var(--color-text-bone)] my-2">
            {postsCount}
          </div>
          <div className="font-mono text-[11px] text-[var(--color-accent-gold)]">
            {publishedCount} pub · {draftCount} draft
          </div>
        </PixelCard>

        <PixelCard variant="default" className="p-4 text-center">
          <div className="font-mono text-xs text-[var(--color-text-ash)] uppercase tracking-wider">
            Featured
          </div>
          <div className="font-pixel text-3xl text-[var(--color-accent-gold)] my-2">
            {featuredCount}
          </div>
          <div className="font-mono text-[11px] text-[var(--color-text-ash)]">
            on homepage
          </div>
        </PixelCard>

        <PixelCard variant="default" className="p-4 text-center">
          <div className="font-mono text-xs text-[var(--color-text-ash)] uppercase tracking-wider">
            Skills
          </div>
          <div className="font-pixel text-3xl text-[var(--color-text-bone)] my-2">
            {skillsCount}
          </div>
          <div className="font-mono text-[11px] text-[var(--color-text-ash)]">
            disciplines
          </div>
        </PixelCard>

        <PixelCard variant="default" className="p-4 text-center">
          <div className="font-mono text-xs text-[var(--color-text-ash)] uppercase tracking-wider">
            Contacts
          </div>
          <div className="font-pixel text-3xl text-[var(--color-text-bone)] my-2">
            {contactsCount}
          </div>
          <div className="font-mono text-[11px] text-[var(--color-text-ash)]">
            channels
          </div>
        </PixelCard>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/posts/new", label: "+ New Post", variant: "primary" as const },
          { href: "/admin/posts", label: "All Posts", variant: "secondary" as const },
          { href: "/admin/profile", label: "Edit Profile", variant: "secondary" as const },
          { href: "/admin/skills", label: "Skills", variant: "secondary" as const },
        ].map((item) => (
          <PixelButton
            key={item.href}
            href={item.href}
            variant={item.variant}
            size="sm"
            className="w-full justify-center"
          >
            {item.label}
          </PixelButton>
        ))}
      </div>

      {/* ── Profile Completeness ── */}
      {profilePct < 100 && (
        <PixelCard variant="blood" className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-pixel text-xs text-[var(--color-text-bone)] uppercase tracking-wide">
                Profile Incomplete — {profilePct}%
              </p>
              <p className="font-mono text-[11px] text-[var(--color-text-ash)] mt-1">
                {!profile?.name && "Name · "}
                {!profile?.title && "Title · "}
                {!profile?.bio && "Bio · "}
                {!profile?.photoUrl && "Photo · "}
                still missing.
              </p>
            </div>
            <Link
              href="/admin/profile"
              className="shrink-0 px-3 py-1.5 bg-[var(--color-accent-blood)] text-[var(--color-text-bone)] border-2 border-[#B8283D] border-b-[#52111A] border-r-[#52111A] hover:bg-[var(--color-accent-blood-bright)] font-pixel text-xs uppercase tracking-wide pixel-shadow pixel-press pixel-focus inline-flex items-center"
            >
              Complete Profile
            </Link>
          </div>
        </PixelCard>
      )}

      <GothicDivider label="Recent Posts" variant="simple" />

      {/* ── Recent Posts Table ── */}
      <PixelCard variant="elevated" cornerStuds className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border-gothic)] flex items-center justify-between">
          <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-bone)] uppercase tracking-wide">
            Recently Modified
          </h2>
          <Link
            href="/admin/posts"
            className="font-pixel text-xs text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] uppercase tracking-wider pixel-focus"
          >
            View All ({postsCount}) ↗
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="font-mono text-xs text-[var(--color-text-ash)]">
              No manuscripts in the Codex yet.
            </p>
            <PixelButton href="/admin/posts/new" variant="primary" size="sm">
              Forge the First Manuscript
            </PixelButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#120E18] border-b border-[var(--color-border-gothic)] text-[var(--color-text-ash)] uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5 hidden sm:table-cell">Category</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 hidden md:table-cell">Updated</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-gothic)]">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#181324]">
                    <td className="p-3.5 font-medium text-[var(--color-text-bone)]">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{post.glyph}</span>
                        <span className="truncate max-w-[180px]">{post.title}</span>
                        {post.featured && (
                          <span className="text-[var(--color-accent-gold)] shrink-0" aria-label="Featured">★</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-[var(--color-text-ash)] hidden sm:table-cell">
                      {post.category}
                    </td>
                    <td className="p-3.5">
                      <PixelBadge
                        variant={post.status === "published" ? "gold" : "default"}
                        size="sm"
                      >
                        {post.status}
                      </PixelBadge>
                    </td>
                    <td className="p-3.5 text-[var(--color-text-ash)] hidden md:table-cell">
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                      {post.status === "published" && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-transparent border border-[var(--color-border-gothic)] text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] hover:border-[var(--color-border-subtle)] font-pixel text-[10px] uppercase tracking-wider pixel-focus inline-block"
                          aria-label={`View ${post.title}`}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PixelCard>
    </div>
  );
}
