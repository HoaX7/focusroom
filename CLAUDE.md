# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Focusroom is a focus/productivity application that helps users "lock-in" and build without distractions. It combines collaborative rooms, deep work tracking, and integrated background music (YouTube playlists) to create focused work sessions.

## Tech Stack

- **Frontend Framework**: React 19 with TanStack Start (SSR framework)
- **Router**: TanStack Router (file-based routing)
- **Database**: Cloudflare D1 (SQLite) with Kysely query builder
- **Authentication**: Better Auth with GitHub and Google OAuth providers
- **State Management**: TanStack Store for client-side state + TanStack DB for local collections
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Deployment**: Cloudflare Workers (hosted at focusroom.dev)
- **Package Manager**: pnpm

## Development Commands

```bash
# Local development (Vite dev server)
pnpm dev

# Development with Cloudflare Workers emulation
pnpm wrangler:dev

# Build for production (runs Vite build + TypeScript check)
pnpm build

# Lint and format code
pnpm lint        # Auto-fix with Biome
pnpm lint:check  # Lint only (no fix)

# Deploy to Cloudflare
pnpm deploy      # Builds and deploys to production

# Database operations
pnpm create-db      # Create new D1 database
pnpm apply-db       # Apply migrations to database
pnpm cf-typegen     # Generate Cloudflare types for Env interface
```

## Architecture

### Server Architecture

The app runs on Cloudflare Workers using TanStack Start's SSR capabilities. The server entry point is `src/server.ts`, which delegates to TanStack's handler. The application is configured via `wrangler.json` for Cloudflare-specific settings.

### Database Layer

Database access is split into two contexts:

1. **Server-side DB** (`src/db/index.ts`): Uses Kysely with D1Dialect, initialized via `initDb()` which pulls the D1 binding from `cloudflare:workers` env
2. **Client-side Collections** (`src/lib/tanstackDB/collections.ts`): Uses TanStack DB for local storage persistence (e.g., YouTube playlists)

Migrations are in `migrations/` directory:
- `001_better_auth_tables.sql` - Better Auth schema
- `002_rooms_tables.sql` - Room and user_room tables
- `003_deep_work_tables.sql` - Deep work tracking table

### Authentication Flow

Authentication is handled by Better Auth (`src/lib/auth.ts`):
- **Server**: `serverAuth(env)` creates a singleton auth instance with D1 database dialect
- **Client**: `authClient` from `src/lib/authClient.ts` provides React hooks
- **Providers**: GitHub and Google OAuth (configured with environment variables)
- **Integration**: Uses `reactStartCookies()` plugin for TanStack Start compatibility

The auth instance is initialized lazily on the server and maps social provider profiles to user names.

### State Management

Two state management approaches are used:

1. **TanStack Store** (`src/lib/store/index.ts`):
   - Utility functions: `createStore()`, `updateStore()`, `initStore()` with localStorage persistence
   - Example: `ytPlayerInfo` store in `src/lib/store/yt.ts` for YouTube player state

2. **TanStack DB Collections** (`src/lib/tanstackDB/collections.ts`):
   - Typed local collections with Zod schemas
   - Example: `playlistCollection` for managing YouTube playlists with localStorage backend

### Routing Structure

File-based routing via TanStack Router:
- Routes are in `src/routes/` directory
- `__root.tsx` provides the root layout with SEO, styling, and toast notifications
- `index.tsx` is the main application page
- `login.tsx` handles authentication flow
- `api.auth.$.ts` is the Better Auth API route handler

Route tree is auto-generated in `routeTree.gen.ts`.

### Component Architecture

Components are organized by purpose:
- `src/components/ui/` - Reusable UI primitives (mostly Radix UI wrappers with Tailwind styling)
- `src/components/main/` - Main application features (timer, focus mode, playlists, music selector, config)
- `src/components/videoPlayer/` - YouTube player integration
- `src/components/confetti/` - Celebration effects

### Environment Configuration

Required environment variables (set in Cloudflare Workers settings):
- `BETTER_AUTH_SECRET` - Secret for Better Auth
- `BETTER_AUTH_URL` - Base URL for auth callbacks
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth

Database binding is configured in `wrangler.json` as `DB`.

## Key Patterns

### Database Queries

Always use Kysely for type-safe database queries:

```typescript
import { initDb } from '@/db';

const db = initDb<DatabaseSchema>();
const result = await db.selectFrom('room').where('user_id', '=', userId).execute();
```

### Authentication Guards

Use Better Auth's session helpers to protect routes and API endpoints. The auth instance is available via `serverAuth(env)`.

### Client State with Persistence

For client-side state that needs localStorage persistence:
- Simple state: Use `initStore()` pattern from `src/lib/store/`
- Complex collections: Use TanStack DB collections with Zod schemas

### Path Aliases

The project uses `@/*` path alias for `src/*` (configured in `tsconfig.json`). Always use this for imports.

## Database Schema Notes

- All tables use TEXT PRIMARY KEY for IDs (not auto-increment)
- Timestamps are stored as INTEGER (Unix epoch) with automatic defaults
- Foreign keys use CASCADE deletion
- The `room` table has a unique slug for URL routing
- The `deep_work` table stores locked-in hours as TEXT (likely JSON-encoded per day)
- The `visibility` field in `room` is TEXT enum: 'public' | 'private'

## Cloudflare Workers Considerations

- The app uses `nodejs_compat` compatibility flag for Node.js APIs
- Observability is enabled in `wrangler.json`
- Main entry is `@tanstack/react-start/server-entry` (not a custom server file)
- Custom domain configured: focusroom.dev
- Workers dev preview is disabled (`workers_dev: false`)
