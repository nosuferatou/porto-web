import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { validateAdminSession } from "@/lib/auth-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

// Magic byte validation to prevent malicious file uploads
function validateFileSignature(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 8) return false;

  if (ext === ".png") {
    // 89 50 4E 47 0D 0A 1A 0A
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    // FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (ext === ".gif") {
    // GIF87a or GIF89a (47 49 46 38)
    return (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    );
  }

  if (ext === ".webp") {
    // RIFF....WEBP (52 49 46 46 ... 57 45 42 50)
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  return false;
}

export async function POST(req: NextRequest) {
  // 1. Authorization: strictly require active admin session
  const user = await validateAdminSession();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized access: Sanctum session invalid." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image relic provided." },
        { status: 400 }
      );
    }

    // 2. Validate Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Payload exceeds 5MB sanctum limit." },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Forbidden file type. Only PNG, JPEG, WEBP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // 4. Validate Extension (Prevent path traversal)
    const rawExt = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: "Invalid file extension." },
        { status: 400 }
      );
    }

    // 5. Read Buffer and Validate Signature
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateFileSignature(buffer, rawExt)) {
      return NextResponse.json(
        { error: "Corrupted or malicious file signature detected." },
        { status: 400 }
      );
    }

    // 6. Generate Cryptographically Safe Random Filename
    const randomName = crypto.randomBytes(16).toString("hex");
    const safeFilename = `${randomName}${rawExt}`;

    // Target Directory: public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, safeFilename);

    // Write file securely to filesystem
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to store image artifact." },
      { status: 500 }
    );
  }
}
