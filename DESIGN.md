# DESIGN SYSTEM: DARK FANTASY PIXEL ART
*The Obsidian Reliquary*

Design reference document for the personal portfolio website.

---

## 1. Visual Direction & Aesthetic Philosophy

The visual identity is **Dark Fantasy Pixel Art** — atmospheric, gothic, solemn, and tactile, reminiscent of classic dark fantasy games (such as *Castlevania: Symphony of the Night*, *Blasphemous*, and *Diablo II*), merged with modern web ergonomics, crisp typography, and responsive craft.

### Core Principles
- **Atmospheric Depth over Generic Polish:** Reject generic modern SaaS gradients, floating circular blur orbs, and over-soft shadows. Use hard pixel stepped shadows, engraved borders, and textured surfaces.
- **Substance over Gimmicks:** Pixel art motifs (corner brackets, stone frames, relic borders, ember highlights) should frame real portfolio work, not obscure it.
- **Dual Surface Modes:**
  - **Experience Mode (Public):** Immersive, dark gothic presentation where the interface recedes to celebrate the creative and engineering works.
  - **Operate Mode (Admin):** Clean, utilitarian dark workspace prioritizing information density, scannable tables, clear form fields, and immediate state feedback.
- **Strict Anti-Slop Discipline:**
  - No generic blue-to-purple gradients.
  - No full-screen glassmorphism blur layers.
  - No uniform pill buttons across all components.
  - No restating-the-obvious comments or inflated copy buzzwords (*seamless, elevate, delve, revolutionize*).

---

## 2. Color Palette & Token Architecture

The color system is derived from the approved PRD specification, calibrated for WCAG AA/AAA accessibility compliance.

### 2.1 Palette Tokens

| Token | Name | Hex | Semantic Role | WCAG Contrast (on `#0B0A10`) |
| :--- | :--- | :--- | :--- | :--- |
| `--color-bg-abyss` | Abyss Black | `#0B0A10` | Primary page background | Background base |
| `--color-surface-obsidian` | Obsidian Charcoal | `#15121C` | Card and modal surface background | 1.15:1 (Surface boundary) |
| `--color-surface-elevated` | Crypt Slate | `#1E1A27` | Hover states, elevated popovers | 1.35:1 (Elevated surface) |
| `--color-border-gothic` | Ash Violet | `#2A2236` | Card borders, structural dividers | 1.65:1 (Structural edge) |
| `--color-border-subtle` | Iron Veil | `#3B324D` | Interactive borders, input outlines | 2.30:1 (3:1 required for active states) |
| `--color-text-bone` | Bone Parchment | `#D9D2C3` | Primary headings, body copy, active labels | **13.10:1 (Passes AAA)** |
| `--color-text-ash` | Muted Ash | `#8A8397` | Secondary text, timestamps, captions, metadata | **5.42:1 (Passes AA)** |
| `--color-accent-blood` | Blood Crimson | `#8B1E2D` | Primary CTAs, active indicators, alert borders | Used as background or border |
| `--color-accent-blood-bright` | Cinnabar Ember | `#B8283D` | Hover state for crimson CTAs, link highlights | 3.25:1 (Accent edge) |
| `--color-accent-gold` | Tarnished Gold | `#C9A24B` | Secondary badges, featured tags, relic icons | **8.22:1 (Passes AAA as text)** |
| `--color-accent-gold-bright` | Gilded Relic | `#DFB75E` | Gold hover state, focused rings | **10.15:1 (Passes AAA)** |
| `--color-magic-shadow` | Void Purple | `#4B2E6F` | Subtle decorative aura, category badge accents | Background tint |

### 2.2 Accessibility & Contrast Rules
- **Text on Abyss (`#0B0A10`):** Always use Bone Parchment (`#D9D2C3`, 13.10:1) or Muted Ash (`#8A8397`, 5.42:1).
- **Text on Obsidian (`#15121C`):** Bone Parchment (`#D9D2C3`, 12.30:1) and Muted Ash (`#8A8397`, 5.09:1) both exceed the WCAG AA 4.5:1 requirement.
- **Blood Crimson (`#8B1E2D`) Usage:**
  - NEVER use `#8B1E2D` directly as body text on Abyss or Obsidian (contrast ratio 2.18:1 fails WCAG AA).
  - Use `#8B1E2D` as a button background paired with Bone Parchment (`#D9D2C3`, contrast 6.01:1 — passes AA) or pure white text.
  - For crimson text on dark surfaces, use an accessible highlight tint like `#E2586E` (passes 5.2:1).

---

## 3. Typography System

To balance authentic pixel-art nostalgia with modern long-form readability, the typography system separates **Pixel Headings** from **Legible Monospace & Sans Body**.

### 3.1 Font Families
- **Display / Heading Font:** `Pixelify Sans` or `Press Start 2P` (`var(--font-pixel)`), with fallback `monospace`.
  - Used for: Site logo, section titles (H1, H2, H3), key stats, navigation tabs, button text.
  - Sizing must be restrained to avoid overwhelming the interface.
- **Body & Content Font:** `Geist Sans` / crisp system sans (`var(--font-sans)`) paired with `Geist Mono` (`var(--font-mono)`) for code/metadata tags.
  - Used for: Bio paragraphs, portfolio descriptions, markdown case studies, form inputs, admin tables.
  - *Rationale:* Extended reading in pixel font causes severe eye strain; body copy uses a crisp, high-legibility font with clean letter-spacing and 1.6 line height.

### 3.2 Type Scale

| Level | Font | Size (Desktop) | Size (Mobile) | Line Height | Tracking / Weight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | Pixel Display | 2.25rem (36px) | 1.75rem (28px) | 1.2 | Normal / Uppercase |
| **Section Title (H2)** | Pixel Display | 1.5rem (24px) | 1.25rem (20px) | 1.25 | Normal / Uppercase |
| **Card / Item Title (H3)** | Pixel Display | 1.125rem (18px) | 1.0rem (16px) | 1.3 | Normal |
| **Subheadings (H4)** | Pixel / Mono | 0.875rem (14px) | 0.8125rem (13px) | 1.4 | Medium |
| **Body (Default)** | Sans / Body | 1.0rem (16px) | 0.9375rem (15px) | 1.6 | Regular (400) |
| **Body Muted / Small** | Sans / Body | 0.875rem (14px) | 0.8125rem (13px) | 1.5 | Regular (400) |
| **Metadata / Badges / Code** | Monospace | 0.75rem (12px) | 0.75rem (12px) | 1.4 | SemiBold (600) |

---

## 4. Spacing, Borders & Pixel Geometry

Pixel art interfaces rely on deliberate modular geometry, hard steps, and crisp alignment.

### 4.1 Spatial Grid
- Base unit: `4px` (`0.25rem`).
- Spacing scale:
  - `space-1`: 4px (micro gaps, border offsets)
  - `space-2`: 8px (badge padding, icon gaps)
  - `space-3`: 12px (button padding horizontal/vertical)
  - `space-4`: 16px (card inner padding compact)
  - `space-6`: 24px (standard card padding, grid gap)
  - `space-8`: 32px (section inner margins)
  - `space-12`: 48px (tablet section separation)
  - `space-16`: 64px (desktop section vertical cadence)
  - `space-24`: 96px (hero top/bottom padding)

### 4.2 Pixel Borders & Stepped Shadows
Modern rounded corners are prohibited for primary containers. Instead, use sharp corners, stepped pixel cutouts, or 2px-3px solid stepped frames:
- **Default Card Border:** `border: 2px solid #2A2236;`
- **Gothic Relic Frame (CSS Stepped Border):**
  ```css
  box-shadow:
    0 0 0 2px #0B0A10,
    0 0 0 4px #2A2236,
    4px 4px 0 2px #000000;
  ```
- **Pixel Corner Accents:** Corner stud coordinates (2x2px decorative brackets in Tarnished Gold `#C9A24B` or Ash Violet `#2A2236`).
- **Stepped Pixel Shadow (Buttons/Cards):**
  ```css
  /* Hard drop shadow instead of soft blurred glow */
  box-shadow: 3px 3px 0px 0px #000000;
  ```

---

## 5. Component Specifications

### 5.1 Gothic Relic Card
- **Base Surface:** Obsidian Charcoal (`#15121C`) background with 2px solid Ash Violet (`#2A2236`) border.
- **Top Bar / Title Strip:** Optional darker header bar with a subtle 1px divider.
- **Thumbnail Image:** Aspect ratio 16:9 or 4:3, rendered with `image-rendering: pixelated` when pixel art or crisp object-cover with subtle inset shadow.
- **Hover State:**
  - Card translates: `translate-y-[-2px]` (stepped, no continuous bezier overshoot).
  - Border transitions to Tarnished Gold (`#C9A24B`) or Cinnabar Ember (`#B8283D`).
  - Subtle stepped drop shadow expands: `box-shadow: 4px 4px 0px 0px #0B0A10, 6px 6px 0px 0px #8B1E2D`.

### 5.2 Buttons

#### Primary CTA (Blood Relic Button)
- Background: Blood Crimson (`#8B1E2D`).
- Text: Bone Parchment (`#D9D2C3`), bold, pixel or monospace font.
- Border: 2px solid `#5C121D` (dark crimson bottom/right) and `#B8283D` (light crimson top/left) for an authentic 90s pixel bevel.
- Shadow: `2px 2px 0px #000000`.
- Active/Pressed: `translate-x-[2px] translate-y-[2px] shadow-none`.

#### Secondary Button (Gilded Obsidian)
- Background: Obsidian Charcoal (`#15121C`).
- Text: Tarnished Gold (`#C9A24B`).
- Border: 2px solid `#C9A24B`.
- Hover: Background `#241C2E`, border `#DFB75E`, text `#DFB75E`.

#### Ghost / Icon Button
- Background: Transparent.
- Border: 1px solid `#2A2236`.
- Minimum tap area: `44px x 44px` on mobile screens.

### 5.3 Sticky HUD Navigation Bar
- Fixed / Sticky at the top of the viewport with high z-index (`z-50`).
- Background: Obsidian Charcoal (`#15121C`) at 95% opacity with crisp 2px bottom border `#2A2236`.
- Layout:
  - Left: Relic crest / logo avatar + Title ("PORTFOLIO" or personal name) in Pixel Display font.
  - Center/Right: Tab buttons (**Contact**, **Information**, **Posts**).
- Tab Interaction:
  - Smooth scroll to target anchor (`#contact`, `#information`, `#posts`).
  - Active Tab: Blood Crimson underline or gilded pixel bracket `[ POSTS ]` with gold text.
- Mobile View:
  - Screen width < 768px collapses tabs into a dedicated pixel hamburger menu icon.
  - Dropdown opens a full-width gothic pixel menu drawer with high contrast and 48px tap targets.

### 5.4 Profile & Relic Frame
- Profile photo framed in a gothic stone/iron pixel art frame.
- Subtle flame or ember particles (CSS or sprite) framing the borders, respecting `prefers-reduced-motion`.
- Bio section with clear typography, location badge with pixel pin icon, and clean status indicator ("Available for quests / projects").

### 5.5 Skill Grid
- Grid of 7 core skills: **Photoshop, Illustrator, Figma, VS Code, Next.js, Node.js, Kotlin**.
- Responsive grid: 2 cols (mobile) -> 4 cols (tablet) -> 7 cols or flexible wrap (desktop).
- Card structure: Pixel icon container (32x32px or 48x48px sprite) + skill name label.
- Hover effect: Subtle gold border illumination and tooltip with proficiency/role note.

### 5.6 Admin UI Components (Operate Mode)
- **Top Header:** Admin badge, quick preview link to live site, logout button.
- **Data Tables:** Dense, high-contrast rows (`#15121C` alternating with `#1A1624`), 1px borders, status chips (Draft: Ash Violet, Published: Gold).
- **Form Controls:**
  - Dark inputs (`#0B0A10`) with Bone Parchment text.
  - Border: 1px solid `#3B324D`.
  - Focus: 2px solid `#C9A24B` with zero blur glow.
  - Character counters and helper text in Muted Ash (`#8A8397`).

---

## 6. Responsive Layout Breakpoints

Layout reflow follows deliberate structural shifts rather than scaling down desktop elements:

| Breakpoint | Target Canvas | Navbar | Posts Grid | Skill Grid | Information Layout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile (`< 640px`)** | Small phone (360px–639px) | Pixel Hamburger menu | 1 Column stacked | 2–3 Columns compact | Vertical stack: photo centered, bio below |
| **Tablet (`640px–1023px`)** | Tablets & small laptops | Visible tabs compact | 2 Columns grid | 4 Columns grid | Side-by-side photo & bio summary |
| **Desktop (`≥ 1024px`)** | Standard laptop / desktop | Full HUD bar with status | 3 Columns grid | 7 Columns or structured row | Two-column asymmetric hero / bio layout |
| **Wide (`≥ 1280px`)** | Large displays | Max container 1200px | 3 Columns spacious | Structured layout | Max container centered with gothic margins |

---

## 7. Motion, Animations & Sprite System

Animations in this design system must evoke 16-bit dark fantasy games without causing cognitive distraction or performance lag.

### 7.1 Stepped Timing Functions
Avoid smooth cubic-beziers for decorative elements. Use stepped timing to preserve the pixelated character:
```css
/* Example for sprite torches, blinkers, or border shifts */
animation-timing-function: steps(4);
```

### 7.2 Micro-Interactions
- **Button Hover/Click:** 1-frame physical step down (`transform: translateY(2px)`).
- **Skill Tooltip:** Instantaneous 1-frame appear with 2px gold border.
- **Section Dividers:** Decorative pixel chain / rune divider with subtle pulse.

### 7.3 Motion Accessibility (`prefers-reduced-motion`)
All animations must strictly obey user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Anti-Slop Writing & Copy Guidelines

Public-facing copy must maintain an authentic, dignified, and compelling voice.

### Forbidden Buzzwords
- *Unlock, elevate, empower, delve, showcase, testament, revolutionize, cutting-edge, next-level, game-changer, seamless, robust, journey, landscape.*

### Tone Directives
- **Direct & Honest:** State what was built, what tools were used, and what problem was solved.
- **Thematic Flourishes in Moderation:** Use subtle dark fantasy flavor in navigation, section headers, or empty states ("Grimoire of Works", "Relic Archives", "Send a Raven / Contact"), but keep project descriptions, credentials, and technical facts strictly clear, accurate, and professional.
- **No Fabricated Claims:** Zero fake client testimonials, unsourced stats, or generic placeholder quotes.

---

## 9. Quality & Performance Verification Floor

- **Lighthouse Performance:** Target ≥ 85 on mobile 4G.
- **Lighthouse Accessibility:** Target ≥ 90 on all public pages.
- **Largest Contentful Paint (LCP):** ≤ 2.5s via Next.js image optimization.
- **Pixel Crispness:** All sprite assets, badges, and frames must declare `image-rendering: pixelated; image-rendering: crisp-edges;`.
- **Keyboard Navigation:** Tab focus states must remain clearly visible across all interactive components with a 2px high-contrast outline (`#C9A24B` or `#B8283D`).
