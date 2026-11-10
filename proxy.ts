import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "obsidian_admin_session";

// Routes that are exempt from the cookie check (pages you need to reach without
// a session in order to get one).
const AUTH_EXEMPT = new Set([
  "/admin/login",
  "/admin/setup",
  "/admin/register",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  // ── 1. Admin host enforcement (production only) ──────────────────────────
  //
  // In production, admin pages and admin/auth API routes are only served when
  // the request arrives on the designated admin hostname (ADMIN_HOST). Requests
  // for those paths on any other hostname get a non-revealing 404.
  //
  // ADMIN_HOST is server-side configuration only. We read it from process.env
  // (never NEXT_PUBLIC_*) and compare against the request Host (nextUrl.hostname),
  // not an arbitrary client-supplied header such as x-forwarded-host.
  const adminHost = process.env.ADMIN_HOST;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && adminHost) {
    const isAdminPath =
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      pathname.startsWith("/api/admin/") ||
      pathname.startsWith("/api/auth/");

    if (isAdminPath && hostname !== adminHost) {
      return new NextResponse(null, { status: 404 });
    }
  }

  // ── 2. Cookie fast-path for admin pages ───────────────────────────────────
  //
  // Admin pages (not auth-exempt) require the session cookie to be present. If
  // it is absent, redirect to /admin/login immediately. Full session validation
  // still happens inside each server component and API route handler.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!AUTH_EXEMPT.has(pathname) && !request.cookies.has(SESSION_COOKIE_NAME)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 3. Published-post guard (preserved from original proxy) ───────────────
  if (pathname.startsWith("/posts/")) {
    const slug = pathname.slice("/posts/".length);
    if (slug && !slug.includes("/")) {
      let post: { id: string } | null = null;
      try {
        post = await prisma.post.findFirst({
          where: { slug, status: "published" },
          select: { id: true },
        });
      } catch {
        return NextResponse.next();
      }
      if (!post) {
        return NextResponse.rewrite(new URL("/_not-found", request.url), {
          status: 404,
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/:path*",
    "/posts/:path*",
  ],
};