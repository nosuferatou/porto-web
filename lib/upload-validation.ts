import "server-only";

import path from "node:path";
import { UPLOAD_PATH_PREFIX } from "@/lib/upload-limits";

// The approved image allow-list. Kept identical to the previous upload route;
// do not broaden without an explicit product decision.
export const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const MIME_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Object paths are always generated server-side as
 * `uploads/<32 hex chars>.<allowed extension>`.
 * Verification rejects anything that does not match this exact shape.
 */
export const UPLOAD_PATH_PATTERN = new RegExp(
  `^${UPLOAD_PATH_PREFIX}/[a-f0-9]{32}\\.(png|jpg|jpeg|webp|gif)$`
);

export function getNormalizedExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function getExpectedMimeType(extension: string): string | undefined {
  return MIME_BY_EXTENSION[extension];
}

export function validateFileSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  if (ext === ".png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    return (
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (ext === ".gif") {
    return (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    );
  }

  if (ext === ".webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}
