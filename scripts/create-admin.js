#!/usr/bin/env node
/**
 * Controlled production admin creation procedure.
 *
 * Creates the FIRST admin account only. Refuses to run if any AdminUser
 * already exists, so it cannot create duplicate accounts and cannot overwrite
 * an existing account. Does NOT seed or touch any portfolio content.
 *
 * Required environment variables:
 *   ADMIN_EMAIL     — admin email address
 *   ADMIN_PASSWORD  — strong password (>=12 chars, upper/lower/number/symbol)
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='StrongPass1!' node scripts/create-admin.js
 *
 * This script is never executed automatically. Run it manually on the server
 * (or via `npm run db:create-admin`) with the credentials supplied out-of-band.
 */

const { PrismaClient } = require("@prisma/client");
const crypto = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

function validatePassword(password) {
  if (password.length < 12) return "Must be at least 12 characters.";
  if (!/[a-z]/.test(password)) return "Must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Must include a special character.";
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.error(
      "✗ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required."
    );
    process.exit(1);
  }
  if (!EMAIL_RE.test(email)) {
    console.error("✗ ADMIN_EMAIL is not a valid email address.");
    process.exit(1);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`✗ Invalid password: ${passwordError}`);
    process.exit(1);
  }

  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    console.error(
      "✗ An admin account already exists. Refusing to create a duplicate.\n" +
        "  Use scripts/reset-admin.js to replace the admin account, or\n" +
        "  scripts/reset-admin-password.js to change a password."
    );
    process.exit(1);
  }

  const passwordHash = hashPassword(password);
  const user = await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  console.log(`✓ Admin account created (${user.email}).`);
  console.log("  No portfolio content was modified.");
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());