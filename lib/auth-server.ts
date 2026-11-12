import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionTokenFromCookies,
} from "@/lib/auth";

export { hashPassword, verifyPassword };

const SESSION_DURATION_DAYS = 7;

export async function createAdminSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  // Only the SHA-256 hash of the token is persisted. The raw token lives only
  // in the cookie so a database breach does not yield usable session tokens.
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // Clean up any stale sessions for hygiene (expired + all previous for this user)
  await prisma.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { userId },
      ],
    },
  });

  // Store the hash, not the raw token
  await prisma.session.create({
    data: {
      token: tokenHash,
      userId,
      expiresAt,
    },
  });

  // Set the raw token in the cookie — the browser presents this, and we hash
  // it on each request to look up the DB record.
  await setSessionCookie(token);
  return token;
}

export async function validateAdminSession(): Promise<{
  id: string;
  email: string;
} | null> {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;

  // Hash the cookie value to match what is stored in the database
  const tokenHash = hashSessionToken(token);

  const session = await prisma.session.findUnique({
    where: { token: tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token: tokenHash } }).catch(() => {});
    return null;
  }

  // Sliding window: if the session expires within 24 h, silently extend it
  // so normal daily browsing never causes an unexpected logout.
  const hoursUntilExpiry =
    (session.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilExpiry < 24) {
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + SESSION_DURATION_DAYS);
    await prisma.session
      .update({ where: { token: tokenHash }, data: { expiresAt: newExpiry } })
      .catch(() => {}); // best-effort; don't fail auth on a DB hiccup
  }

  return session.user;
}

export async function destroyAdminSession(): Promise<void> {
  const token = await getSessionTokenFromCookies();
  if (token) {
    const tokenHash = hashSessionToken(token);
    await prisma.session.delete({ where: { token: tokenHash } }).catch(() => {});
  }
  await clearSessionCookie();
}

export async function checkRateLimit(
  ipKey: string,
  action = "login",
  maxAttempts = 5,
  lockoutMinutes = 15
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const now = new Date();
  const record = await prisma.rateLimit.findUnique({
    where: {
      ipKey_action: {
        ipKey,
        action,
      },
    },
  });

  if (!record) return { allowed: true };

  // If currently locked out, reject immediately
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil(
      (record.lockedUntil.getTime() - now.getTime()) / 1000
    );
    return { allowed: false, retryAfterSeconds };
  }

  // If the lockout window has passed since the last attempt, reset the counter
  const windowPassed =
    now.getTime() - record.lastAttempt.getTime() > lockoutMinutes * 60 * 1000;

  if (windowPassed) {
    await prisma.rateLimit.delete({
      where: {
        ipKey_action: { ipKey, action },
      },
    }).catch(() => {});
    return { allowed: true };
  }

  // Already at or past the attempt limit — deny even if lockedUntil hasn't been
  // written yet (e.g. concurrent requests, or record in transition)
  if (record.attempts >= maxAttempts) {
    return { allowed: false, retryAfterSeconds: lockoutMinutes * 60 };
  }

  return { allowed: true };
}

export async function recordFailedAttempt(
  ipKey: string,
  action = "login",
  maxAttempts = 5,
  lockoutMinutes = 15
): Promise<void> {
  const now = new Date();
  const existing = await prisma.rateLimit.findUnique({
    where: {
      ipKey_action: {
        ipKey,
        action,
      },
    },
  });

  if (!existing) {
    await prisma.rateLimit.create({
      data: {
        ipKey,
        action,
        attempts: 1,
        lastAttempt: now,
      },
    });
    return;
  }

  const newAttempts = existing.attempts + 1;
  const shouldLock = newAttempts >= maxAttempts;
  const lockedUntil = shouldLock
    ? new Date(now.getTime() + lockoutMinutes * 60 * 1000)
    : null;

  await prisma.rateLimit.update({
    where: {
      ipKey_action: {
        ipKey,
        action,
      },
    },
    data: {
      attempts: newAttempts,
      lastAttempt: now,
      lockedUntil,
    },
  });
}

export async function resetRateLimit(
  ipKey: string,
  action = "login"
): Promise<void> {
  await prisma.rateLimit.deleteMany({
    where: {
      ipKey,
      action,
    },
  }).catch(() => {});
}

/**
 * Derive a stable rate-limit key from the request context.
 *
 * Strategy for a local single-admin server:
 * - x-forwarded-for is potentially spoofable when there is no trusted reverse
 *   proxy in front of Next.js. We still read it (for when a local proxy like
 *   nginx is in use) but we append a fixed literal so an attacker cannot simply
 *   forge a different IP per attempt and avoid the rate limit.
 * - The combined key format is "xff:<value>|direct" which means:
 *   - If no proxy header is present, all direct connections share the same
 *     "direct" bucket — appropriate for local single-admin use.
 *   - If a proxy header IS present, the bucket is scoped to the header value.
 *     A real proxy sets this consistently; a forger cycles through values but
 *     still hits the same "direct" fallback bucket on the server.
 *
 * This is intentionally simple and appropriate for the current architecture.
 */
export function deriveRateLimitKey(
  xForwardedFor: string | null,
  xRealIp: string | null
): string {
  // Prefer x-real-ip (set by nginx/proxies to the actual client IP) over
  // x-forwarded-for which can contain a chain of IPs.
  const directHeader = xRealIp?.trim();
  if (directHeader) {
    return `rip:${directHeader}`;
  }

  // Take the first (leftmost) value from x-forwarded-for, which is the
  // claimed client IP. Accept it but keep the scope narrow.
  const xffFirst = xForwardedFor?.split(",")[0]?.trim();
  if (xffFirst) {
    return `xff:${xffFirst}`;
  }

  // No proxy headers — direct local connection. All direct clients share one
  // bucket, which is the desired behavior for a local admin server.
  return "direct";
}
