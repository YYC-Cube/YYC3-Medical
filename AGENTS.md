# AGENTS.md

Guide for AI agents working in the YYC³-Med (YYC3-Medical) repository. Distilled from actual config, source, and tooling — not invented.

## Project At-a-Glance

- **What**: YYC³-Med — AI-powered medical intelligent diagnosis platform (智能诊疗系统). UI is bilingual (primarily zh-CN, with en-US/ja-JP/ko-KR i18n).
- **Framework**: Next.js 16.2 (App Router) + React 18.3 + TypeScript 5.8 (strict).
- **Deployment target**: **Static export** (`output: 'export'` in `next.config.mjs`) → GitHub Pages at `medical.yyc3.vip`. Build emits to `out/`. **Offline-buildable** (uses GeistSans self-hosted font).
- **Package manager**: **pnpm 9** locally (declared in `packageManager`). Node `>=18.17.0`. All CI workflows unified on pnpm.
- **Status**: Frontend-only / mock-data. `lib/db.ts` is a placeholder; `prisma/schema.prisma` describes a future MySQL backend but is **not wired into the build**.
- **Gates (as of 2026-07-06)**: `tsc --noEmit` clean / `eslint .` = 0 errors, 237 warnings / `jest` = **311 tests passing across 16 suites** / `next build` = green (~25 MB static export).

## Essential Commands

```bash
pnpm install              # install deps (frozen lockfile in CI)
                          # ⚠️ if "No projects found in /Users/yanyu", use:
                          #    pnpm install --ignore-workspace
                          # (parent /Users/yanyu/pnpm-workspace.yaml hijacks workspace root)
pnpm dev                  # dev server with Turbopack (next dev --turbo)
pnpm build                # static export → out/
pnpm start                # preview production build
pnpm lint                 # ESLint (eslint .)
pnpm lint:fix             # ESLint with --fix
pnpm type-check           # tsc --noEmit --incremental
pnpm format               # Prettier write
pnpm format:check         # Prettier check
pnpm test                 # Jest
pnpm test:watch           # Jest watch mode
pnpm clean                # clear .next + node_modules/.cache
pnpm clean:all            # rm node_modules + .next, reinstall
pnpm analyze              # build with ANALYZE=true
```

Pre-commit hook (`.husky/pre-commit`) runs `lint-staged` → `eslint --fix` + `prettier --write` on staged `*.{ts,tsx}`.

## Critical Architectural Constraints

**This is a static export site.** The following are **forbidden / will not work**:

- Next.js API routes (`app/api/...`)
- Middleware (`middleware.ts`)
- Server actions, dynamic server rendering, `cookies()`, `headers()` in render
- `revalidate` / ISR
- Any runtime-only backend code

When adding features, default to **client components** (`"use client"`) for anything needing browser APIs, interactivity, or context. Keep route `page.tsx` / `layout.tsx` as server components when possible (metadata export, static shell) and delegate interactive work to `*-client.tsx` children.

## Repository Layout

```
app/                       Next.js App Router pages (112 routes)
  (auth)/                  route group: login/register/reset/forgot-password
  (medical)/               route group: medical module layouts
  admin/                   admin dashboard + submodules (users, roles, logs,
                           tasks, settings, monitoring, backup, api-config,
                           deployment-check, certifications, ai-models, etc.)
  ai-diagnosis/, ai-model/, ai-model-training/
  patients/                includes [id] dynamic route + layout/loading
  case-library/            includes [id] dynamic route (SSG)
  analytics/, clinical-decision/, medications/, research/
  health-data/, ehr-integration/, teleconsultation/
  security/, certifications/, knowledge-base/, knowledge-graph/
  mobile-app/, brand/, ui-showcase/, dev/
  layout.tsx               root layout — wires Theme/Language/Loading/
                           UserAvatar/AutoTranslation/AutomaticExecution
                           providers + Toaster
components/                441 components, feature-grouped
  ui/                      shadcn/ui primitives (Radix-based)
  layout/                  app-shell, app-header, sidebar-nav, breadcrumb
  auth/, admin/, ai-diagnosis/, patients/, analytics/, ...
  brand/                   logos, slogan, identity system
  index.ts                 BARREL file re-exporting many components
contexts/                  React Context providers (language, loading,
                           user-avatar, auto-translation, automatic-execution)
hooks/                     19 custom hooks + index.ts barrel
lib/                       utils.ts (cn, formatDate, debounce, etc.),
                           api/, auth/jwt.ts, i18n/, storage/, offline/,
                           env.ts, db.ts (placeholder), seo-config.ts
services/                  31 domain service modules + index.ts barrel
store/                     Zustand stores: useAuthStore, useNotificationStore,
                           useSettingsStore + index.ts barrel
types/                     TS type definitions + index.ts barrel
i18n/                      medical-terms.ts, translations.ts
prisma/                    schema.prisma (MySQL — future backend) + *.sql
scripts/                   build/check/audit scripts + SQL migrations.
                           EXCLUDED from tsconfig + ESLint (see gotchas).
public/                    static assets, yyc3-icons/, manifest.json, CNAME
docs/                      developer documentation + team specs
tests/, __tests__/         Jest test files (mirror source layout:
                           __tests__/lib/, __tests__/hooks/,
                           __tests__/store/, __tests__/components/,
                           __tests__/services/)
.github/workflows/         ci.yml, deploy.yml, test.yml, lint.yml,
                           audit.yml, codeql.yml, njsscan.yml,
                           turbo-cache.yml
```

## Code Conventions

### Imports & Path Aliases

- Path alias: `@/*` → repo root (configured in `tsconfig.json` paths and `jest.config.js` `moduleNameMapper`).
- Barrel files exist at `components/index.ts`, `hooks/index.ts`, `store/index.ts`, `types/index.ts`, `contexts/index.ts`, `services/index.ts`. Prefer importing from these where possible.
- shadcn/ui aliases (from `components.json`): `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.
- Import order convention: React/Next → third-party → `@/` internals → relative → types → styles.

### File Naming (observed reality)

The repo is **inconsistent** with `docs/naming-conventions.md`. What's actually in the tree:

- Most components: **kebab-case** `.tsx` (e.g. `patient-card.tsx`, `case-detail-client.tsx`).
- A handful of legacy components: **PascalCase** `.tsx` (e.g. `AuthGuard.tsx`, `LoginForm.tsx`, `PatientList.tsx`, `ModelReport.tsx`).
- Pages/layouts: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Hooks: `use-*.ts` / `use-*.tsx`.
- Non-component TS: `camelCase.ts` (e.g. `patientService.ts`) or `kebab-case.ts`.
- Types: `PascalCase.ts` in `types/`.

**Guidance**: Follow kebab-case for new component files. Match the surrounding directory's existing style when editing. Do not mass-rename.

### Client vs Server Components

- Pages default to server components — export `metadata`, render static shell, delegate to a `*-client.tsx` child for interactivity (this pattern is pervasive: `admin-client.tsx`, `tasks-client.tsx`, `settings-client.tsx`, etc.).
- Add `"use client"` at the top only when needed (hooks, browser APIs, event handlers, context consumers).

### Styling

- **Tailwind CSS 3 only** — no inline styles.
- Theme colors use CSS variables (`hsl(var(--primary))` etc.) defined in `app/globals.css`.
- `cn()` helper from `@/lib/utils` (clsx + tailwind-merge) for conditional classes.
- shadcn/ui primitives in `components/ui/` — Radix-based, customized via `components.json`.
- Dark mode: class strategy (`darkMode: ["class"]`), wired through `next-themes` `ThemeProvider`.
- **Medical-grade color system**: primary blue (#2563eb), secondary teal (#06b6d4), accent green. Dark mode uses deep navy (`222 47% 11%`), **never pure black**. Semantic tokens: `--success`, `--warning`, `--info`.

### State Management

- **Zustand** for global stores (`store/use*Store.ts`), several using `persist` middleware.
- **React Context** for cross-tree providers (see `contexts/`).
- **React Hook Form + zod** for form state/validation.

## Testing

- **Runner**: Jest 29 via `next/jest` (`jest.config.js`), jsdom environment.
- **Setup**: `jest.setup.js` provides:
  - `@testing-library/jest-dom` matchers
  - Mocks for `next/router`, `next/navigation`, `next/image`
  - Polyfills for `IntersectionObserver`, `ResizeObserver`, `window.matchMedia`
- **Library**: `@testing-library/react` + `@testing-library/user-event`.
- **Test roots**: `<rootDir>/app` and `<rootDir>/__tests__`.
- **Coverage**: statements 41.8%, branches 64.6%, functions 42.5%, lines 42.4%. Threshold set in `jest.config.js` with a documented plan to ramp toward 70%.
- Test files use the `*.test.tsx` / `*.test.ts` suffix.
- Test count (2026-07-06): **311 passing** across 16 suites.

Run a single test: `pnpm test -- <path-or-pattern>`.

## i18n

- Supported locales: `zh-CN` (default), `en-US`, `ja-JP`, `ko-KR` — see `lib/i18n/config.ts`.
- System: `contexts/language-context.tsx` + `hooks/use-translation.ts` (custom inline dictionaries in `lib/i18n/dictionaries/*.json`).
- Medical terminology in `i18n/medical-terms.ts`. Auto-translation via `use-auto-translation` hook + `auto-translation-context`.
- Default `<html lang="zh-CN">` in root layout.

## CI/CD

| Workflow | Trigger | Notes |
|----------|---------|-------|
| `ci.yml` | push/PR to main | pnpm install, **lint**, **type-check**, format-check (`\|\| true`), **build** (the only hard gate) |
| `deploy.yml` | push to main | Builds, adds `out/.nojekyll` + `out/CNAME` (`medical.yyc3.vip`), uploads Pages artifact, deploys |
| `test.yml` | push/PR to main | pnpm install, `pnpm test -- --coverage` |
| `lint.yml` | push/PR to main | pnpm install, `pnpm lint` |
| `audit.yml` | push/PR to main | pnpm install, lint, type-check, `pnpm audit --prod --audit-level=high` (non-blocking) |
| `codeql.yml`, `njsscan.yml` | security scans | |
| `turbo-cache.yml` | turbo cache management | |

**Note**: All CI workflows use pnpm + Node 20. The `pnpm build` step in `ci.yml` is the only strict gate; format-check in `ci.yml` uses `\|\| true` (non-blocking).

## Gotchas & Non-Obvious Patterns

1. **Static export means no backend**. Any code referencing real DB, JWT verification server-side, or API routes is aspirational. `lib/db.ts` is a placeholder; `lib/auth/jwt.ts` and `utils/jwt.ts` exist but cannot run in a server context here.

2. **`scripts/` is excluded** from both `tsconfig.json` `include` paths (via `exclude`) and ESLint (configured in `eslint.config.js` `ignores`). It contains a mix of TS/JS/SQL/Python/TSX — treat it as standalone tooling, not part of the app build. Don't import from it into `app/`/`components/`.

3. **ESLint 9 flat config**: config lives in `eslint.config.js`, not `.eslintrc.json`. Stack: `eslint@9` + `eslint-config-next@16` + `typescript-eslint@8` + `eslint-plugin-jsx-a11y@6`. Next 16 ships native flat config arrays; no `@eslint/eslintrc` FlatCompat shim needed. New `react-hooks` v7 rules (`set-state-in-effect`, `purity`, `immutability`, `preserve-manual-memoization`, `static-components`) are downgraded to `warn` — tracked but not blocking.

4. **Barrel re-export collisions**: `components/index.ts` intentionally skips some modules (e.g. `medical-button`) to avoid `ButtonProps`/`buttonVariants` collisions with `ui/button`. Read the comments in barrel files before adding new re-exports.

5. **Environment variables** (`lib/env.ts`): `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_VERSION`. `NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR=true` enables the floating perf monitor.

6. **Provider stacking** in `app/layout.tsx` is fixed: Theme → Language → Loading → UserAvatar → AutoTranslation → AutomaticExecution → children + Toaster. Adding a new global provider means editing this tree.

7. **`tsconfig.json` `target: "es2017"`, `lib: ["dom","dom.iterable","es6"]`** — deliberately conservative. Don't bump without testing the static export.

8. **`turbo.json`** declares lint/build/test pipeline but this is effectively a single-package repo (the `packages/web` + `packages/mobile` subpackages are placeholders with only `package.json`). Turborepo caching still applies.

9. **`prisma/schema.prisma`** uses MySQL and is not part of the build. SQL migrations live in both `prisma/*.sql` and `scripts/*.sql`.

10. **Husky v9** pre-commit uses `.husky/_/husky.sh` via the legacy shim. If hooks misbehave after dependency updates, check `lint-staged` config in `package.json` (`*.{ts,tsx}` → eslint --fix + prettier --write).

11. **`lib/logger.ts`** provides `debug()` helper — always use this instead of `console.log()` in `app/`/`components/`/`services/`. `console.error`/`console.warn` are allowed everywhere.

12. **`any` audit**: see `docs/tech-debt/any-audit.md` for the full list of `any` occurrences. Do not add new `any` without justification; prefer `unknown` + type guard.

13. **Same-name cross-directory components** (9 pairs) are legitimate domain variants (e.g. `admin/settings/settings-client.tsx` for admin UI vs `settings/settings-client.tsx` for user UI). Don't try to merge them.

14. **pnpm config hijacking**: `~/Library/Preferences/pnpm/{rc,config.yaml}` can hijack the store directory. If `pnpm install` hangs or fails, verify `store-dir` is set to a local path, not a stale mount point.

15. **`tailwind.config.ts`** defines `xs: 425px` breakpoint in addition to standard sm/md/lg/xl/2xl. Semantic colors (`success`, `warning`, `info`) reference CSS variables from `globals.css`. Animation keyframes include `heartbeat`, `breathe`, `fade-in`, `slide-up`, `scale-in`, `shimmer`.

## Commit Conventions

Conventional Commits (enforced by convention, not tooling):

```
feat:     new feature
fix:      bug fix
docs:     documentation only
refactor: code restructuring, no behavior change
chore:    build/tooling
test:     test additions/changes
```

Scoped conventional commits with zh-CN descriptions are common (e.g. `fix(qa): 阶段一基线止血 — lint/test 全绿，type errors -62%`).

## When You're Asked to Make Changes

1. `pnpm install` if pulling fresh.
2. Read the relevant `app/<route>/page.tsx` + its `*-client.tsx` counterpart + the component(s) under `components/<feature>/`.
3. Use `@/` imports; respect existing barrel files.
4. After changes, run: `pnpm type-check && pnpm lint && pnpm test && pnpm build`. The **build must succeed** (it's the only hard CI gate).
5. Do not add API routes, middleware, or server-only code — it will break `output: 'export'`.
6. Do not introduce inline styles or non-Tailwind styling.
7. Don't mass-rename files; match local naming.
8. Don't commit unless explicitly asked. Don't push unless explicitly asked.
