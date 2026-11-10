import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { sanitizeExternalUrl } from "@/lib/url-validation";

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
    const { platform, label, url, iconKey, order } = body;

    // Validate URL if it is being updated
    let safeUrl: string | null | undefined = undefined;
    if (url !== undefined) {
      try {
        safeUrl = sanitizeExternalUrl(url, "Contact URL");
      } catch (err) {
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 400 }
        );
      }

      // url is a required field on ContactLink — reject explicit null/empty
      if (!safeUrl) {
        return NextResponse.json(
          { error: "A valid HTTP or HTTPS URL is required for the contact link." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.contactLink.update({
      where: { id },
      data: {
        ...(platform && { platform: String(platform).trim().slice(0, 50) }),
        ...(label && { label: String(label).trim().slice(0, 100) }),
        ...(safeUrl !== undefined && { url: safeUrl }),
        ...(iconKey && { iconKey: String(iconKey).trim().slice(0, 50) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({ success: true, contact: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update contact conduit." },
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
    await prisma.contactLink.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Conduit severed." });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete contact link." },
      { status: 500 }
    );
  }
}
