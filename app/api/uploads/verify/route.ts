import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  UPLOAD_BUCKET,
} from "@/lib/upload-limits";
import {
  UPLOAD_PATH_PATTERN,
  getExpectedMimeType,
  getNormalizedExtension,
  validateFileSignature,
} from "@/lib/upload-validation";
import { verifyUploadTicket } from "@/lib/upload-ticket";

const SIGNATURE_PREFIX_BYTES = 16;

type ObjectReadResult =
  | {
      status: "ok";
      buffer: Buffer;
      contentType: string | null;
      size: number | null;
    }
  // The object does not exist (or is not public). Deleting it is pointless.
  | { status: "not-found" }
  // Storage could not be read. The object may be valid, so it is never deleted.
  | { status: "unavailable" };

/** Parses a non-negative integer header value, rejecting malformed input. */
function parseByteCount(value: string | null): number | null {
  if (value === null) return null;

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

/**
 * Total object size from a storage response.
 *
 * A 206 response reports the full size after the slash in Content-Range; a 200
 * response reports it in Content-Length. If the metadata is absent, malformed,
 * or reports an unknown total (`bytes 0-15/*`), the caller fails closed instead
 * of guessing from a partial body length.
 */
function parseObjectSize(response: Response): number | null {
  const contentRange = response.headers.get("content-range");

  if (contentRange) {
    // Strict shape; anything else (including `*`) is not a trustworthy size.
    const match = /^bytes\s+\d+-\d+\/(\d+)$/i.exec(contentRange.trim());
    return match ? parseByteCount(match[1]) : null;
  }

  // A 206 without Content-Range only exposes the partial length.
  if (response.status === 206) return null;

  return parseByteCount(response.headers.get("content-length"));
}

/** HEAD fallback for a response that omits size or content-type metadata. */
async function readObjectMetadata(
  url: string
): Promise<{ size: number | null; contentType: string | null }> {
  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });

    if (!response.ok) {
      return { size: null, contentType: null };
    }

    return {
      size: parseByteCount(response.headers.get("content-length")),
      contentType: response.headers.get("content-type"),
    };
  } catch {
    return { size: null, contentType: null };
  }
}

/**
 * Reads only the leading bytes of a stored object.
 *
 * A Range request is attempted first. If the storage/CDN layer ignores it and
 * returns 200 with the full object, only the prefix is consumed and the stream
 * is cancelled, so a 10 MiB file is never buffered into the Function.
 *
 * The result distinguishes "the object is invalid" from "storage could not be
 * read": only the former may delete the object.
 */
async function readObjectPrefix(
  url: string,
  byteCount: number
): Promise<ObjectReadResult> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Range: `bytes=0-${byteCount - 1}` },
      cache: "no-store",
    });
  } catch (error) {
    console.error("Object read failed:", error);
    return { status: "unavailable" };
  }

  if (response.status === 404) {
    await response.body?.cancel().catch(() => undefined);
    return { status: "not-found" };
  }

  if (response.status === 416) {
    await response.body?.cancel().catch(() => undefined);

    // 416 usually means the object is empty. Confirm through metadata before
    // treating it as invalid, so a spurious 416 cannot delete a valid upload.
    const metadata = await readObjectMetadata(url);

    if (metadata.size === 0) {
      return {
        status: "ok",
        buffer: Buffer.alloc(0),
        contentType: metadata.contentType,
        size: 0,
      };
    }

    return { status: "unavailable" };
  }

  if (response.status !== 200 && response.status !== 206) {
    await response.body?.cancel().catch(() => undefined);
    return { status: "unavailable" };
  }

  if (!response.body) {
    // No readable body means the content cannot be validated. Fail closed
    // without deleting a possibly valid object.
    return { status: "unavailable" };
  }

  const size = parseObjectSize(response);
  const contentType = response.headers.get("content-type");
  const metadata =
    size === null || contentType === null
      ? await readObjectMetadata(url)
      : null;

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;

  try {
    while (total < byteCount) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      const chunk = Buffer.from(value);
      chunks.push(chunk);
      total += chunk.length;
    }
  } catch (error) {
    console.error("Object stream read failed:", error);
    await reader.cancel().catch(() => undefined);
    return { status: "unavailable" };
  }

  // Release the connection whether Range was honored or ignored.
  await reader.cancel().catch(() => undefined);

  return {
    status: "ok",
    buffer: Buffer.concat(chunks).subarray(0, byteCount),
    contentType: contentType ?? metadata?.contentType ?? null,
    size: size ?? metadata?.size ?? null,
  };
}

async function removeRejectedObject(objectPath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(UPLOAD_BUCKET)
    .remove([objectPath]);

  if (error) {
    console.error("Failed to remove rejected upload:", error);
  }
}

/**
 * Verifies an object that was uploaded directly to Supabase Storage.
 *
 * Only paths issued by /api/uploads/sign are accepted (HMAC ticket). The
 * object's real bytes and stored content type are checked, and anything that
 * fails validation is deleted before an error is returned.
 */
export async function POST(req: NextRequest) {
  const user = await validateAdminSession();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized access." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Invalid upload verification request." },
      { status: 400 }
    );
  }

  const { path, ticket } = body as Record<string, unknown>;

  if (typeof path !== "string" || !UPLOAD_PATH_PATTERN.test(path)) {
    return NextResponse.json(
      { error: "Invalid upload path." },
      { status: 400 }
    );
  }

  let ticketIsValid = false;

  try {
    ticketIsValid =
      typeof ticket === "string" && verifyUploadTicket(path, ticket);
  } catch (error) {
    console.error("Upload ticket verification failed:", error);

    return NextResponse.json(
      { error: "Upload verification is unavailable." },
      { status: 500 }
    );
  }

  if (!ticketIsValid) {
    // The object (if any) is left untouched: an invalid ticket must never be
    // able to delete another upload.
    return NextResponse.json(
      { error: "Upload verification ticket is invalid or expired." },
      { status: 400 }
    );
  }

  try {
    const { data } = supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .getPublicUrl(path);

    const publicUrl = data.publicUrl;
    const result = await readObjectPrefix(publicUrl, SIGNATURE_PREFIX_BYTES);

    if (result.status === "not-found") {
      return NextResponse.json(
        { error: "Uploaded image not found." },
        { status: 400 }
      );
    }

    if (result.status === "unavailable") {
      // Storage could not be read. Do not delete: the object may be valid and
      // the failure may be transient.
      return NextResponse.json(
        { error: "Uploaded image could not be read." },
        { status: 500 }
      );
    }

    const extension = getNormalizedExtension(path);

    // Enforce the real object size, not the client-declared metadata.
    if (result.size === null) {
      return NextResponse.json(
        { error: "Uploaded image size could not be verified." },
        { status: 500 }
      );
    }

    if (result.size <= 0) {
      await removeRejectedObject(path);

      return NextResponse.json(
        { error: `Image must be between 1 byte and ${MAX_UPLOAD_LABEL}.` },
        { status: 400 }
      );
    }

    if (result.size > MAX_UPLOAD_BYTES) {
      await removeRejectedObject(path);

      return NextResponse.json(
        { error: `Image must be ${MAX_UPLOAD_LABEL} or smaller.` },
        { status: 400 }
      );
    }

    if (!validateFileSignature(result.buffer, extension)) {
      await removeRejectedObject(path);

      return NextResponse.json(
        { error: "Invalid image file signature." },
        { status: 400 }
      );
    }

    const expectedMimeType = getExpectedMimeType(extension);
    const storedMimeType =
      result.contentType?.split(";")[0]?.trim().toLowerCase() ?? "";

    if (!expectedMimeType || storedMimeType !== expectedMimeType) {
      await removeRejectedObject(path);

      return NextResponse.json(
        { error: "File extension and MIME type do not match." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Image verification failed:", error);

    return NextResponse.json(
      { error: "Failed to verify image upload." },
      { status: 500 }
    );
  }
}
