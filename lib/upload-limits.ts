/**
 * Shared image upload limits.
 *
 * Keep UI helper text, client-side pre-checks, and the upload API validation
 * in sync by importing these values instead of hardcoding sizes.
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "10MB";
export const UPLOAD_TOO_LARGE_ERROR = `Image must be ${MAX_UPLOAD_LABEL} or smaller.`;

/**
 * Supabase Storage bucket and object prefix used by every upload flow.
 * Shared by the signing and verification routes so both agree on the exact
 * path shape that the server is allowed to issue.
 */
export const UPLOAD_BUCKET = "portofolio-uploads";
export const UPLOAD_PATH_PREFIX = "uploads";
