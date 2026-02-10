# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Nuxt 4 application: `pages/` for file-based routing, `components/`, `assets/`, and shared `utils/`.
- `public/` holds static assets served as-is (e.g., `public/robots.txt`).
- `prisma/` contains the database schema at `prisma/schema.prisma` and migrations.
- Nuxt generates build artifacts in `.nuxt/` and Prisma client output lives in `app/generated/prisma`.

## Build, Test, and Development Commands
Use Bun as the package manager.
- `bun dev` starts the Nuxt dev server.
- `bun build` produces a production build.
- `bun generate` creates a static site build.
- `bun preview` serves the production build locally.
- `bunx prisma migrate dev` runs database migrations (add `--name <name>` for named migrations).
- `bunx prisma db push` syncs schema changes without migrations.
- `bunx prisma studio` opens Prisma Studio.
- `bunx prettier --write .` formats the codebase.

## Coding Style & Naming Conventions
- TypeScript + Vue 3 (Nuxt 4). Follow existing file-based routing and component naming in `app/`.
- Formatting is handled by Prettier with `prettier-plugin-prisma`.
- Use consistent, descriptive names for pages and components (e.g., `app/pages/map.vue`, `app/components/MapCard.vue`).

## Testing Guidelines
- No dedicated test framework or test directories are present. If adding tests, document the chosen framework and add scripts to `package.json`.

## Commit & Pull Request Guidelines
- Commit history suggests Conventional Commits (e.g., `feat: ...`). Follow this format for new commits.
- PRs should include a clear summary, steps to verify, and screenshots for UI changes.

## Configuration & Data
- The database uses PostgreSQL via Prisma. Ensure `DATABASE_URL` is set in the environment.
- Prisma Client imports should use the non-standard path: `import { PrismaClient } from "~/generated/prisma"`.
