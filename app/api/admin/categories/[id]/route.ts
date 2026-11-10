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
    const { name, description } = body;

    const updateData: Record<string, string> = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim().slice(0, 100);
      if (!trimmedName) {
        return NextResponse.json(
          { error: "Category name cannot be empty." },
          { status: 400 }
        );
      }

      // Duplicate name check (exclude self) — SQLite has no insensitive mode
      const allCategories = await prisma.category.findMany();
      const conflict = allCategories.find(
        (c) =>
          c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (conflict) {
        return NextResponse.json(
          { error: `A category named "${conflict.name}" already exists.` },
          { status: 409 }
        );
      }

      const newSlug = slugify(trimmedName);
      const slugConflict = await prisma.category.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: `Slug "${newSlug}" is already in use.` },
          { status: 409 }
        );
      }

      updateData.name = trimmedName;
      updateData.slug = newSlug;
    }

    if (description !== undefined) {
      updateData.description = String(description).trim().slice(0, 500);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update category." },
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
    // Null out the FK on posts that reference this category
    await prisma.post.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}
