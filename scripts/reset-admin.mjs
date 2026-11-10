#!/usr/bin/env node
/**
 * Fresh admin account reset utility.
 *
 * Deletes ALL existing AdminUser records (and, via cascade, their Session
 * records) so a brand-new admin account can be created afterwards using
 * /admin/setup (local dev) or scripts/create-admin.mjs (production).
 *
 * This script affects ONLY:
 *   - AdminUser rows
 *   - Session rows belonging to those admin users (deleted by cascade)
 *
 * It does NOT touch: Profile, Skill, Post, Category, ContactLink, or any
 * other portfolio/CMS content. It does not drop tables or reset the DB.
 *
 * It is never executed automatically. Run manually only when you
 * intentionally want to wipe the admin account(s).
 *
 * Usage:
 *   node scripts/reset-admin.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.adminUser.count();

  if (userCount === 0) {
    console.log("No admin accounts exist. Nothing to reset.");
    return;
  }

  // Delete sessions first (explicit), then admin users. The schema also has
  // onDelete: Cascade, but being explicit keeps intent clear and works even
  // if the relation config changes.
  const deletedSessions = await prisma.session.deleteMany({});
  const deletedUsers = await prisma.adminUser.deleteMany({});

  console.log(`✓ Deleted ${deletedUsers.count} admin account(s).`);
  console.log(`✓ Deleted ${deletedSessions.count} session(s).`);
  console.log("  All portfolio/CMS content is untouched.");
  console.log(
    "  Create a new admin via /admin/setup (local dev) or scripts/create-admin.mjs."
  );
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
