import { NextResponse } from "next/server";

// Open registration has been removed. Admin account creation is handled
// exclusively by POST /api/auth/setup, which only works when no admin exists.
export async function POST() {
  return NextResponse.json(
    {
      error: "Open registration is not available.",
    },
    { status: 403 }
  );
}
