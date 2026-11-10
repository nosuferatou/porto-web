import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.contactLink.findFirst({
    where: { platform: "Direct Channel" },
  });

  const email = record?.label || "";
  return NextResponse.json({ email });
}

export async function PUT(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const existing = await prisma.contactLink.findFirst({
      where: { platform: "Direct Channel" },
    });

    if (existing) {
      await prisma.contactLink.update({
        where: { id: existing.id },
        data: { label: email, url: email, iconKey: "email" },
      });
    } else {
      await prisma.contactLink.create({
        data: {
          platform: "Direct Channel",
          label: email,
          url: email,
          iconKey: "email",
          order: 0,
        },
      });
    }

    // Revalidate the public homepage so the new email appears immediately.
    revalidatePath("/");

    return NextResponse.json({ success: true, email });
  } catch {
    return NextResponse.json({ error: "Failed to update direct channel." }, { status: 500 });
  }
}
