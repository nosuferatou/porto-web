import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";

export async function GET() {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ skills });
}

export async function POST(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, category, iconKey, iconUrl, description, order, showOnHomepage } = body;

    if (!name || !category || !iconKey) {
      return NextResponse.json(
        { error: "Name, category, and iconKey are required." },
        { status: 400 }
      );
    }

    const newSkill = await prisma.skill.create({
      data: {
        name: String(name).trim().slice(0, 50),
        category: String(category).trim().slice(0, 50),
        iconKey: String(iconKey).trim().slice(0, 100),
        iconUrl: iconUrl ? String(iconUrl).trim().slice(0, 500) : null,
        description: String(description || "").trim().slice(0, 500),
        order: Number(order) || 0,
        showOnHomepage: showOnHomepage !== false, // default true
      },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, skill: newSkill });
  } catch {
    return NextResponse.json(
      { error: "Failed to forge skill record." },
      { status: 500 }
    );
  }
}
