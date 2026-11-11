import React from "react";
import Link from "next/link";
import { PixelCard, PixelFrame, PixelBadge, PixelButton } from "@/components/ui";
import { Post } from "@/lib/data";
import { PixelExternalIcon } from "@/components/icons";
import { ToolIconStrip } from "@/components/shared/ToolIconStrip";

interface PostsPreviewSectionProps {
  posts?: Post[];
  totalCount?: number;
}

export const PostsPreviewSection: React.FC<PostsPreviewSectionProps> = ({
  posts,
  totalCount,
}) => {
  // Only show real database posts. Never fall back to mock data.
  const displayPosts = posts && posts.length > 0 ? posts : [];

  const count = totalCount !== undefined ? totalCount : 0;

  return (
    <section
      id="posts"
      aria-label="Portfolio and Works"
      className="w-full scroll-mt-20 pt-4 pb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="text-xs font-mono text-[var(--color-accent-gold)] uppercase tracking-wider mb-1">
            ✦ Relic Archives
          </div>
          <h2 className="font-pixel text-xl sm:text-2xl text-[var(--color-text-bone)] uppercase tracking-wide">
            Featured Works & Quests
          </h2>
        </div>
        <PixelButton href="/posts" variant="secondary" size="sm" className="self-start sm:self-auto">
          View All Relics ({count})
        </PixelButton>
      </div>

      {/* Empty state — no featured posts */}
      {displayPosts.length === 0 && (
        <div className="py-16 text-center border border-dashed border-[var(--color-border-gothic)] bg-[var(--color-surface-obsidian)]">
          <p className="font-pixel text-xs text-[var(--color-accent-gold)] uppercase tracking-widest mb-2">
            ✦ The Archives Await
          </p>
          <p className="font-mono text-xs text-[var(--color-text-ash)]">
            No featured works have been inscribed yet. Mark a published post as featured to display it here.
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {displayPosts.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <PixelCard
            key={post.id}
            variant="default"
            cornerStuds
            interactive
            as="article"
            className="flex flex-col h-full group"
          >
            {/* Thumbnail Frame */}
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

            {/* Header / Badges */}
            <div className="flex items-center justify-between mb-2">
              <PixelBadge variant="gold" size="sm">
                {post.category}
              </PixelBadge>
              <span className="font-mono text-[11px] text-[var(--color-text-ash)]">
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-pixel text-sm sm:text-base text-[var(--color-text-bone)] uppercase group-hover:text-[var(--color-accent-gold)] tracking-wide mb-2 line-clamp-2">
              <Link href={`/posts/${post.slug}`} className="pixel-focus">
                {post.title}
              </Link>
            </h3>

            {/* Excerpt */}
            <p className="font-sans text-xs sm:text-sm text-[var(--color-text-ash)] leading-relaxed mb-4 flex-1 line-clamp-3">
              {post.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--color-border-gothic)] mt-auto">
              {/* Tool icons */}
              {post.tools && post.tools.length > 0 && (
                <ToolIconStrip tools={post.tools} size={16} maxVisible={5} className="mb-1.5 w-full" />
              )}
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-[#100D16] border border-[var(--color-border-subtle)] text-[10px] font-mono text-[var(--color-text-ash)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border-gothic)] flex items-center justify-between">
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
                  aria-label={`Live demo for ${post.title}`}
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          </PixelCard>
        ))}
      </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <PixelButton href="/posts" variant="primary" size="lg">
          Explore Complete Codex ({count} Projects)
        </PixelButton>
      </div>
    </section>
  );
};
