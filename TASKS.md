# IMPLEMENTATION TASKS & MILESTONES
Personal Portfolio Website — Dark Fantasy Pixel Art

Status: Planning & Specification
Stack: Next.js (App Router), TypeScript, Tailwind CSS, SQLite, Prisma ORM, Node.js

---

## Milestone 1: Environment, Design Tokens & Core Layout

- [x] **1.1 Fonts & Typography Setup**
  - Configure Google pixel fonts (`Pixelify Sans` or `Press Start 2P`) and sans body font (`Geist Sans` / `Geist Mono`) in `app/layout.tsx`.
  - Expose font CSS variables `--font-pixel`, `--font-sans`, `--font-mono`.
  - *Verification:* Inspect font rendering in browser devtools; confirm headings use pixel font and body text uses legible sans.

- [x] **1.2 Tailwind CSS Tokens & Pixel Utilities**
  - Integrate design tokens from `DESIGN.md` into `app/globals.css` using Tailwind CSS v4 `@theme` block.
  - Define color tokens: `--color-bg-abyss` (`#0B0A10`), `--color-surface-obsidian` (`#15121C`), `--color-border-gothic` (`#2A2236`), `--color-accent-blood` (`#8B1E2D`), `--color-accent-gold` (`#C9A24B`), `--color-text-bone` (`#D9D2C3`), `--color-text-ash` (`#8A8397`).
  - Add utility classes for `pixel-corners`, `pixel-border`, `pixel-shadow`, and `image-rendering: pixelated`.
  - *Verification:* Test basic box with token classes; ensure colors match hex values exactly.

- [x] **1.3 Base HTML & Accessibility Foundation**
  - Configure root HTML metadata in `app/layout.tsx` (title, description, dark theme meta).
  - Add accessible "Skip to content" link for keyboard navigation.
  - Set default background `#0B0A10` and text color `#D9D2C3`.
  - *Verification:* Tab key focuses "Skip to content"; screen reader reads proper landmarks.

---

## Milestone 2: Prisma Database & Local Data Layer

- [x] **2.1 Prisma Initialization & SQLite Schema**
  - Initialize Prisma with SQLite provider (`prisma/schema.prisma`).
  - Define models according to PRD section 8:
    - `Profile` (`id`, `name`, `title`, `bio`, `location`, `photoUrl`, `updatedAt`)
    - `Skill` (`id`, `name`, `category`, `iconKey`, `order`)
    - `Post` (`id`, `title`, `slug`, `summary`, `content`, `thumbnailUrl`, `images`, `tags`, `links`, `role`, `tools`, `status`, `featured`, `createdAt`, `updatedAt`)
    - `ContactLink` (`id`, `type`, `label`, `url`, `order`)
    - `AdminUser` (`id`, `email`, `passwordHash`, `createdAt`)
  - *Verification:* Run `npx prisma validate` without schema errors.

- [x] **2.2 Prisma Client Singleton & Initial Migration**
  - Create `lib/prisma.ts` with singleton instance to avoid multi-connection exhaustion in Next.js development.
  - Generate initial SQLite migration (`npx prisma migrate dev --name init`).
  - *Verification:* `prisma/dev.db` file is created and tables match schema.

- [x] **2.3 Database Seed Script**
  - Create `prisma/seed.ts` with default seed data:
    - Default profile (name, title, gothic bio, placeholder photo).
    - 7 core skills: Photoshop, Illustrator, Figma, VS Code, Next.js, Node.js, Kotlin.
    - Default contact links (GitHub, LinkedIn, Email).
    - 3–4 dark fantasy themed sample portfolio posts with slugs and tags.
    - Default admin account with hashed password.
  - Add seed script to `package.json` (`prisma.seed`).
  - *Verification:* Run `npx prisma db seed`; verify records exist via Prisma Studio or query test.

---

## Milestone 3: Reusable Pixel Art UI Components

- [x] **3.1 Pixel Frame & Container Component**
  - Create `components/ui/PixelCard.tsx` with stepped borders and hover states.
  - Create `components/ui/PixelFrame.tsx` for framing profile pictures and thumbnails.
  - Support variant props (`stone`, `gilded`, `blood`).
  - *Verification:* Inspect component in isolation at 375px and 1200px widths.

- [x] **3.2 Pixel Button & Badge Components**
  - Create `components/ui/PixelButton.tsx` with variants: `primary` (blood crimson bevel), `secondary` (gilded obsidian), `ghost`.
  - Create `components/ui/PixelBadge.tsx` for categories and tags.
  - Implement active pressed state (`translate-x-[2px] translate-y-[2px]`).
  - Ensure minimum 44x44px touch target on mobile.
  - *Verification:* Test button states: normal, hover, pressed, disabled, and keyboard focus outline.

- [x] **3.3 Gothic Section Divider & Icons**
  - Create `components/ui/GothicDivider.tsx` with decorative pixel motifs (chains, runes, or torches).
  - Create SVG/pixel icons for skills and social platforms in `components/icons/`.
  - *Verification:* Dividers render cleanly across screen sizes without horizontal overflow.

---

## Milestone 4: Public Landing Page Sections

- [x] **4.1 Sticky HUD Navigation Bar**
  - Create `components/layout/Navbar.tsx`:
    - Desktop: sticky top bar with logo crest and 3 tabs (**Contact**, **Information**, **Posts**).
    - Mobile: pixel hamburger icon with slide-down/pop-up gothic navigation drawer.
    - Implement scrollspy observer to highlight the currently visible section.
    - Smooth scroll to section IDs on tab click.
  - *Verification:* Clicking tabs smooth-scrolls to the corresponding section; active indicator shifts while scrolling.

- [x] **4.2 Section: Information (Profile & Bio)**
  - Create `components/home/InformationSection.tsx`:
    - Relic-framed profile photo.
    - Name, title/role, location, and bio description.
    - Status badge ("Available for commissions / work").
  - *Verification:* Text and photo display correctly from database profile; layout stacks cleanly on mobile (< 640px).

- [x] **4.3 Section: Skills Grid**
  - Create `components/home/SkillGrid.tsx`:
    - Displays 7 core skills in responsive grid.
    - Pixel icon container with hover glow and tooltip with skill name/details.
  - *Verification:* Grid adapts from 2 columns on mobile to 4 on tablet and 7 on desktop; tooltips are accessible.

- [x] **4.4 Section: Posts Preview**
  - Create `components/home/PostsPreviewSection.tsx`:
    - Query 3–6 recent or featured published posts.
    - Render pixel cards with thumbnail, title, excerpt, date, tags.
    - Include primary CTA button "View More Relics" linking to `/posts`.
  - *Verification:* Cards render dynamically; clicking a card navigates to `/posts/[slug]`.

- [x] **4.5 Section: Contact / Footer**
  - Create `components/home/ContactSection.tsx`:
    - Contact links (GitHub, LinkedIn, Instagram, Behance, Email) with pixel icons.
    - Interactive "Copy Email" button with toast notification / status feedback.
    - Copyright and thematic footer note.
  - *Verification:* Clicking "Copy Email" copies to clipboard and displays feedback; all external links open securely with `rel="noopener noreferrer"`.

---

## Milestone 5: Portfolio Listing & Detail Pages

- [x] **5.1 Portfolio Listing Page (`/posts`)**
  - Create `app/posts/page.tsx`:
    - Hero banner / header in Dark Fantasy Pixel Art style.
    - Category filter tabs (e.g., "All", "Web Dev", "Design", "Pixel Art").
    - Responsive grid of all published posts.
    - Empty state when no posts match selected category.
    - Simple pagination / load more when items exceed 12.
  - *Verification:* Filtering by category updates grid without full page reload; pagination controls work.

- [ ] **5.2 Portfolio Detail Page (`/posts/[slug]`)**
  - Create `app/posts/[slug]/page.tsx`:
    - Fetch post by slug; return 404 (not-found) if nonexistent.
    - Post header: title, publish date, category badges, role, tools used.
    - Main visual banner + image gallery modal/carousel.
    - Markdown body rendering with custom dark gothic styles for headers, lists, code blocks, blockquotes.
    - External project links (live demo, GitHub repo, Behance).
    - Previous and Next post navigation cards.
    - Back button returning to `/posts` or `/`.
  - *Verification:* Navigate to detail page with valid and invalid slugs; confirm content and media render accurately.

- [ ] **5.3 Dynamic SEO Metadata & Open Graph**
  - Implement `generateMetadata` for `app/posts/[slug]/page.tsx`.
  - Set Open Graph title, description, and preview image per portfolio item.
  - *Verification:* Check `<head>` tags in page source for proper Open Graph meta tags.

---

## Milestone 6: Admin Authentication & Dashboard

- [x] **6.1 Admin Authentication System**
  - Create secure session authentication using lightweight signed HTTP-only cookies or NextAuth/Auth.js.
  - Create login page `app/admin/login/page.tsx` with dark fantasy gothic gate theme.
  - Implement route protection middleware for all `/admin/*` routes (redirect unauthenticated to `/admin/login`).
  - *Verification:* Unauthenticated request to `/admin` redirects to login; valid login allows entry; logout revokes session.

- [x] **6.2 Admin Layout & Dashboard Overview**
  - Create `app/admin/layout.tsx` with administrative HUD (navigation to Profile, Skills, Contacts, Posts, Logout).
  - Create `app/admin/page.tsx` showing summary counts (published posts, drafts, skills) and quick action buttons.
  - *Verification:* Admin header displays correctly; dashboard navigation links route smoothly.

- [ ] **6.3 Profile & Contact Management**
  - Create `app/admin/profile/page.tsx`:
    - Form to edit name, title, bio, location.
    - Avatar upload / replace.
  - Create `app/admin/contacts/page.tsx` to add, reorder, or edit contact links.
  - *Verification:* Updating bio or contacts persists to SQLite and immediately reflects on the public `/` page.

- [ ] **6.4 Skill Management**
  - Create `app/admin/skills/page.tsx`:
    - View all skills with reorder capabilities.
    - Add new skill with name, category, and icon identifier.
    - Delete skill with confirmation dialog.
  - *Verification:* Changes to skills reflect in the Information section skill grid.

---

## Milestone 7: Admin Portfolio CRUD & Image Handling

- [x] **7.1 Local Image Upload Handler**
  - Create API Route `app/api/upload/route.ts` for local image storage:
    - Save uploaded files to `public/uploads/`.
    - Validate file type (PNG, JPG, WebP, GIF) and file size (max 5MB).
    - Sanitize filename with unique timestamp/hash to prevent collisions.
    - Return accessible public URL path (`/uploads/...`).
  - *Verification:* Upload test image via API; verify file exists in `public/uploads/` and opens in browser.

- [ ] **7.2 Post List View (`/admin/posts`)**
  - Create `app/admin/posts/page.tsx`:
    - Table displaying all posts: thumbnail, title, category, status (Draft/Published), featured badge, updated date.
    - Actions: Edit, Delete, Toggle Featured, Quick View.
  - *Verification:* Table renders all posts with accurate status indicators.

- [ ] **7.3 Post Create & Edit Form (`/admin/posts/new`, `/admin/posts/[id]`)**
  - Form fields: Title, auto-generated slug (with manual override), excerpt, full content, category, tags, role, tools, external links.
  - Image uploader for thumbnail and additional gallery images.
  - Draft vs Published radio/switch, Featured checkbox.
  - Form validation with clear error messages.
  - *Verification:* Create a new post; verify it saves to SQLite database and displays in posts list and public site when published.

- [ ] **7.4 Delete Post Flow**
  - Implement delete action with confirmation modal.
  - Handle associated images cleanup if applicable.
  - *Verification:* Deleted post disappears from admin table and public `/posts` list.

---

## Milestone 8: Quality Assurance, Accessibility & Anti-Slop Audit

- [ ] **8.1 Visual & Responsive Review**
  - Verify layout reflow across viewports: 360px, 414px, 768px, 1024px, 1440px.
  - Check that all pixel borders and sprites use `image-rendering: pixelated`.
  - Confirm tap targets meet minimum 44x44px on mobile devices.
  - *Verification:* No horizontal overflow, broken cards, or clipped text at any width.

- [ ] **8.2 Accessibility Audit**
  - Verify contrast ratios across all text and interactive states against WCAG AA standards.
  - Verify keyboard tab navigation across navbar, modal, skill cards, and forms.
  - Verify `prefers-reduced-motion` suppresses animations.
  - *Verification:* Lighthouse Accessibility score ≥ 90.

- [ ] **8.3 Performance Optimization**
  - Implement Next.js `next/image` with proper width/height and modern format serving (WebP/AVIF).
  - Add lazy loading for images below the fold.
  - Check bundle size and eliminate unused scripts.
  - *Verification:* Lighthouse Performance score ≥ 85; LCP ≤ 2.5s.

- [ ] **8.4 Code Quality & Build Verification**
  - Run ESLint (`npm run lint`) to ensure clean code with zero errors.
  - Run production build (`npm run build`) to ensure all TypeScript types and App Router routes compile cleanly.
  - *Verification:* `npm run build` completes with exit code 0.
