import "server-only";

import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  UPLOAD_BUCKET,
  UPLOAD_PATH_PREFIX,
} from "@/lib/upload-limits";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  getExpectedMimeType,
  getNormalizedExtension,
} from "@/lib/upload-validation";
import { createUploadTicket } from "@/lib/upload-ticket";

/**
 * Issues a signed Supabase upload URL for one server-chosen object path.
 *
 * The browser uploads bytes directly to Supabase, which avoids the Vercel
 * Function request-body limit. Authorization and metadata validation happen
 * here; the actual bytes are validated by /api/uploads/verify afterwards.
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
      { error: "Invalid upload metadata." },
      { status: 400 }
    );
  }

  const { filename, contentType, size } = body as Record<string, unknown>;

  if (
    typeof filename !== "string" ||
    typeof contentType !== "string" ||
    typeof size !== "number" ||
    !Number.isFinite(size)
  ) {
    return NextResponse.json(
      { error: "Invalid upload metadata." },
      { status: 400 }
    );
  }

  if (size <= 0 || size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Image must be between 1 byte and ${MAX_UPLOAD_LABEL}.` },
      { status: 400 }
    );
  }

  const normalizedMimeType = contentType.trim().toLowerCase();

  if (!ALLOWED_MIME_TYPES.has(normalizedMimeType)) {
    return NextResponse.json(
      { error: "Only PNG, JPEG, WEBP, and GIF are allowed." },
      { status: 400 }
    );
  }

  const extension = getNormalizedExtension(filename);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { error: "Invalid file extension." },
      { status: 400 }
    );
  }

  if (getExpectedMimeType(extension) !== normalizedMimeType) {
    return NextResponse.json(
      { error: "File extension and MIME type do not match." },
      { status: 400 }
    );
  }

  // The client never chooses the storage path.
  const objectName = `${crypto.randomBytes(16).toString("hex")}${extension}`;
  const objectPath = `${UPLOAD_PATH_PREFIX}/${objectName}`;

  try {
    const { data, error } = await supabaseAdmin.storage
      .from(UPLOAD_BUCKET)
      .createSignedUploadUrl(objectPath, { upsert: false });

    if (error || !data?.signedUrl) {
      console.error("Supabase signed upload URL error:", error);

      return NextResponse.json(
        { error: "Failed to prepare image upload." },
        { status: 500 }
      );
    }

    const ticket = createUploadTicket(objectPath);

    return NextResponse.json({
      path: objectPath,
      signedUrl: data.signedUrl,
      ticket,
    });
  } catch (error) {
    console.error("Signed upload preparation failed:", error);

    return NextResponse.json(
      { error: "Failed to prepare image upload." },
      { status: 500 }
    );
  }
}
