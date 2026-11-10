import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { sanitizeExternalUrl } from "@/lib/url-validation";

export async function GET() {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contactLink.findMany({
    where: {
      // Direct Channel is managed separately via /api/admin/direct-channel
      NOT: { platform: "Direct Channel" },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { platform, label, url, iconKey, order } = body;

    if (!platform || !label || !url) {
      return NextResponse.json(
        { error: "Platform, label, and URL are required." },
        { status: 400 }
      );
    }

    // "Direct Channel" is reserved — managed via /api/admin/direct-channel
    if (String(platform).trim().toLowerCase() === "direct channel") {
      return NextResponse.json(
        { error: "Direct Channel is managed separately. Use the Direct Channel section." },
        { status: 400 }
      );
    }

    // Validate URL — only http/https allowed
    let safeUrl: string | null;
    try {
      safeUrl = sanitizeExternalUrl(url, "Contact URL");
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      );
    }

    if (!safeUrl) {
      return NextResponse.json(
        { error: "A valid HTTP or HTTPS URL is required for the contact link." },
        { status: 400 }
      );
    }

    const newContact = await prisma.contactLink.create({
      data: {
        platform: String(platform).trim().slice(0, 50),
        label: String(label).trim().slice(0, 100),
        url: safeUrl,
        iconKey: String(iconKey || "github").trim().slice(0, 50),
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({ success: true, contact: newContact });
  } catch {
    return NextResponse.json(
      { error: "Failed to establish contact conduit." },
      { status: 500 }
    );
  }
}
