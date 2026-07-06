# AGENTS.md

Guide for AI agents working in the YYC³-Med (YYC3-Medical) repository. Distilled from observed config, source, and docs — not invented.

## Project At-a-Glance

- **What**: YYC³-Med — AI-powered medical intelligent diagnosis platform (智能诊疗系统). UI is bilingual (primarily zh-CN, with en-US/ja-JP/ko-KR i18n).
- **Framework**: Next.js 16 (App Router) + React 18.3 + TypeScript (strict).
- **Deployment target**: **Static export** (`output: 'export'` in `next.config.mjs`) → GitHub Pages at `medical.yyc3.vip`. Build emits to `out/`. **Offline-buildable** (uses GeistSans self-hosted font).
- **Package manager**: **pnpm 9** locally (declared in `packageManager`). Node `>=18.17.0`. All CI workflows unified on pnpm.
- **Status**: Frontend-only / mock-data. `lib/db.ts` is a placeholder; `prisma/schema.prisma` describes a future MySQL backend but is **not wired into the build**.
- **Gates (as of 2026-07-06, post phase-0 止血)**: `tsc --noEmit` clean (0 errors) / `eslint .` = 0 errors, **225 warnings** / `jest` = **141 tests passing across 8 suites** / `next build` = green offline.
  - 覆盖率基线(实测): statements **29.51%** / branches **63.25%** / functions **28.2%** / lines **29.84%**;`jest.config.js` 阈值已上调至 26–60 区间防回退。
  - store 已收敛为 3 个文件(`index.ts` + `useAuthStore` + `useSettingsStore`);`useNotificationStore` / `usePatientStore` 已在阶段零删除。

## Essential Commands

```bash
pnpm install              # install deps (frozen lockfile in CI)
                          # ⚠️ 历史坑(2026-07-06 已修复):
                          # 全局 pnpm 配置 ~/Library/Preferences/pnpm/{rc,config.yaml}
                          # 曾硬编码 storeDir=/Volumes/Development/.pnpm-store (失效卷),
                          # 导致所有 pnpm 命令报 EACCES mkdir /Volumes/Development。
                          # 已统一改为 /Users/yanyu/.pnpm-store。如复现请检查这两个文件。
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
  providers.tsx, RootLayoutClient.tsx, dashboard-layout.tsx
                           ⚠️ 以上 3 个文件已在阶段零(2026-07-06)删除,根 layout 直接挂载 provider 树
components/                ~439 components, feature-grouped
  ui/                      shadcn/ui primitives (Radix-based)
  layout/                  page-breadcrumb(原 app-shell/app-header/sidebar-nav/keyboard-shortcuts-dialog 已删除)
  auth/, admin/, ai-diagnosis/, patients/, analytics/, ...
  brand/                   logos, slogan, identity system
  index.ts                 BARREL file re-exporting many components
contexts/                  React Context providers (language, loading,
                           user-avatar, auto-translation, automatic-execution)
hooks/                     19 custom hooks + index.ts barrel
lib/                       utils.ts (cn, formatDate, debounce, etc.),
                           api/, auth/jwt.ts, i18n/, storage/, offline/,
                           env.ts, db.ts (placeholder), seo-config.ts
services/                  domain service modules (case-library, ai-annotation,
                           pharmacogenomics, etc.) + index.ts barrel
store/                     Zustand stores (阶段零后): useAuthStore, useSettingsStore + index.ts barrel
                           ⚠️ useNotificationStore / usePatientStore 已删除
types/                     TS type definitions + index.ts barrel
i18n/                      medical-terms.ts, translations.ts
messages/                  en.json, zh.json (next-intl message catalogs)
prisma/                    schema.prisma (MySQL — future backend) + *.sql
scripts/                   build/check/audit scripts + SQL migrations.
                           EXCLUDED from tsconfig + ESLint (see gotchas).
public/                    static assets, yyc3-icons/, manifest.json, CNAME
packages/web, packages/mobile   placeholder sub-packages (own package.json)
docs/                      developer-guide.md, naming-conventions.md,
                           feature-manifest.ts, plus YYC3 team specs (zh)
tests/, __tests__/         Jest test files (mirror source layout:
                           __tests__/lib/, __tests__/hooks/,
                           __tests__/store/, __tests__/components/)
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

### State Management

- **Zustand** for global stores (`store/use*Store.ts`), several using `persist` middleware.
- **React Context** for cross-tree providers (see `contexts/`).
- **React Hook Form + zod** for form state/validation.

## Testing

- **Runner**: Jest via `next/jest` (`jest.config.js`), jsdom environment.
- **Setup**: `jest.setup.js` provides:
  - `@testing-library/jest-dom` matchers
  - Mocks for `next/router`, `next/navigation`, `next/image`
  - Polyfills for `IntersectionObserver`, `ResizeObserver`, `window.matchMedia`
- **Library**: `@testing-library/react` + `@testing-library/user-event`.
- **Test roots**: `<rootDir>/app` and `<rootDir>/__tests__`.
- **Coverage**: collected from `components/`, `app/`, `lib/`, `hooks/`, `services/`. Threshold raised in phase-0 (2026-07-06) from 1% to current baseline (statements 27% / branches 60% / functions 26% / lines 28%) to prevent regression. 实测(2026-07-06): statements 29.51% / branches 63.25% / functions 28.2% / lines 29.84%. Per-module highlights: lib/utils 94%, lib/array 96%, lib/validation 87%, hooks/useDebounce 100%, hooks/usePagination 92%, store/useAuthStore fully covered. Plan: 阶段一出口 ≥40%, 阶段二出口 ≥60%, 终态 70%. Update `jest.config.js` threshold comment when raising.
- Test files use the `*.test.tsx` / `*.test.ts` suffix.
- Test count (2026-07-06): **141 passing** across 8 suites.

Run a single test: `pnpm test -- <path-or-pattern>`.

## i18n

- Supported locales: `zh-CN` (default), `en-US`, `ja-JP`, `ko-KR` — see `lib/i18n/config.ts`.
- Two parallel systems exist:
  1. `contexts/language-context.tsx` + `hooks/use-translation.ts` (custom inline dictionaries).
  2. `lib/i18n/dictionaries/*.json` + `messages/{en,zh}.json` (next-intl catalogs).
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

**Note**: As of 2026-07-04, **all CI workflows have been migrated to pnpm** (no more npm/`--legacy-peer-deps` inconsistency). Node 20 is pinned across all workflows. The `pnpm build` step in `ci.yml` is the only strict gate; format-check in `ci.yml` uses `\|\| true` (non-blocking).

## Gotchas & Non-Obvious Patterns

1. **Static export means no backend**. Any code referencing real DB, JWT verification server-side, or API routes is aspirational. `lib/db.ts` is a placeholder; `lib/auth/jwt.ts` and `utils/jwt.ts` exist but cannot run in a server context here.

2. **`scripts/` is excluded** from both `tsconfig.json` `include` paths (via `exclude`) and ESLint (configured in `eslint.config.js` `ignores`). It contains a mix of TS/JS/SQL/Python/TSX — treat it as standalone tooling, not part of the app build. Don't import from it into `app/`/`components/`.

3. **ESLint 9 flat config** (phase-7): config lives in `eslint.config.js`, not `.eslintrc.json`. Stack: `eslint@9` + `eslint-config-next@16` + `typescript-eslint@8`. Next 16 ships native flat config arrays; no `@eslint/eslintrc` FlatCompat shim needed. New `react-hooks` v7 rules (`set-state-in-effect`, `purity`, `immutability`, `preserve-manual-memoization`, `static-components`) are downgraded to `warn` — tracked but not blocking; cleanup is future work. ESLint also ignores `_pages/`, `_api_routes/`, `_entities/`, `_middleware_dir/` (legacy directories that were renamed/removed during the static-export migration — the underscore prefix is the convention to "park" them).

4. **`docs/developer-guide.md`** — rewritten in phase-6 to match current stack (Next 16, pnpm, static export, GeistSans font).

5. **`docs/naming-conventions.md`** — rewritten in phase-6 to reflect actual kebab-case dominance; new code MUST use kebab-case.

6. **Next.js version**: `package.json` resolves to Next 16.x; README/AGENTS synchronized. No drift.

7. **`app/(auth)` and `app/(medical)` are route groups** (parens) — they organize without affecting the URL. `(auth)/login/page.tsx` serves `/login`.

8. **Barrel re-export collisions**: `components/index.ts` intentionally skips some modules (e.g. `medical-button`) to avoid `ButtonProps`/`buttonVariants` collisions with `ui/button`. Read the comments in barrel files before adding new re-exports.

9. **Environment variables** (`lib/env.ts`): `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_VERSION`. `NEXT_PUBLIC_SHOW_PERFORMANCE_MONITOR=true` enables the floating perf monitor in `RootLayoutClient`.

10. **Provider stacking** in `app/layout.tsx` is fixed: Theme → Language → Loading → UserAvatar → AutoTranslation → AutomaticExecution → children + Toaster. Adding a new global provider means editing this tree.

11. **`tsconfig.json` `target: "es2017"`, `lib: ["dom","dom.iterable","es6"]`** — deliberately conservative. Don't bump without testing the static export.

12. **`turbo.json`** declares lint/build/test pipeline but this is effectively a single-package repo (the `packages/web` + `packages/mobile` subpackages are placeholders with only `package.json`). Turborepo caching still applies.

13. **`prisma/schema.prisma`** uses MySQL and is not part of the build. SQL migrations live in both `prisma/*.sql` and `scripts/*.sql`.

14. **Husky v9** pre-commit uses `.husky/_/husky.sh` via the legacy shim. If hooks misbehave after dependency updates, check `lint-staged` config in `package.json` (`*.{ts,tsx}` → eslint --fix + prettier --write).

15. **`lib/logger.ts`** provides `debug()` helper — always use this instead of `console.log()` in `app/`/`components/`/`services/`. `console.error`/`console.warn` are allowed everywhere.

16. **`any` audit**: see `docs/tech-debt/any-audit.md` for the full list of `any` occurrences. Do not add new `any` without justification; prefer `unknown` + type guard.

17. **Same-name cross-directory components** (9 pairs as of phase-4) are legitimate domain variants (e.g. `admin/settings/settings-client.tsx` for admin UI vs `settings/settings-client.tsx` for user UI). Don't try to merge them. See `docs/naming-conventions.md` for the policy.

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

Recent commit style example: `fix(qa): 阶段一基线止血 — lint/test 全绿，type errors -62% (719→274)`. Scoped conventional commits with zh-CN descriptions are common.

## When You're Asked to Make Changes

1. `pnpm install` if pulling fresh.
2. Read the relevant `app/<route>/page.tsx` + its `*-client.tsx` counterpart + the component(s) under `components/<feature>/`.
3. Use `@/` imports; respect existing barrel files.
4. After changes, run: `pnpm type-check && pnpm lint && pnpm test && pnpm build`. The **build must succeed** (it's the only hard CI gate).
5. Do not add API routes, middleware, or server-only code — it will break `output: 'export'`.
6. Do not introduce inline styles or non-Tailwind styling.
7. Don't mass-rename files; match local naming.
8. Don't commit unless explicitly asked. Don't push unless explicitly asked.
