import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";

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
    const { name, category, iconKey, iconUrl, description, order, showOnHomepage } = body;

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name: String(name).trim().slice(0, 50) }),
        ...(category && { category: String(category).trim().slice(0, 50) }),
        ...(iconKey && { iconKey: String(iconKey).trim().slice(0, 100) }),
        // Allow explicit null to clear a custom icon
        ...(iconUrl !== undefined && {
          iconUrl: iconUrl ? String(iconUrl).trim().slice(0, 500) : null,
        }),
        ...(description !== undefined && {
          description: String(description).trim().slice(0, 500),
        }),
        ...(order !== undefined && { order: Number(order) }),
        ...(showOnHomepage !== undefined && {
          showOnHomepage: Boolean(showOnHomepage),
        }),
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, skill: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update skill." },
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
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Skill banished." });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove skill." },
      { status: 500 }
    );
  }
}
