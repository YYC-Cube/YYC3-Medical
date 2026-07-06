# Changelog

All notable changes to **YYC³-Med** (YYC³-Medical) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation

- Rewrote `README.md` to open-source standard with accurate metrics (311 tests, 441 components, 112 routes)
- Rewrote `AGENTS.md` — authoritative AI agent guide aligned to 2026-07-06 codebase state
- Rewrote `CONTRIBUTING.md` — full contributing guide with medical color system, i18n workflow, quality gates
- Deleted 9 stale/inaccurate documentation files (wrong tech stack, hardcoded metrics, one-off tools)
- Updated `scripts/database/README.md` — Node v16+ → Node 18.17+, npm/yarn → pnpm 9

### Removed

- `docs/tech-architecture.ts` — claimed Next.js 14 + PostgreSQL + Vercel (all wrong)
- `docs/project-statistics.ts` — stale hardcoded estimates
- `docs/feature-manifest.ts` — stale page/component counts
- `docs/mobile-features.ts` — listed unimplemented features as available
- `docs/route-structure-fix.md` — one-time fix already applied
- `docs/phase-completion-plan.md` — superseded by execution report
- `docs/YYC3-Med数据库审查保障系统.md` — referenced TypeORM (project uses Prisma)
- `docs/YYC3-Med模块修复指南.md` — temporary tools no longer relevant
- `docs/tech-debt/eslint-9-migration.md` — migration complete

---

## [1.1.0] - 2026-07-06

This release covers Phase 0 (build stabilization) and Phase 1 (quality ramp-up), plus a comprehensive UI/UX overhaul establishing the medical-grade design system.

### Added — Quality & Testing

- **Test suite expansion**: 141 → **311 tests** across **16 suites**
  - `lib/`: `array`, `date`, `number`, `object`, `string`, `validation`, `utils` — full unit coverage
  - `hooks/`: `useDebounce`, `usePagination`, core hooks test suite
  - `store/`: `useAuthStore`, `useNotificationStore`, `useSettingsStore` — state + persistence tests
  - `components/`: `LoginForm`, `Logo`, UI primitives (`Button`, `Card`, `Badge`, `Progress`, etc.)
  - `services/`: `ai-avatar-service`, `error-handling-service`, `translation-service`
- Coverage ramped from ~1% to **statements 41.8%, branches 64.6%, functions 42.5%, lines 42.4%**
- Coverage thresholds configured with documented +5%/month ramp toward 70%

### Added — Internationalization

- Unified i18n to **4 locales**: `zh-CN` (default), `en-US`, `ja-JP`, `ko-KR`
- Restructured dictionary files: `lib/i18n/dictionaries/*.json`
- next-intl catalogs: `messages/{en,zh}.json`
- Medical terminology glossary: `i18n/medical-terms.ts`
- Auto-translation context provider + `use-auto-translation` hook
- Language switcher component with locale persistence

### Added — UI/UX Design System

- **Medical-grade color system** (`app/globals.css` + `tailwind.config.ts`):
  - Dark mode changed from near-black (`222.2 70% 8%`) to deep navy (`222 47% 11%`) — never pure black
  - Semantic tokens: `--success`, `--warning`, `--info` (light + dark variants)
  - `--medical-gradient-soft` variable
  - Utility classes: `.medical-text-gradient`, `.glass`, `.glass-dark`
- **6 new CSS animations**: `breathe`, `heartbeat`, `fade-in`, `slide-up`, `scale-in`, `shimmer`
- **Responsive breakpoint**: added `xs: 425px` to Tailwind screens
- **Enhanced UI primitives**:
  - `Card`: hover shadow transition
  - `Progress`: medical gradient indicator with smooth animation
  - `Button`: `transition-all` + `active:scale-[0.97]` tactile feedback
  - `Badge`: success/warning/info variants using semantic tokens
  - `PageTransition`: premium cubic-bezier easing + `StaggerContainer` / `StaggerItem` exports
- **Accessibility**: `::selection`, `:focus-visible` enhancements, Firefox scrollbar styling, font antialiasing

### Added — Developer Experience

- Jest coverage configuration with category-based thresholds
- `jest.setup.js` with comprehensive mocks (next/router, next/navigation, next/image, IntersectionObserver, ResizeObserver, matchMedia)
- Pre-commit hook via Husky + lint-staged (eslint --fix + prettier --write)

### Changed — Component Architecture

- **Refactored mega-components**: Split large monolithic client components into focused, composable pieces
- **Black container elimination**: Replaced 47 instances of raw `gray-*` / `black` / `slate-*` backgrounds with medical palette tokens across 12 files
  - `app/page.tsx`, `components/top-nav.tsx`, `components/consultation-room.tsx`
  - `components/medical-records/3d-medical-viewer.tsx` (35 replacements)
  - `components/case-library/case-image-viewer.tsx`, `components/brand/logo-showcase.tsx`
  - `components/medications/`, `components/teleconsultation/`, `components/settings/`

### Changed — Infrastructure

- **CI/CD unified to pnpm**: All GitHub Actions workflows migrated from mixed npm/`--legacy-peer-deps` to pnpm with frozen lockfile
- **Node 20** pinned across all CI workflows
- ESLint 9 flat config migration (`eslint.config.js`) with `typescript-eslint@8` + `eslint-config-next@16`
- React Hooks v7 new rules (`set-state-in-effect`, `purity`, `immutability`, `preserve-manual-memoization`, `static-components`) downgraded to `warn` — tracked for future cleanup
- TypeScript errors reduced by 62% (719 → 274, now 0)

### Fixed

- Framer-motion easing tuple type error (`as const` for `Easing` type)
- Dark mode pure-black containers causing poor contrast
- Stale documentation referencing Next.js 14/15, npm, Vercel deployment
- Removed external Vercel Blob URL references in logo components

### Security

- Content Security Policy headers in `next.config.mjs`
- Automated security scanning via CodeQL and njsscan workflows
- `pnpm audit --prod --audit-level=high` in CI (non-blocking)
- All assets served locally from `/public/`

---

## [1.0.0] - 2026-05-22

### Added — Core Platform

- **Next.js 16** App Router architecture with static export (`output: 'export'`)
- **GitHub Pages** deployment with custom domain `medical.yyc3.vip`
- **pnpm 9** package manager with strict dependency management
- **shadcn/ui + Radix UI** component system
- **Tailwind CSS 3** with medical theme and brand colors
- **GeistSans** self-hosted font (offline build support)
- TypeScript strict mode, path aliases (`@/*`)

### Added — Feature Modules

- **AI Diagnosis**: case library, model comparison, A/B testing, model rollback
- **Patient Management**: CRUD with dynamic routing (SSG), detail views
- **Admin Dashboard**: system monitoring, user/role management, logs, tasks, settings, backup, API config, deployment checks, certifications, AI model management
- **Analytics**: prediction models, trend analysis, performance charts
- **Teleconsultation**: scheduling, records, video consultation UI
- **EHR Integration**: connections, mapping, sync workflows
- **Clinical Decision Support**: drug reference, guidelines, treatment plans
- **Medications**: interactions, inventory, prescriptions
- **Research**: analysis, samples, trials
- **Knowledge Graph**: visualization and navigation
- **Security**: access control, audit logs, compliance pages
- **Mobile App Preview**: responsive showcase
- **Brand Identity**: logo system, slogan, design showcase

### Added — Project Documentation

- `README.md` with badges, architecture, module listing
- `CONTRIBUTING.md` with development standards
- `CHANGELOG.md` following Keep a Changelog format
- `LICENSE` (MIT)
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1)
- `SECURITY.md` with vulnerability reporting process
- Complete icon set (favicon, PWA, Apple Touch, WebP, MS Tiles)

### Changed

- Migrated from Vercel deployment to GitHub Pages
- Migrated from npm to pnpm
- Upgraded from Next.js 14 to Next.js 16
- Removed legacy Pages Router (`pages/` directory)
- Removed server-side API routes (incompatible with static export)
- Removed middleware (incompatible with static export)
- Cleaned up 28+ redundant root-level files

### Removed

- `expo`, `react-native`, `pg`, `typeorm` dependencies (not applicable for static site)
- `vercel.json`, `package-lock.json` (Vercel/npm artifacts)
- Root-level scattered scripts (`check-links.js`, `export-doc.js`, etc.)
- Duplicate configuration files (`.eslintrc.js`, `prettier.config.js`)
- Binary files (`model.pth`, `test_data.npz`)

### Security

- Removed external Vercel Blob URL references in logo components
- All assets served locally from `/public/`
- Content Security Policy headers configured in `next.config.mjs`
- Automated security scanning via CodeQL and njsscan workflows

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| Unreleased | — | Documentation overhaul, root docs to open-source standard |
| 1.1.0 | 2026-07-06 | Phase 0/1: 311 tests, i18n 4 locales, medical UI system, CI unified to pnpm |
| 1.0.0 | 2026-05-22 | Initial release: Next.js 16, static export, 112 routes, full module suite |

---

**YYC³-Med** — 让 AI 赋能医疗，让健康触手可及。
