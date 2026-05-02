# Gamibe

Gamify-style **personal finance** dashboard shipped as a **Vue 3 + Vite + TypeScript** PWA, backed by **Firebase Auth** and **Firestore** (collections for bills, earnings, savings, transactions, and profiles).

This repo is a **small monorepo**: the deployed product lives in `./gamibe`. The `./gamibe-legacy` package is an older **Next.js 12 / T3 / Prisma / tRPC** scaffold kept for reference; it expects PostgreSQL plus NextAuth and is not required to run or build the current app.

## Tech stack · current app (`gamibe/`)

- Vue 3, Vue Router, Pinia
- VueFire / Firebase SDK (Auth + Firestore)
- Tailwind CSS, VCalendar, Chart.js (`vue-chartjs`)
- vite-plugin-PWA with Workbox
- Icons: `@heroicons/vue`, `oh-vue-icons`

## Quick start · current app

```bash
pnpm install
cp gamibe/.env.example gamibe/.env.local
# Fill in Firebase values from the Firebase console (Web app config).

pnpm dev
# or explicitly:
pnpm dev:gamibe
```

Open Vite dev server URL (typically [http://localhost:5173](http://localhost:5173)).

## Scripts (repo root · pnpm workspace)

| Command | Description |
| --- | --- |
| `pnpm dev` / `pnpm dev:gamibe` | Run Vite dev server for `./gamibe` |
| `pnpm build` / `pnpm build:gamibe` | Type-check + production build (+ PWA artifacts in `gamibe/dist`) |
| `pnpm lint` / `pnpm lint:gamibe` | ESLint (`gamibe/` only — no autofix by default) |
| `pnpm typecheck:gamibe` | Vue + TS `--noEmit` |
| `pnpm preview:gamibe` | Preview built static output |
| `pnpm dev:legacy` | Legacy Next.js dev (requires `./gamibe-legacy/.env`; see `.env.example` there) |
| `pnpm build:legacy` | Legacy production build (**requires env + DB**) |

Package manager **must be pnpm** (see workspace `packageManager` field).

## Environment · `gamibe/`

Use **`.env.local`** (already gitignored via `*.local` / `.env.*`). Variables are prefixed with `VITE_*` because they configure the Firebase **Web SDK** embedded in the client bundle:

- `VITE_FIREBASE_*` — Firebase web app constants from the Firebase console.

Copy from `gamibe/.env.example` and fill placeholders. Rotate keys if past versions leaked them elsewhere.

### Legacy workspace · `gamibe-legacy/`

Copy `gamibe-legacy/.env.example` → `.env` (or `.env.local` per Next 12 norms). Builds validate `DATABASE_URL`, `NEXTAUTH_*`, and Google OAuth credentials via the T3 env schema — the app will not compile without valid values pointing at PostgreSQL.

## Deploying · Vercel

The SPA uses `gamibe/vercel.json` to rewrite routes to `/` for Vue Router history mode. Typical settings:

1. Root directory **`gamibe`**
2. Install `pnpm install` at repo root, or configure install command appropriately for a monorepo
3. Build command **`pnpm run build`** from repo root **or** `cd .. && pnpm run build --filter gamibe` depending on dashboard configuration
4. Output directory **`gamibe/dist`**
5. Set Firestore-backed `VITE_FIREBASE_*` env vars per environment

Adapt to your preferred Vercel monorepo pattern (often “root” stays repo root + custom build).

## Repo layout

```
gamibe/
  gamibe/           # ★ Vue 3 PWA (production app)
  gamibe-legacy/    # Next.js 12 T3 scaffold (PostgreSQL / NextAuth)
pnpm-workspace.yaml
package.json       # Workspace scripts only
```

## Portfolio note

Demonstrates SPA architecture, reactive finance flows (bills/savings/charts), Firebase integration, Tailwind-heavy UI composition, Vite+PWA toolchain, and a clean separation between a modern client-heavy app and a legacy full-stack scaffold.
