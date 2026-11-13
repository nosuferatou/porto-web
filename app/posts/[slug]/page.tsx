import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { PixelCard, PixelFrame, PixelBadge, PixelButton, GothicDivider } from "@/components/ui";
import { PixelExternalIcon } from "@/components/icons";
import { ToolList } from "@/components/shared/ToolList";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "published" },
  });

  if (!post) {
    notFound();
  }

  return {
    title: `${post.title} · Arcane Codex`,
    description: post.summary,
  };
}

export const instant = false;

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;
  const dbProfile = await prisma.profile.findFirst().catch(() => null);
  const post = await prisma.post.findFirst({
    where: { slug, status: "published" },
  });

  if (!post) {
    notFound();
  }

  let tags: string[] = [];
  let tools: string[] = [];

  try {
    tags = JSON.parse(post.tags);
  } catch {
    tags = [];
  }

  try {
    tools = JSON.parse(post.tools);
  } catch {
    tools = [];
  }

  return (
    <>
      <Navbar profileName={dbProfile?.name} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 w-full py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 min-h-[44px] font-pixel text-xs text-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold-bright)] pixel-hover uppercase tracking-wider pixel-focus"
          >
            <span>‹</span>
            <span>Return to Arcane Codex</span>
          </Link>
        </div>

        {/* Post Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <PixelBadge variant="gold" size="md">
              {post.category}
            </PixelBadge>
            {post.featured && (
              <PixelBadge variant="blood" size="md">
                Featured Relic
              </PixelBadge>
            )}
            <span className="font-mono text-xs text-[var(--color-text-ash)] ml-auto">
              Inscribed {post.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>

          <h1 className="font-pixel text-2xl sm:text-4xl text-[var(--color-text-bone)] uppercase tracking-wide leading-tight">
            {post.title}
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--color-text-ash)] leading-relaxed">
            {post.summary}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--color-surface-obsidian)] border border-[var(--color-border-gothic)] font-mono text-xs">
            <div>
              <span className="block text-[var(--color-accent-gold)] uppercase text-[10px] tracking-widest mb-0.5">
                Archivist Role
              </span>
              <span className="text-[var(--color-text-bone)]">{post.role || "Architect"}</span>
            </div>

            <div>
              <span className="block text-[var(--color-accent-gold)] uppercase text-[10px] tracking-widest mb-1.5">
                Forged With
              </span>
              {tools.length > 0 ? (
                <ToolList tools={tools} size={16} />
              ) : (
                <span className="text-[var(--color-text-ash)]">TypeScript</span>
              )}
            </div>
          </div>
        </header>

        {/* Visual Banner */}
        <PixelFrame variant="stone" aspectRatio="auto" className="w-full">
          {post.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="block h-auto w-full pixelated"
            />
          ) : (
            <div className="w-full h-full min-h-[280px] bg-[var(--color-post-thumbnail)] flex flex-col items-center justify-center p-8 text-center select-none">
              <span className="text-5xl mb-2">{post.glyph}</span>
              <span className="font-pixel text-sm text-[var(--color-accent-gold)] uppercase tracking-widest">
                {post.title}
              </span>
            </div>
          )}
        </PixelFrame>

        {/* Content Body */}
        <PixelCard variant="default" className="p-6 sm:p-8">
          <div className="prose prose-invert max-w-none text-sm sm:text-base font-sans text-[var(--color-text-bone)] leading-relaxed space-y-4">
            {post.content ? (
              post.content.split("\n\n").map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="font-pixel text-base sm:text-lg text-[var(--color-accent-gold)] uppercase tracking-wide mt-6 mb-2"
                    >
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("### ")) {
                  return (
                    <h3
                      key={i}
                      className="font-pixel text-sm sm:text-base text-[var(--color-text-bone)] uppercase tracking-wide mt-4 mb-1"
                    >
                      {para.replace("### ", "")}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="text-[var(--color-text-bone)]">
                    {para}
                  </p>
                );
              })
            ) : (
              <p className="text-[var(--color-text-ash)] italic font-mono text-xs">
                The pages of this manuscript await further lore and commentary.
              </p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-[var(--color-border-gothic)] flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[var(--color-tag-surface)] border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-ash)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </PixelCard>

        {/* External Links Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[var(--color-surface-obsidian)] border-2 border-[var(--color-border-gothic)] pixel-shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {post.externalLink && (
              <PixelButton
                href={post.externalLink}
                variant="primary"
                size="sm"
                className="gap-2"
              >
                <span>Live Demonstration</span>
                <PixelExternalIcon size={12} />
              </PixelButton>
            )}

            {post.githubLink && (
              <PixelButton
                href={post.githubLink}
                variant="secondary"
                size="sm"
              >
                Inspect Repository ↗
              </PixelButton>
            )}
          </div>

          <PixelButton href="/posts" variant="ghost" size="sm" className="sm:ml-auto">
            ‹ All Manuscripts
          </PixelButton>
        </div>

        <GothicDivider label="End of Manuscript" variant="runic" />
      </main>
    </>
  );
}
