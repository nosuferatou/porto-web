import type { NextConfig } from "next";

/**
 * Security headers applied to all responses.
 *
 * Design goals:
 * - Block obvious attacks (XSS via framing/MIME sniffing, clickjacking).
 * - Avoid breaking the existing UI (Tailwind inline styles, Next.js hydration
 *   scripts, local uploaded images, external https thumbnail/photo URLs).
 * - Keep the policy maintainable — no per-request nonce machinery.
 */
const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * Exact Supabase Storage origin used for direct browser uploads.
 *
 * Derived from the existing SUPABASE_URL so the CSP does not need a broad
 * `*.supabase.co` wildcard. If the variable is unavailable at build time the
 * policy stays locked to 'self' (uploads then fail closed rather than
 * silently allowing an unknown origin).
 */
function getSupabaseOrigin(): string | null {
  const raw = process.env.SUPABASE_URL;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

const supabaseOrigin = getSupabaseOrigin();
const connectSrc = supabaseOrigin ? `'self' ${supabaseOrigin}` : "'self'";

const securityHeaders = [
  // Prevent browsers from MIME-sniffing a response away from the declared
  // Content-Type. Defends against uploads being re-interpreted as scripts.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Block clickjacking by disallowing the site in any iframe from a different
  // origin. CSP frame-ancestors below is the modern equivalent; this header
  // covers older browsers.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Reduce referrer leakage: send the full URL for same-origin navigations,
  // only the origin for cross-origin navigations.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable browser features not used by this portfolio/admin app.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // DNS prefetching helps performance without meaningful privacy cost here.
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  /**
   * Content Security Policy
   *
   * Directives chosen for this project:
   *
   * default-src 'self'
   *   — Fallback for anything not listed explicitly.
   *
   * script-src 'self' 'unsafe-inline'
   *   — Next.js inlines small bootstrap scripts for RSC streaming and
   *     hydration. A nonce-based strict policy would require per-request
   *     dynamic CSP which adds complexity. 'unsafe-inline' is the pragmatic
   *     choice for a local single-admin app.
   *
   * style-src 'self' 'unsafe-inline'
   *   — Tailwind CSS v4 emits inline <style> blocks; Next.js also injects
   *     critical CSS inline during SSR. Required to avoid a broken UI.
   *
   * img-src 'self' data: https:
   *   — 'self' covers /uploads/ (local filesystem images).
   *   — data: covers base64 preview thumbnails in the admin upload UI.
   *   — https: allows external thumbnail/photo URLs (validated as https://
   *     before storage, so http:// URLs will never appear in practice).
   *
   * font-src 'self'
   *   — next/font/google downloads fonts at build time and serves them
   *     from the same origin; no external font CDN requests at runtime.
   *
   * connect-src 'self' + Supabase project origin
   *   — fetch/XHR calls go to this origin's API routes, plus the exact
   *     Supabase Storage origin for direct signed uploads.
   *
   * frame-ancestors 'self'
   *   — Modern replacement for X-Frame-Options; disallows embedding in
   *     cross-origin frames.
   *
   * base-uri 'self'
   *   — Prevents injection of a <base> tag that could redirect relative URLs.
   *
   * form-action 'self'
   *   — Restrict <form> submissions to the same origin.
   *
   * object-src 'none'
   *   — Disallow Flash and other plugins entirely.
   */
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
