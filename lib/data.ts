export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  status: string;
  photoPlaceholder: string;
  specialty?: string;
  discipline?: string;
  timezone?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  iconKey: string;
  iconUrl?: string;
  description: string;
  order: number;
  showOnHomepage?: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: "Web Engineering" | "Pixel Art" | "UI/UX Design" | "Game Dev";
  date: string;
  tags: string[];
  role: string;
  tools: string[];
  featured: boolean;
  glyph: string;
  thumbnailUrl?: string;
  externalLink?: string;
  githubLink?: string;
}

export interface ContactLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  iconKey: string;
}

export const profileData: Profile = {
  name: "Alden Thorne",
  title: "Fullstack Engineer & Dark Fantasy Pixel Artist",
  bio: "Forging atmospheric digital experiences and high-performance web systems. Merging modern TypeScript architectures with handcrafted 16-bit gothic aesthetics.",
  location: "Bandung, Indonesia (Available Worldwide)",
  status: "Available for new projects & commissions",
  photoPlaceholder: "✦",
  specialty: "Web & Pixel Art",
  discipline: "Fullstack Craft",
  timezone: "Asia/Jakarta",
};

export const skillsData: Skill[] = [
  {
    id: "photoshop",
    name: "Photoshop",
    category: "Design & Art",
    iconKey: "photoshop",
    description: "Sprite sheets, pixel animations, palette indexing, and texture painting.",
    order: 1,
    showOnHomepage: true,
  },
  {
    id: "illustrator",
    name: "Illustrator",
    category: "Design & Art",
    iconKey: "illustrator",
    description: "Vector heraldry, typographic glyphs, and scalable gothic iconography.",
    order: 2,
    showOnHomepage: true,
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design & Art",
    iconKey: "figma",
    description: "Design systems, layout tokens, high-fidelity wireframes, and prototypes.",
    order: 3,
    showOnHomepage: true,
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Tools",
    iconKey: "vscode",
    description: "Primary development forge, extension workflows, and terminal orchestration.",
    order: 4,
    showOnHomepage: true,
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Engineering",
    iconKey: "nextjs",
    description: "App Router, React Server Components, Turbopack, and SSR performance tuning.",
    order: 5,
    showOnHomepage: true,
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Engineering",
    iconKey: "nodejs",
    description: "Server runtime, RESTful Route Handlers, database APIs, and backend tooling.",
    order: 6,
    showOnHomepage: true,
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "Engineering",
    iconKey: "kotlin",
    description: "Typed mobile systems, Android architecture, and clean coroutine concurrency.",
    order: 7,
    showOnHomepage: true,
  },
];

export const postsData: Post[] = [
  {
    id: "post-1",
    title: "Grimoire of the Void",
    slug: "grimoire-of-the-void",
    summary:
      "An interactive web-based codex documenting arcane spells, powered by Next.js App Router and real-time canvas particle simulation.",
    category: "Web Engineering",
    date: "Oct 2026",
    tags: ["Next.js", "TypeScript", "Canvas", "Tailwind"],
    role: "Lead Architect & Designer",
    tools: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
    glyph: "📖",
    externalLink: "https://example.com/grimoire",
    githubLink: "https://github.com/example/grimoire",
  },
  {
    id: "post-2",
    title: "Catacomb Wanderer: Sprite Kit",
    slug: "catacomb-wanderer-sprite-kit",
    summary:
      "Complete 16-bit pixel art character asset pack featuring 12 animation states, dungeon tile sets, and dynamic lighting palettes.",
    category: "Pixel Art",
    date: "Aug 2026",
    tags: ["Pixel Art", "Aseprite", "Game Assets", "Photoshop"],
    role: "Pixel Artist & Animator",
    tools: ["Photoshop", "Aseprite", "Illustrator"],
    featured: true,
    glyph: "⚔️",
    externalLink: "https://example.com/catacomb",
  },
  {
    id: "post-3",
    title: "Obsidian Relic UI Design System",
    slug: "obsidian-relic-ui",
    summary:
      "A comprehensive Figma design system and component specification tailored for dark fantasy RPG interfaces and gothic web experiences.",
    category: "UI/UX Design",
    date: "Jun 2026",
    tags: ["Figma", "Design Tokens", "Accessibility", "UI Kit"],
    role: "Design Systems Engineer",
    tools: ["Figma", "Illustrator"],
    featured: true,
    glyph: "🛡️",
    externalLink: "https://example.com/obsidian-ui",
  },
  {
    id: "post-4",
    title: "Sanctuary: 2D Metroidvania Prototype",
    slug: "sanctuary-metroidvania-prototype",
    summary:
      "A playable browser-based platformer prototype exploring stepped pixel collision engines and procedural dungeon generation.",
    category: "Game Dev",
    date: "May 2026",
    tags: ["Game Dev", "TypeScript", "Pixel Art", "WebGL"],
    role: "Solo Developer",
    tools: ["TypeScript", "Photoshop", "VS Code"],
    featured: false,
    glyph: "🏰",
    githubLink: "https://github.com/example/sanctuary",
  },
  {
    id: "post-5",
    title: "Necromancer Telemetry Dashboard",
    slug: "necromancer-telemetry-dashboard",
    summary:
      "High-throughput server performance monitoring dashboard with custom SVG pixel gauges, alerting thresholds, and dark gothic styling.",
    category: "Web Engineering",
    date: "Mar 2026",
    tags: ["React", "Node.js", "WebSockets", "Data Viz"],
    role: "Fullstack Engineer",
    tools: ["Node.js", "Next.js", "VS Code"],
    featured: false,
    glyph: "⚡",
    externalLink: "https://example.com/telemetry",
  },
  {
    id: "post-6",
    title: "The Cursed Arcana: Tarot Illustration",
    slug: "cursed-arcana-tarot",
    summary:
      "A series of 22 Major Arcana tarot card illustrations rendered in a restrained 16-color dark fantasy pixel palette.",
    category: "Pixel Art",
    date: "Jan 2026",
    tags: ["Pixel Art", "Illustration", "Gothic", "Photoshop"],
    role: "Illustrator",
    tools: ["Photoshop", "Illustrator"],
    featured: false,
    glyph: "🃏",
    externalLink: "https://example.com/tarot",
  },
];

export const contactEmail = "alden.thorne@obsidian.relic";

export const contactLinksData: ContactLink[] = [
  {
    id: "c-github",
    platform: "GitHub",
    label: "github.com/alden-thorne",
    url: "https://github.com",
    iconKey: "github",
  },
  {
    id: "c-linkedin",
    platform: "LinkedIn",
    label: "linkedin.com/in/alden-thorne",
    url: "https://linkedin.com",
    iconKey: "linkedin",
  },
  {
    id: "c-instagram",
    platform: "Instagram",
    label: "@alden.pixel",
    url: "https://instagram.com",
    iconKey: "instagram",
  },
  {
    id: "c-behance",
    platform: "Behance",
    label: "behance.net/aldenthorne",
    url: "https://behance.net",
    iconKey: "behance",
  },
];
