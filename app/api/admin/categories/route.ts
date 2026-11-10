import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";

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

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim().slice(0, 100);
    const generatedSlug = slugify(trimmedName);

    if (!generatedSlug) {
      return NextResponse.json(
        { error: "Category name produced an empty slug. Use alphanumeric characters." },
        { status: 400 }
      );
    }

    // Case-insensitive duplicate check (SQLite has no insensitive mode)
    const allCategories = await prisma.category.findMany();
    const existing = allCategories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: `A category named "${existing.name}" already exists.` },
        { status: 409 }
      );
    }

    const slugConflict = await prisma.category.findUnique({
      where: { slug: generatedSlug },
    });
    if (slugConflict) {
      return NextResponse.json(
        { error: `Slug "${generatedSlug}" is already in use.` },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: generatedSlug,
        description: String(description || "").trim().slice(0, 500),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 }
    );
  }
}
