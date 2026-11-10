/**
 * URL validation for external links and internal image paths stored in the DB.
 *
 * External links (externalLink, githubLink, contact URLs): only http/https.
 * Image fields (thumbnailUrl, photoUrl): also allow /uploads/ paths produced
 * by the local file upload endpoint.
 */

const ALLOWED_SCHEMES = new Set(["http:", "https:"]);

/** True for a valid absolute HTTP or HTTPS URL. */
export function isValidExternalUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    const parsed = new URL(value.trim());
    return ALLOWED_SCHEMES.has(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * True for values that are valid image sources:
 *   - absolute http/https URLs, or
 *   - relative /uploads/ paths produced by the internal upload endpoint.
 */
export function isValidImageSrc(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  const str = value.trim();
  // Relative paths from the upload endpoint (/uploads/<hex>.<ext>)
  if (/^\/uploads\/[a-f0-9]{32}\.(png|jpg|jpeg|webp|gif)$/i.test(str)) {
    return true;
  }
  return isValidExternalUrl(str);
}

/**
 * Sanitize an optional external URL field (links, not images).
 * Returns null for empty/absent values; throws on invalid input.
 */
export function sanitizeExternalUrl(
  value: unknown,
  fieldName = "URL"
): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (str === "") return null;
  if (!isValidExternalUrl(str)) {
    throw new Error(
      `${fieldName} must be a valid HTTP or HTTPS URL. Received: "${str.slice(0, 80)}"`
    );
  }
  return str;
}

/**
 * Sanitize an optional image URL field (thumbnails, profile photos).
 * Accepts http/https URLs and /uploads/ paths. Returns null for empty/absent.
 */
export function sanitizeImageUrl(
  value: unknown,
  fieldName = "Image URL"
): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (str === "") return null;
  if (!isValidImageSrc(str)) {
    throw new Error(
      `${fieldName} must be a valid HTTP/HTTPS URL or an uploaded image path. Received: "${str.slice(0, 80)}"`
    );
  }
  return str;
}
