import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/auth-server";
import { sanitizeImageUrl } from "@/lib/url-validation";

// Valid IANA timezone check: Intl.supportedValuesOf is available in Node 18+.
// Falls back to permissive accept if the runtime doesn't expose it.
function isValidTimezone(tz: string): boolean {
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      return (Intl.supportedValuesOf("timeZone") as string[]).includes(tz);
    }
    // Fallback: attempt to construct a formatter — throws for invalid zones.
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst();
  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, title, bio, location, status, photoUrl, specialty, discipline, timezone } = body;

    if (!name || !title || !bio) {
      return NextResponse.json(
        { error: "Name, title, and bio are required fields." },
        { status: 400 }
      );
    }

    // Validate photoUrl — only http/https (or null/empty to clear)
    let safePhotoUrl: string | null;
    try {
      safePhotoUrl = sanitizeImageUrl(photoUrl, "Photo URL");
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 400 }
      );
    }

    // Validate timezone — must be a known IANA identifier if provided
    const tzValue = String(timezone || "").trim();
    if (tzValue && !isValidTimezone(tzValue)) {
      return NextResponse.json(
        { error: `"${tzValue}" is not a valid IANA timezone identifier.` },
        { status: 400 }
      );
    }

    const profileData = {
      name: String(name).trim().slice(0, 100),
      title: String(title).trim().slice(0, 150),
      bio: String(bio).trim().slice(0, 2000),
      location: String(location || "").trim().slice(0, 150),
      status: String(status || "").trim().slice(0, 150),
      photoUrl: safePhotoUrl,
      specialty: String(specialty || "").trim().slice(0, 100) || null,
      discipline: String(discipline || "").trim().slice(0, 100) || null,
      timezone: tzValue || null,
    };

    const updated = await prisma.profile.upsert({
      where: { id: "default-profile" },
      update: profileData,
      create: { id: "default-profile", ...profileData },
    });

    revalidatePath("/");
    return NextResponse.json({ success: true, profile: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile record." },
      { status: 500 }
    );
  }
}
