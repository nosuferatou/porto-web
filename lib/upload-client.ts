import {
  MAX_UPLOAD_BYTES,
  UPLOAD_TOO_LARGE_ERROR,
} from "@/lib/upload-limits";

type JsonRecord = Record<string, unknown>;

const SESSION_EXPIRED_MESSAGE =
  "Your session expired. Sign in again and retry.";
const NETWORK_ERROR_MESSAGE =
  "Upload failed. Check your connection and try again.";

export class UploadError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "UploadError";
    this.status = status;
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

async function readJson(response: Response): Promise<JsonRecord | null> {
  try {
    const data: unknown = await response.json();
    if (typeof data === "object" && data !== null) {
      return data as JsonRecord;
    }
    return null;
  } catch {
    return null;
  }
}

async function requestJson(
  input: string,
  init: RequestInit,
  signal: AbortSignal | undefined,
  fallbackMessage: string
): Promise<JsonRecord> {
  let response: Response;

  try {
    response = await fetch(input, { ...init, signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new UploadError(NETWORK_ERROR_MESSAGE);
  }

  const payload = await readJson(response);

  if (response.status === 401) {
    throw new UploadError(SESSION_EXPIRED_MESSAGE, 401);
  }

  if (!response.ok) {
    const message =
      payload && typeof payload.error === "string"
        ? payload.error
        : fallbackMessage;
    throw new UploadError(message, response.status);
  }

  if (!payload) {
    throw new UploadError(fallbackMessage, response.status);
  }

  return payload;
}

/**
 * Uploads an image directly to Supabase Storage.
 *
 * Flow: authenticated sign → direct PUT to the signed URL → authenticated
 * verify. The returned URL is the verified public URL, so callers keep storing
 * a plain string exactly as before.
 */
export async function uploadImage(
  file: File,
  options: { signal?: AbortSignal } = {}
): Promise<string> {
  const { signal } = options;

  if (file.size <= 0) {
    throw new UploadError("Image file is empty.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(UPLOAD_TOO_LARGE_ERROR);
  }

  const sign = await requestJson(
    "/api/uploads/sign",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    },
    signal,
    "Upload could not be started."
  );

  const { path, signedUrl, ticket } = sign;

  if (
    typeof path !== "string" ||
    typeof signedUrl !== "string" ||
    typeof ticket !== "string" ||
    !isHttpsUrl(signedUrl)
  ) {
    throw new UploadError("Upload could not be started.");
  }

  let uploadResponse: Response;

  try {
    uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: file,
      signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new UploadError(NETWORK_ERROR_MESSAGE);
  }

  if (!uploadResponse.ok) {
    throw new UploadError(
      "Upload to storage failed. Please try again.",
      uploadResponse.status
    );
  }

  const verified = await requestJson(
    "/api/uploads/verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, ticket }),
    },
    signal,
    "Upload verification failed."
  );

  if (typeof verified.url !== "string") {
    throw new UploadError("Upload verification failed.");
  }

  return verified.url;
}
