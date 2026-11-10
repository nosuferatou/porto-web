#!/usr/bin/env node
/**
 * Admin password reset utility.
 *
 * Run from the project root when you need to reset the admin password:
 *
 *   node scripts/reset-admin-password.js
 *
 * The script reads NEW_ADMIN_EMAIL and NEW_ADMIN_PASSWORD from environment
 * variables or prompts interactively (Node 18+).
 *
 * Example (env vars):
 *   NEW_ADMIN_EMAIL=you@example.com NEW_ADMIN_PASSWORD=SecurePass1! node scripts/reset-admin-password.js
 */

const { PrismaClient } = require("@prisma/client");
const crypto = require("node:crypto");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

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

async function main() {
  let email = process.env.NEW_ADMIN_EMAIL;
  let password = process.env.NEW_ADMIN_PASSWORD;

  if (!email || !password) {
    const rl = readline.createInterface({ input, output });
    if (!email) {
      email = await rl.question("Admin email: ");
    }
    if (!password) {
      password = await rl.question("New password: ");
    }
    rl.close();
  }

  email = email.trim().toLowerCase();
  password = password.trim();

  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`\n✗ Invalid password: ${passwordError}`);
    process.exit(1);
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    console.error(`\n✗ No admin account found for "${email}".`);
    console.error("  Run /admin/setup to create the initial admin account.");
    process.exit(1);
  }

  const passwordHash = hashPassword(password);

  await prisma.adminUser.update({
    where: { email },
    data: { passwordHash },
  });

  // Invalidate all existing sessions so the new password takes effect immediately
  await prisma.session.deleteMany({ where: { userId: user.id } });

  console.log(`\n✓ Password updated for ${email}.`);
  console.log("  All existing sessions have been invalidated.");
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
