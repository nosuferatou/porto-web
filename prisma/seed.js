const { PrismaClient } = require("@prisma/client");
const crypto = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  // Credentials MUST be provided via environment variables.
  // There are no insecure defaults — missing variables are a hard error.
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    console.error(
      "✗ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.\n" +
      "  Set them before running the seed:\n" +
      "    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=<strong-password> npx prisma db seed"
    );
    process.exit(1);
  }

  // Basic password strength enforcement (mirrors the setup route).
  if (
    adminPassword.length < 12 ||
    !/[a-z]/.test(adminPassword) ||
    !/[A-Z]/.test(adminPassword) ||
    !/[0-9]/.test(adminPassword) ||
    !/[^A-Za-z0-9]/.test(adminPassword)
  ) {
    console.error("✗ ADMIN_PASSWORD does not meet strength requirements.");
    process.exit(1);
  }

  // Avoid creating duplicate admin accounts.
  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    console.error(
      "✗ An admin account already exists. Refusing to seed another.\n" +
        "  Use npm run db:reset-admin to wipe admin accounts first."
    );
    process.exit(1);
  }

  const passwordHash = hashPassword(adminPassword);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✓ Admin user created (${adminEmail})`);

  // 2. Profile
  await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {
      name: "Alden Thorne",
      title: "Fullstack Engineer & Dark Fantasy Pixel Artist",
      bio: "Forging atmospheric digital experiences and high-performance web systems. Merging modern TypeScript architectures with handcrafted 16-bit gothic aesthetics.",
      location: "Bandung, Indonesia (Available Worldwide)",
      status: "Available for new projects & commissions",
    },
    create: {
      id: "default-profile",
      name: "Alden Thorne",
      title: "Fullstack Engineer & Dark Fantasy Pixel Artist",
      bio: "Forging atmospheric digital experiences and high-performance web systems. Merging modern TypeScript architectures with handcrafted 16-bit gothic aesthetics.",
      location: "Bandung, Indonesia (Available Worldwide)",
      status: "Available for new projects & commissions",
    },
  });
  console.log("✓ Profile initialized");

  // 3. Skills (7 core skills from PRD)
  const skills = [
    {
      name: "Photoshop",
      category: "Design & Art",
      iconKey: "photoshop",
      description: "Sprite sheets, pixel animations, palette indexing, and texture painting.",
      order: 1,
    },
    {
      name: "Illustrator",
      category: "Design & Art",
      iconKey: "illustrator",
      description: "Vector heraldry, typographic glyphs, and scalable gothic iconography.",
      order: 2,
    },
    {
      name: "Figma",
      category: "Design & Art",
      iconKey: "figma",
      description: "Design systems, layout tokens, high-fidelity wireframes, and prototypes.",
      order: 3,
    },
    {
      name: "VS Code",
      category: "Tools",
      iconKey: "vscode",
      description: "Primary development forge, extension workflows, and terminal orchestration.",
      order: 4,
    },
    {
      name: "Next.js",
      category: "Engineering",
      iconKey: "nextjs",
      description: "App Router, React Server Components, Turbopack, and SSR performance tuning.",
      order: 5,
    },
    {
      name: "Node.js",
      category: "Engineering",
      iconKey: "nodejs",
      description: "Server runtime, RESTful Route Handlers, database APIs, and backend tooling.",
      order: 6,
    },
    {
      name: "Kotlin",
      category: "Engineering",
      iconKey: "kotlin",
      description: "Typed mobile systems, Android architecture, and clean coroutine concurrency.",
      order: 7,
    },
  ];

  for (const s of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.skill.create({ data: s });
    } else {
      await prisma.skill.update({
        where: { id: existing.id },
        data: s,
      });
    }
  }
  console.log("✓ 7 Core skills seeded");

  // 4. Contact Links
  const contactLinks = [
    {
      platform: "GitHub",
      label: "github.com/alden-thorne",
      url: "https://github.com",
      iconKey: "github",
      order: 1,
    },
    {
      platform: "LinkedIn",
      label: "linkedin.com/in/alden-thorne",
      url: "https://linkedin.com",
      iconKey: "linkedin",
      order: 2,
    },
    {
      platform: "Instagram",
      label: "@alden.pixel",
      url: "https://instagram.com",
      iconKey: "instagram",
      order: 3,
    },
    {
      platform: "Behance",
      label: "behance.net/aldenthorne",
      url: "https://behance.net",
      iconKey: "behance",
      order: 4,
    },
  ];

  for (const c of contactLinks) {
    const existing = await prisma.contactLink.findFirst({ where: { platform: c.platform } });
    if (!existing) {
      await prisma.contactLink.create({ data: c });
    } else {
      await prisma.contactLink.update({
        where: { id: existing.id },
        data: c,
      });
    }
  }
  console.log("✓ Contact links seeded");

  // 5. Portfolio Posts
  const posts = [
    {
      title: "Grimoire of the Void",
      slug: "grimoire-of-the-void",
      summary:
        "An interactive web-based codex documenting arcane spells, powered by Next.js App Router and real-time canvas particle simulation.",
      content:
        "## The Vision\n\nA fullstack interactive compendium of eldritch lore. Built to explore web worker multithreading with canvas pixel rendering.\n\n### Architectural Highlights\n- React Server Components for zero-bundle text streaming.\n- OffscreenCanvas for 60fps stepped particle simulation.\n- Responsive gothic HUD navigation.",
      category: "Web Engineering",
      role: "Lead Architect & Designer",
      tools: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS"]),
      tags: JSON.stringify(["Next.js", "TypeScript", "Canvas", "Tailwind"]),
      featured: true,
      glyph: "📖",
      externalLink: "https://example.com/grimoire",
      githubLink: "https://github.com/example/grimoire",
      status: "published",
    },
    {
      title: "Catacomb Wanderer: Sprite Kit",
      slug: "catacomb-wanderer-sprite-kit",
      summary:
        "Complete 16-bit pixel art character asset pack featuring 12 animation states, dungeon tile sets, and dynamic lighting palettes.",
      content:
        "## Asset Overview\n\nDesigned with strict 16-color indexing in Aseprite. Includes idle, run, strike, and cast animations tailored for 2D side-scrolling dark fantasy engines.",
      category: "Pixel Art",
      role: "Pixel Artist & Animator",
      tools: JSON.stringify(["Photoshop", "Aseprite", "Illustrator"]),
      tags: JSON.stringify(["Pixel Art", "Aseprite", "Game Assets", "Photoshop"]),
      featured: true,
      glyph: "⚔️",
      externalLink: "https://example.com/catacomb",
      status: "published",
    },
    {
      title: "Obsidian Relic UI Design System",
      slug: "obsidian-relic-ui",
      summary:
        "A comprehensive Figma design system and component specification tailored for dark fantasy RPG interfaces and gothic web experiences.",
      content:
        "## Design System Architecture\n\nA production-ready design token library codified in Figma and Tailwind CSS v4. Features stepped pixel bevels, accessible WCAG AA/AAA contrast ratios, and modular card components.",
      category: "UI/UX Design",
      role: "Design Systems Engineer",
      tools: JSON.stringify(["Figma", "Illustrator"]),
      tags: JSON.stringify(["Figma", "Design Tokens", "Accessibility", "UI Kit"]),
      featured: true,
      glyph: "🛡️",
      externalLink: "https://example.com/obsidian-ui",
      status: "published",
    },
    {
      title: "Sanctuary: 2D Metroidvania Prototype",
      slug: "sanctuary-metroidvania-prototype",
      summary:
        "A playable browser-based platformer prototype exploring stepped pixel collision engines and procedural dungeon generation.",
      content:
        "## Technical Exploration\n\nBuilt in TypeScript with WebGL render pipeline. Implements custom AABB collision resolution, stepped camera tracking, and procedural cavern layouts.",
      category: "Game Dev",
      role: "Solo Developer",
      tools: JSON.stringify(["TypeScript", "Photoshop", "VS Code"]),
      tags: JSON.stringify(["Game Dev", "TypeScript", "Pixel Art", "WebGL"]),
      featured: false,
      glyph: "🏰",
      githubLink: "https://github.com/example/sanctuary",
      status: "published",
    },
    {
      title: "Necromancer Telemetry Dashboard",
      slug: "necromancer-telemetry-dashboard",
      summary:
        "High-throughput server performance monitoring dashboard with custom SVG pixel gauges, alerting thresholds, and dark gothic styling.",
      content:
        "## Real-time Telemetry\n\nA fullstack WebSocket monitoring suite featuring live event throughput gauges, memory heatmaps, and customizable threshold triggers.",
      category: "Web Engineering",
      role: "Fullstack Engineer",
      tools: JSON.stringify(["Node.js", "Next.js", "VS Code"]),
      tags: JSON.stringify(["React", "Node.js", "WebSockets", "Data Viz"]),
      featured: false,
      glyph: "⚡",
      externalLink: "https://example.com/telemetry",
      status: "published",
    },
    {
      title: "The Cursed Arcana: Tarot Illustration",
      slug: "cursed-arcana-tarot",
      summary:
        "A series of 22 Major Arcana tarot card illustrations rendered in a restrained 16-color dark fantasy pixel palette.",
      content:
        "## Tarot Arcana\n\nHandcrafted pixel illustrations exploring medieval occult symbolism, ornamental borders, and gold-leaf relic aesthetics.",
      category: "Pixel Art",
      role: "Illustrator",
      tools: JSON.stringify(["Photoshop", "Illustrator"]),
      tags: JSON.stringify(["Pixel Art", "Illustration", "Gothic", "Photoshop"]),
      featured: false,
      glyph: "🃏",
      externalLink: "https://example.com/tarot",
      status: "published",
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("✓ 6 Portfolio posts seeded");

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
