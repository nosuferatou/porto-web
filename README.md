# The Obsidian Reliquary

Personal portfolio site with a dark fantasy pixel art direction. Built with the Next.js App Router, TypeScript, Tailwind CSS, SQLite, and Prisma.

## Local setup

Requires Node.js 20+.

```bash
npm install
npm run db:migrate   # apply migrations to prisma/dev.db
npm run db:seed      # profile, skills, contacts, sample posts, admin user
npm run dev
```

Open http://localhost:3000. The admin console is at http://localhost:3000/admin/login.

Seed credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` when you run `npm run db:seed`. If `ADMIN_PASSWORD` is unset, the seed script uses its development default and prints a warning. Set both variables and re-seed before exposing the site.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Seed the local database |

## Storage notes

The database (`prisma/dev.db`) and uploaded images (`public/uploads/`) are local development storage and are git-ignored. A deployment that cannot persist the local filesystem needs an external database and object storage; the current image upload route writes to disk.
