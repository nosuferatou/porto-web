import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { sanitizeExternalUrl, sanitizeImageUrl } from "@/lib/url-validation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    } = body;

    if (!title || !summary || !category) {
      return NextResponse.json(
        { error: "Title, summary, and category are required." },
        { status: 400 }
      );
    }

    // Validate external URLs — only http/https allowed
    let safeExternalLink: string | null;
    let safeGithubLink: string | null;
    let safeThumbnailUrl: string | null;

    try {
      safeExternalLink = sanitizeExternalUrl(externalLink, "External link");
      safeGithubLink = sanitizeExternalUrl(githubLink, "GitHub link");
      safeThumbnailUrl = sanitizeImageUrl(thumbnailUrl, "Thumbnail URL");
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      );
    }

    const generatedSlug = (slug && String(slug).trim()) || slugify(title);

    // Verify unique slug
    const existing = await prisma.post.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `The manuscript slug "${generatedSlug}" is already in use.` },
        { status: 409 }
      );
    }

    // Resolve categoryId from the category name when not explicitly provided
    let resolvedCategoryId: string | undefined = undefined;
    const categoryName = String(category).trim().slice(0, 100);
    const allCats = await prisma.category.findMany({ select: { id: true, name: true } });
    const catRecord = allCats.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (catRecord) resolvedCategoryId = catRecord.id;

    const newPost = await prisma.post.create({
      data: {
        title: String(title).trim().slice(0, 200),
        slug: generatedSlug.slice(0, 200),
        summary: String(summary).trim().slice(0, 1000),
        content: String(content || "").trim().slice(0, 20000),
        category: categoryName,
        ...(resolvedCategoryId && { categoryId: resolvedCategoryId }),
        thumbnailUrl: safeThumbnailUrl,
        images: Array.isArray(images) ? JSON.stringify(images) : "[]",
        tags: Array.isArray(tags) ? JSON.stringify(tags) : "[]",
        role: String(role || "").trim().slice(0, 100),
        tools: Array.isArray(tools) ? JSON.stringify(tools) : "[]",
        externalLink: safeExternalLink,
        githubLink: safeGithubLink,
        status: status === "draft" ? "draft" : "published",
        featured: Boolean(featured),
        glyph: String(glyph || "⚔️").trim().slice(0, 10),
      },
    });

    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath(`/posts/${newPost.slug}`);
    return NextResponse.json({ success: true, post: newPost });
  } catch {
    return NextResponse.json(
      { error: "Failed to forge manuscript." },
      { status: 500 }
    );
  }
}
