import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { PostsArchiveView } from "@/components/posts/PostsArchiveView";
import { Post } from "@/lib/data";

export const metadata: Metadata = {
  title: "Arcane Codex · Portfolio Archives",
  description:
    "Complete portfolio archive of software engineering projects, pixel art asset packs, and design systems.",
};

export const instant = false;

export default async function PostsPage() {
  const dbProfile = await prisma.profile.findFirst().catch(() => null);
  const dbPosts = await prisma.post
    .findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const posts: Post[] | undefined =
    dbPosts && dbPosts.length > 0
      ? dbPosts.map((p) => {
          let tags: string[] = [];
          let tools: string[] = [];
          try {
            tags = JSON.parse(p.tags);
          } catch {
            tags = [];
          }
          try {
            tools = JSON.parse(p.tools);
          } catch {
            tools = [];
          }

          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            summary: p.summary,
            category: p.category as Post["category"],
            date: p.createdAt.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            tags,
            role: p.role,
            tools,
            featured: p.featured,
            glyph: p.glyph,
            externalLink: p.externalLink || undefined,
            githubLink: p.githubLink || undefined,
            thumbnailUrl: p.thumbnailUrl || undefined,
          };
        })
      : undefined;

  return (
    <>
      <Navbar profileName={dbProfile?.name} />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full py-8">
        <PostsArchiveView initialPosts={posts} />
      </main>
    </>
  );
}
