import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { PostForm, PostFormData } from "@/components/admin/PostForm";

export const instant = false;

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await validateAdminSession();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  let parsedTags: string[] = [];
  let parsedTools: string[] = [];

  try {
    parsedTags = JSON.parse(post.tags);
  } catch {
    parsedTags = [];
  }

  try {
    parsedTools = JSON.parse(post.tools);
  } catch {
    parsedTools = [];
  }

  const formData: PostFormData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    category: post.category,
    thumbnailUrl: post.thumbnailUrl || "",
    tags: parsedTags,
    role: post.role,
    tools: parsedTools,
    externalLink: post.externalLink || "",
    githubLink: post.githubLink || "",
    status: post.status === "draft" ? "draft" : "published",
    featured: post.featured,
    glyph: post.glyph,
  };

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
          Edit Manuscript: {post.title}
        </h1>
        <p className="font-mono text-xs text-[var(--color-text-ash)] mt-1">
          Modify manuscript attributes, thumbnail, or publication status.
        </p>
      </div>

      <PostForm initialData={formData} isEdit={true} />
    </div>
  );
}
