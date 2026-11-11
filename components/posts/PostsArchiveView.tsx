"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PixelCard, PixelFrame, PixelBadge, PixelButton, GothicDivider } from "@/components/ui";
import { Post } from "@/lib/data";
import { PixelExternalIcon } from "@/components/icons";
import { ToolIconStrip } from "@/components/shared/ToolIconStrip";

interface ArchiveCategory {
  id: string;
  name: string;
  slug: string;
}

interface PostsArchiveViewProps {
  initialPosts?: Post[];
  categories?: ArchiveCategory[];
}

export const PostsArchiveView: React.FC<PostsArchiveViewProps> = ({
  initialPosts = [],
  categories = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Build the filter list dynamically: "All" + CMS-managed categories
  const categoryFilters: string[] = ["All", ...categories.map((c) => c.name)];

  const filteredPosts: Post[] =
    selectedCategory === "All"
      ? initialPosts
      : initialPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Header and Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/#posts"
          className="inline-flex items-center gap-1.5 min-h-[44px] font-pixel text-xs text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] uppercase tracking-wider mb-3 pixel-focus"
        >
          <span>‹</span>
          <span>Return to Sanctum</span>
        </Link>
        <h1 className="font-pixel text-2xl sm:text-3xl text-[var(--color-text-bone)] uppercase tracking-wide">
          Complete Arcane Codex
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] mt-1 max-w-xl">
          A catalogue of engineering repositories, pixel art asset suites, design systems, and interactive experiments.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 pb-1">
        {categoryFilters.map((category) => {
          const isSelected = selectedCategory === category;
          const count =
            category === "All"
              ? initialPosts.length
              : initialPosts.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[44px] px-3 py-1.5 font-pixel text-xs uppercase tracking-wider transition-none pixel-focus pixel-press cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-[var(--color-accent-blood)] text-[var(--color-text-bone)] border-2 border-[#B8283D] pixel-shadow-sm"
                  : "bg-[var(--color-surface-obsidian)] text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] border border-[var(--color-border-gothic)] hover:border-[var(--color-accent-gold)]"
              }`}
            >
              <span>{category}</span>
              <span className="font-mono text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Posts Grid */}
      {initialPosts.length === 0 ? (
        /* Global empty state — no posts exist at all */
        <PixelCard variant="elevated" cornerStuds className="text-center py-16 px-6">
          <div className="font-pixel text-2xl text-[var(--color-accent-gold)] mb-3">✦</div>
          <h2 className="font-pixel text-base text-[var(--color-text-bone)] uppercase tracking-wider mb-2">
            The Codex Awaits Its First Entry
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] max-w-md mx-auto">
            No manuscripts have been inscribed yet. Create your first post from the admin dashboard to populate this archive.
          </p>
        </PixelCard>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PixelCard
              key={post.id}
              variant="default"
              cornerStuds
              interactive
              as="article"
              className="flex flex-col h-full group"
            >
              {/* Thumbnail */}
              <PixelFrame
                variant="stone"
                aspectRatio="video"
                className="w-full mb-4 bg-[#0E0B14]"
              >
                {post.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-full object-cover pixelated"
                  />
                ) : (
                  <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center select-none group-hover:scale-105 transition-none">
                    <span className="text-3xl mb-1">{post.glyph}</span>
                    <span className="font-mono text-[10px] text-[var(--color-accent-gold)] tracking-widest uppercase">
                      {post.category}
                    </span>
                  </div>
                )}
              </PixelFrame>

              {/* Badges */}
              <div className="flex items-center justify-between mb-2">
                <PixelBadge variant="gold" size="sm">
                  {post.category}
                </PixelBadge>
                <span className="font-mono text-[11px] text-[var(--color-text-ash)]">
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-pixel text-sm sm:text-base text-[var(--color-text-bone)] uppercase group-hover:text-[var(--color-accent-gold)] tracking-wide mb-2">
                <Link href={`/posts/${post.slug}`} className="pixel-focus">
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] leading-relaxed mb-4 flex-1">
                {post.summary}
              </p>

              {/* Metadata: Role & Tools */}
              <div className="mb-4 py-2 border-y border-[var(--color-border-gothic)] text-xs font-mono space-y-1.5">
                <div className="text-[var(--color-text-bone)]">
                  <span className="text-[var(--color-accent-gold)] mr-1">Role:</span>
                  {post.role}
                </div>
                {post.tools && post.tools.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[var(--color-accent-gold)] mr-0.5 shrink-0">Forged:</span>
                    <ToolIconStrip tools={post.tools} size={16} maxVisible={5} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-[#100D16] border border-[var(--color-border-subtle)] text-[10px] font-mono text-[var(--color-text-ash)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* External Links */}
              <div className="pt-3 border-t border-[var(--color-border-gothic)] flex items-center justify-between mt-auto">
                <Link
                  href={`/posts/${post.slug}`}
                  className="font-pixel text-[11px] text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] flex items-center gap-1 uppercase tracking-wider pixel-focus"
                >
                  <span>Read Lore</span>
                  <PixelExternalIcon size={12} />
                </Link>

                {post.externalLink && (
                  <a
                    href={post.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[var(--color-text-ash)] hover:text-[var(--color-text-bone)] pixel-focus"
                  >
                    Demo ↗
                  </a>
                )}
              </div>
            </PixelCard>
          ))}
        </div>
      ) : (
        /* Empty State */
        <PixelCard variant="elevated" cornerStuds className="text-center py-12 px-6">
          <div className="font-pixel text-2xl text-[var(--color-accent-gold)] mb-2">✦</div>
          <h2 className="font-pixel text-base text-[var(--color-text-bone)] uppercase tracking-wider mb-2">
            No Relics Discovered
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] max-w-md mx-auto mb-6">
            No chronicles match the selected discipline filter. Try selecting another archive.
          </p>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            Clear Archive Filter
          </PixelButton>
        </PixelCard>
      )}

      <GothicDivider label="End of Catalogue" variant="skull" />
    </div>
  );
};
