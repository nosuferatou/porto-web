import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createAdminSession } from "@/lib/auth-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password must be at least 12 characters and include lowercase, uppercase, digit, and symbol.
function isStrongPassword(password: string): { ok: boolean; reason?: string } {
  if (password.length < 12) {
    return { ok: false, reason: "Password must be at least 12 characters." };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, reason: "Password must include a lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, reason: "Password must include an uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, reason: "Password must include a number." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { ok: false, reason: "Password must include a special character." };
  }
  return { ok: true };
}

/** Returns true only when the database has no AdminUser rows. */
async function setupAllowed(): Promise<boolean> {
  const count = await prisma.adminUser.count();
  return count === 0;
}

/** GET — lets the setup page check eligibility without exposing setup logic. */
export async function GET() {
  // Setup is a local-development-only affordance. In production the admin
  // account is created via the controlled seed procedure, so this endpoint is
  // closed entirely (non-revealing 404).
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  const allowed = await setupAllowed();
  return NextResponse.json({ setupRequired: allowed });
}

export async function POST(req: NextRequest) {
  // Setup is disabled in production. The admin account must be created through
  // the controlled server-side seed procedure.
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  // Re-check inside the write path to prevent TOCTOU races (concurrent requests
  // both passing the initial check). The unique constraint on AdminUser.email
  // is the final safety net.
  if (!(await setupAllowed())) {
    return NextResponse.json(
      { error: "Initial setup has already been completed." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { email, password, confirmPassword } = body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const strength = isStrongPassword(password);
    if (!strength.ok) {
      return NextResponse.json({ error: strength.reason }, { status: 400 });
    }

    if (typeof confirmPassword === "string" && confirmPassword !== password) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Recheck inside a try — unique constraint catches any concurrent race
    const user = await prisma.adminUser.create({
      data: {
        email: cleanEmail,
        passwordHash: hashPassword(password),
      },
    });

    await createAdminSession(user.id);

    return NextResponse.json(
      { success: true, redirect: "/admin" },
      { status: 201 }
    );
  } catch (err: unknown) {
    // P2002 = Prisma unique-constraint violation (concurrent setup race)
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Initial setup has already been completed." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Setup failed. Please try again." },
      { status: 500 }
    );
  }
}
