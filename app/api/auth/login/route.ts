import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createAdminSession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  deriveRateLimitKey,
} from "@/lib/auth-server";

export async function POST(req: NextRequest) {
  try {
    // Derive a stable rate-limit key. See deriveRateLimitKey for the strategy.
    const ipKey = deriveRateLimitKey(
      req.headers.get("x-forwarded-for"),
      req.headers.get("x-real-ip")
    );

    // 1. Rate Limiting Check
    const rateLimit = await checkRateLimit(ipKey, "login", 5, 15);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed warding attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds || 900),
          },
        }
      );
    }

    // 2. Parse & Validate Input
    const body = await req.json();
    const { email, password } = body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid credentials provided." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 3. User Lookup
    const user = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      await recordFailedAttempt(ipKey, "login");
      return NextResponse.json(
        { error: "Invalid email or master cipher." },
        { status: 401 }
      );
    }

    // 4. Verify Password Hash
    const isValid = verifyPassword(password, user.passwordHash);

    if (!isValid) {
      await recordFailedAttempt(ipKey, "login");
      return NextResponse.json(
        { error: "Invalid email or master cipher." },
        { status: 401 }
      );
    }

    // 5. Success: Reset Rate Limit & Establish Fresh Session
    await resetRateLimit(ipKey, "login");
    await createAdminSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Ward lifted. Entering Sanctum.",
      redirect: "/admin",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal sanctuary authentication failure." },
      { status: 500 }
    );
  }
}
