import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { sanitizeExternalUrl, sanitizeImageUrl } from "@/lib/url-validation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Manuscript not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      summary,
      content,
      category,
      thumbnailUrl,
      images,
      tags,
      role,
      tools,
      externalLink,
      githubLink,
      status,
      featured,
      glyph,
      imageRatio,
    } = body;

    // Validate external URLs — only http/https allowed
    // Only validate fields that are explicitly present in the request body.
    let safeExternalLink: string | null | undefined = undefined;
    let safeGithubLink: string | null | undefined = undefined;
    let safeThumbnailUrl: string | null | undefined = undefined;

    try {
      if (externalLink !== undefined) {
        safeExternalLink = sanitizeExternalUrl(externalLink, "External link");
      }
      if (githubLink !== undefined) {
        safeGithubLink = sanitizeExternalUrl(githubLink, "GitHub link");
      }
      if (thumbnailUrl !== undefined) {
        safeThumbnailUrl = sanitizeImageUrl(thumbnailUrl, "Thumbnail URL");
      }
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      );
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title: String(title).trim().slice(0, 200) }),
        ...(slug && { slug: String(slug).trim().slice(0, 200) }),
        ...(summary && { summary: String(summary).trim().slice(0, 1000) }),
        ...(content !== undefined && {
          content: String(content).trim().slice(0, 20000),
        }),
        ...(category && (() => {
          const catName = String(category).trim().slice(0, 100);
          return { category: catName };
        })()),
        ...(safeThumbnailUrl !== undefined && { thumbnailUrl: safeThumbnailUrl }),
        ...(images !== undefined && {
          images: Array.isArray(images) ? JSON.stringify(images) : "[]",
        }),
        ...(tags !== undefined && {
          tags: Array.isArray(tags) ? JSON.stringify(tags) : "[]",
        }),
        ...(role !== undefined && { role: String(role).trim().slice(0, 100) }),
        ...(tools !== undefined && {
          tools: Array.isArray(tools) ? JSON.stringify(tools) : "[]",
        }),
        ...(safeExternalLink !== undefined && { externalLink: safeExternalLink }),
        ...(safeGithubLink !== undefined && { githubLink: safeGithubLink }),
        ...(status && { status: status === "draft" ? "draft" : "published" }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(glyph && { glyph: String(glyph).trim().slice(0, 10) }),
        ...(imageRatio && ["video","portrait","square","auto"].includes(imageRatio) && { imageRatio }),
      },
    });

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${updated.slug}`);
    return NextResponse.json({ success: true, post: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update manuscript." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.post.delete({ where: { id } });

    // Invalidate cached public pages so deleted posts disappear immediately.
    revalidatePath("/");
    revalidatePath("/posts");
    if (existing?.slug) {
      revalidatePath(`/posts/${existing.slug}`);
    }

    return NextResponse.json({ success: true, message: "Manuscript purged." });
  } catch {
    return NextResponse.json(
      { error: "Failed to purge manuscript." },
      { status: 500 }
    );
  }
}
