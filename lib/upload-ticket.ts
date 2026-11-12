import "server-only";

import crypto from "node:crypto";

/**
 * HMAC tickets bind an upload path to a server-issued, time-limited token.
 *
 * Why: the verification endpoint accepts a client-supplied object path, so it
 * must be able to prove that this exact path was issued by the signing route.
 * The ticket is scoped to the path, expires just after the signed upload URL,
 * and is compared with a timing-safe comparison.
 */

const TICKET_VERSION = "v1";

// Supabase signed upload URLs have a fixed 2-hour lifetime (the SDK does not
// expose a TTL option). The ticket must not expire before the URL it belongs
// to, otherwise a legitimate upload that completes near the end of the window
// can never be verified.
const SIGNED_URL_TTL_MS = 2 * 60 * 60 * 1000;

// Verification can only be requested after the PUT finishes, so the ticket
// outlives the URL by a short margin covering transfer completion and the
// verify round-trip. This is not an upload credential: the signed URL still
// stops accepting bytes on Supabase's schedule.
const VERIFICATION_GRACE_MS = 5 * 60 * 1000;

const TICKET_TTL_MS = SIGNED_URL_TTL_MS + VERIFICATION_GRACE_MS;
const MIN_CONFIGURED_SECRET_LENGTH = 32;

let cachedSecret: Buffer | null = null;

function getTicketSecret(): Buffer {
  if (cachedSecret) return cachedSecret;

  const configured = process.env.UPLOAD_TICKET_SECRET;

  if (configured !== undefined) {
    if (configured.length < MIN_CONFIGURED_SECRET_LENGTH) {
      throw new Error(
        "UPLOAD_TICKET_SECRET must be at least 32 characters long."
      );
    }
    cachedSecret = Buffer.from(configured, "utf8");
    return cachedSecret;
  }

  // Fallback for deployments that only configure Supabase: derive a dedicated
  // key from the service-role key (already server-only and high entropy).
  // Rotating that key invalidates outstanding tickets, which is harmless.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing server secret for upload tickets.");
  }

  cachedSecret = crypto
    .createHmac("sha256", serviceRoleKey)
    .update("portofolio-uploads:upload-ticket:v1")
    .digest();

  return cachedSecret;
}

function signTicketPayload(payload: string): string {
  return crypto
    .createHmac("sha256", getTicketSecret())
    .update(payload)
    .digest("base64url");
}

export function createUploadTicket(objectPath: string): string {
  const expiresAt = Date.now() + TICKET_TTL_MS;
  const signature = signTicketPayload(
    `${TICKET_VERSION}:${objectPath}:${expiresAt}`
  );

  return `${TICKET_VERSION}.${expiresAt}.${signature}`;
}

export function verifyUploadTicket(
  objectPath: string,
  ticket: string
): boolean {
  const parts = ticket.split(".");
  if (parts.length !== 3) return false;

  const [version, rawExpiresAt, signature] = parts;

  if (version !== TICKET_VERSION) return false;
  if (!/^\d+$/.test(rawExpiresAt)) return false;

  const expiresAt = Number(rawExpiresAt);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const expected = Buffer.from(
    signTicketPayload(`${version}:${objectPath}:${rawExpiresAt}`),
    "base64url"
  );
  const received = Buffer.from(signature, "base64url");

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}
