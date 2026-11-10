<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Personal Portfolio Project Rules

## Project Context
- Build a personal portfolio website based on the approved PRD.
- Visual direction: Dark Fantasy Pixel Art, gothic, atmospheric, and distinctive.
- Language: English.
- The website is personal and single-admin.

## Tech Stack
- Next.js App Router
- TypeScript
- Node.js
- Tailwind CSS
- SQLite with Prisma ORM for local database development
- Local filesystem for development image storage
- No cloud database or deployment during development.

## Development Principles
- Read the PRD before implementing features.
- Use modular, reusable, maintainable components.
- Keep business logic separate from UI components.
- Do not overengineer.
- Do not install dependencies without a clear reason.
- Do not change the approved architecture without permission.
- Do not implement features outside the PRD scope without approval.
- Never overwrite or delete existing project files without reviewing them first.

## Design Rules
- Follow the Dark Fantasy Pixel Art design direction.
- Use the approved color palette from the PRD.
- Avoid generic AI-generated UI patterns.
- Prioritize visual hierarchy, readability, accessibility, and responsive design.
- Use pixel fonts selectively; prioritize readability for body text.
- Respect prefers-reduced-motion.
- Use the design-taste-frontend and impeccable skills for relevant frontend tasks.
- Apply antislop-ui, antislop-layoutmobile, and antislop-code when relevant.
- Use antislop-copywriting and antislop-human for user-facing copy.

## Next.js Rules
- Preserve the BEGIN:nextjs-agent-rules and END:nextjs-agent-rules block.
- Read relevant local Next.js documentation in node_modules/next/dist/docs/ before implementing features.
- Follow the APIs and conventions of the installed Next.js version.

## Quality Assurance
- Run ESLint after implementation.
- Run the production build to check for errors.
- Fix errors introduced by the implementation.
- Do not claim a task is complete without verifying it.

## Git
- Use conventional commit messages.
- Keep commits focused on a single logical change.
- Do not amend or rewrite commits unless explicitly requested.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
