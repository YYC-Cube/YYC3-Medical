# Contributing to YYC³-Med

> 欢迎为 YYC³-Med 智能诊疗系统贡献代码！本指南涵盖开发环境搭建、代码规范、提交标准与质量门禁。

First-time contributor? Read the [README](README.md) for project overview, and [AGENTS.md](AGENTS.md) for the authoritative technical reference.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Quality Gates](#quality-gates)
- [Architecture Rules](#architecture-rules)
- [Code Standards](#code-standards)
- [Styling Guidelines](#styling-guidelines)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)

---

## Prerequisites

| Tool        | Version            | Notes                                                                                               |
| ----------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| **Node.js** | `>= 18.17.0`       | Use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| **pnpm**    | `>= 9.0.0`         | Declared in `packageManager` field (`pnpm@9.15.4`)                                                  |
| **Git**     | any recent version |                                                                                                     |

## Getting Started

```bash
# 1. Clone
git clone https://github.com/YYC-Cube/YYC3-Medical.git
cd YYC3-Medical

# 2. Install dependencies
pnpm install

# 3. Start dev server (Turbopack)
pnpm dev
```

The dev server runs at `http://localhost:3000`.

### ⚠️ pnpm Workspace Gotcha

If `pnpm install` fails with `No projects found in /Users/<you>/...`, a parent directory's `pnpm-workspace.yaml` is hijacking the workspace root. Fix:

```bash
pnpm install --ignore-workspace
```

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

Branch naming conventions:

| Prefix      | Use case                                |
| ----------- | --------------------------------------- |
| `feature/`  | New functionality                       |
| `fix/`      | Bug fixes                               |
| `docs/`     | Documentation changes                   |
| `refactor/` | Code restructuring (no behavior change) |
| `chore/`    | Build/tooling/config                    |

### 2. Develop

Follow the [Architecture Rules](#architecture-rules) and [Code Standards](#code-standards) below.

### 3. Verify Locally

Run all four quality gates before committing:

```bash
pnpm type-check   # tsc --noEmit — must be 0 errors
pnpm lint         # eslint . — must be 0 errors (warnings tolerated)
pnpm test         # jest — all tests must pass
pnpm build        # next build — static export must succeed
```

### 4. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/). See [Commit Conventions](#commit-conventions).

### 5. Push and Open a PR

```bash
git push -u origin feature/your-feature-name
```

Open a Pull Request against `main`. See [Pull Request Process](#pull-request-process).

---

## Quality Gates

All four gates must pass before merge. The `pnpm build` step is the only **hard** CI gate; others are strongly enforced.

| Gate       | Command           | Requirement                               |
| ---------- | ----------------- | ----------------------------------------- |
| Type check | `pnpm type-check` | 0 errors                                  |
| Lint       | `pnpm lint`       | 0 errors (warnings reviewed case-by-case) |
| Test       | `pnpm test`       | All tests pass                            |
| Build      | `pnpm build`      | Static export to `out/` succeeds          |

CI runs these on every push/PR to `main` via GitHub Actions (see `.github/workflows/`).

---

## Architecture Rules

### Static Export — The Golden Rule

This project uses `output: 'export'` in `next.config.mjs`. The following are **forbidden**:

```ts
// ❌ NO API routes
app/api/*/route.ts

// ❌ NO middleware
middleware.ts

// ❌ NO server actions
"use server"

// ❌ NO server-only APIs in render
cookies(), headers(), response.cookies.set()

// ❌ NO ISR / revalidate
export const revalidate = 60 // won't work
```

If a feature needs interactivity, browser APIs, or state — make it a **client component**.

### Server / Client Component Pattern

Pages default to **server components**. The pervasive pattern:

```tsx
// app/patients/page.tsx (server component)
import { PatientsClient } from '@/components/patients/patients-client';

export const metadata = {
  title: '患者管理 | YYC³-Med',
};

export default function PatientsPage() {
  return <PatientsClient />;
}
```

```tsx
// components/patients/patients-client.tsx
'use client';

import { useState } from 'react';

export function PatientsClient() {
  const [search, setSearch] = useState('');
  // interactive logic here
}
```

**Rules**:

- `page.tsx` / `layout.tsx` → server component (export `metadata`, render static shell)
- `*-client.tsx` → client component (handles interactivity)
- Add `"use client"` only when needed (hooks, browser APIs, event handlers, context consumers)

### Provider Stack

The root layout (`app/layout.tsx`) has a fixed provider order:

```
Theme → Language → Loading → UserAvatar → AutoTranslation → AutomaticExecution → children + Toaster
```

Adding a global provider means editing this chain.

---

## Code Standards

### TypeScript

- **Strict mode** enabled — no `// @ts-ignore` without justification
- Use path alias `@/*` for all internal imports
- Define `interface` or `type` for all component props
- **Never use `any`** — prefer `unknown` + type guard. See [any-audit.md](docs/tech-debt/any-audit.md)
- Use `as const` for tuple/array literals consumed by typed APIs (e.g., framer-motion easing)

### Import Order

```tsx
// 1. React / Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { z } from 'zod';

// 3. Internal modules (@/ alias — prefer barrel files)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { formatDate } from '@/lib/utils';

// 4. Relative imports (avoid in app/components; use in test files)
import { PatientCard } from './patient-card';

// 5. Type-only imports
import type { Patient } from '@/types';

// 6. Styles (if applicable)
import './styles.css';
```

### File Naming

| Type                         | Convention                        | Example                                              |
| ---------------------------- | --------------------------------- | ---------------------------------------------------- |
| New components               | **kebab-case** `.tsx`             | `patient-card.tsx`                                   |
| Legacy PascalCase components | Keep as-is (do NOT rename)        | `AuthGuard.tsx`                                      |
| Pages / layouts              | Next.js convention                | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` |
| Hooks                        | `use-*.ts` / `use-*.tsx`          | `use-debounce.ts`                                    |
| Non-component TS             | `camelCase.ts` or `kebab-case.ts` | `patientService.ts`                                  |
| Types                        | `PascalCase.ts` in `types/`       | `Patient.ts`                                         |
| Tests                        | `*.test.ts(x)` in `__tests__/`    | `utils.test.ts`                                      |

> **Do not mass-rename files.** Match the surrounding directory's existing style.

### Barrel Files

Barrel files (`index.ts`) exist at: `components/`, `hooks/`, `store/`, `types/`, `contexts/`, `services/`.

**Prefer importing from barrels**:

```tsx
// ✅ Good
import { useAuth, useDebounce } from '@/hooks';

// ⚠️ Acceptable when barrel doesn't export it
import { useAuth } from '@/hooks/use-auth';
```

> Read barrel file comments before adding new re-exports — `components/index.ts` intentionally skips some modules to avoid `ButtonProps`/`buttonVariants` collisions.

### Logging

Use `lib/logger.ts` `debug()` instead of `console.log()` in `app/`, `components/`, and `services/`. `console.error` / `console.warn` are allowed everywhere.

---

## Styling Guidelines

### Tailwind CSS Only

- **No inline styles** — use Tailwind utility classes exclusively
- Use `cn()` helper from `@/lib/utils` for conditional classes
- Theme colors are CSS variables in `app/globals.css` (`hsl(var(--primary))` etc.)
- Dark mode: class strategy via `next-themes`

### Medical Color System

This project uses a **medical-grade palette**. Never use raw gray/black for containers:

```tsx
// ❌ Never
<div className="bg-gray-900">
<div className="bg-black">
<div className="bg-slate-950">

// ✅ Use medical palette
<div className="bg-medical-900">      {/* deep navy, never pure black */}
<div className="bg-medical-800">      {/* card background in dark mode */}
<div className="bg-medical-700">      {/* borders in dark mode */}
<div className="text-medical-200">    {/* secondary text in dark mode */}
```

**Available tokens** (see `tailwind.config.ts`):

| Token                        | Purpose                      |
| ---------------------------- | ---------------------------- |
| `medical-50` → `medical-900` | Primary navy/blue scale      |
| `success`                    | Semantic success (green)     |
| `warning`                    | Semantic warning (amber)     |
| `info`                       | Semantic info (blue)         |
| `primary`                    | Brand primary (CSS variable) |
| `destructive`                | Errors / destructive actions |

**Animations**: `breathe`, `heartbeat`, `fade-in`, `slide-up`, `scale-in`, `shimmer` are available as Tailwind animation utilities.

### Component Patterns

- Use **shadcn/ui** primitives from `components/ui/` as building blocks
- Follow **Radix UI** patterns for accessibility
- Place feature-specific components in `components/<feature>/` subdirectories
- For page transitions, use `PageTransition` / `StaggerContainer` / `StaggerItem` from `@/components/ui/page-transition`

---

## Internationalization

The app supports **4 locales**: `zh-CN` (default), `en-US`, `ja-JP`, `ko-KR`.

### Two Parallel Systems

1. **Custom inline dictionaries**: `contexts/language-context.tsx` + `hooks/use-translation.ts`
2. **next-intl catalogs**: `messages/{en,zh}.json` + `lib/i18n/dictionaries/*.json`

### Adding Translations

When adding user-facing text:

1. Add keys to all 4 locale dictionaries in `lib/i18n/dictionaries/`
2. Add medical terminology to `i18n/medical-terms.ts` if domain-specific
3. Use `useTranslation()` hook in components — never hardcode strings

```tsx
const { t } = useTranslation();
return <h1>{t('patients.title')}</h1>;
```

---

## Testing

### Commands

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test -- <pattern> # Run specific test file
pnpm test -- --coverage # With coverage report
```

### Requirements for New Code

- New **hooks**, **services**, or **utils** must include at least:
  - Happy-path test
  - Edge case / boundary test
- Test files live in `__tests__/` mirroring source structure
- Use `@testing-library/react` + `@testing-library/user-event`
- Test names: `<module-name>.test.ts(x)` in `__tests__/<category>/`

### Current State

- **16 test suites, 311 tests passing**
- Coverage: statements 41.8%, branches 64.6%, functions 42.5%, lines 42.4%
- Target: ramping +5%/month toward 70%

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Types

| Type       | Use                                      |
| ---------- | ---------------------------------------- |
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation only                       |
| `refactor` | Code restructuring (no behavior change)  |
| `test`     | Test additions/changes                   |
| `chore`    | Build, tooling, config                   |
| `style`    | Formatting, whitespace (no logic change) |
| `perf`     | Performance improvement                  |

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Examples

```
feat(ai-diagnosis): 添加 DICOM 影像标注功能
fix(ui): 修复暗色模式下卡片背景纯黑问题
docs: rewrite CONTRIBUTING.md to open-source standard
refactor(hooks): simplify useDebounce cleanup logic
test(lib): add edge case tests for validation utils
chore(deps): bump next from 16.2.5 to 16.2.6
```

> Chinese or English descriptions are both acceptable. Scoped commits with Chinese descriptions are common in this project.

### Pre-commit Hook

`.husky/pre-commit` runs `lint-staged` → `eslint --fix` + `prettier --write` on staged `*.{ts,tsx}` files.

---

## Pull Request Process

### Before Opening

1. ✅ All 4 quality gates pass locally
2. ✅ Branch is up to date with `main`
3. ✅ Commit messages follow Conventional Commits
4. ✅ New code has tests
5. ✅ No `any` types without justification

### PR Description Template

```markdown
## Summary

<!-- Brief description of what and why -->

## Changes

- <!-- Change 1 -->
- <!-- Change 2 -->

## Test Plan

- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes (0 errors)
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] Manually tested: <!-- describe -->

## Type

<!-- feat / fix / docs / refactor / test / chore -->
```

### Review Criteria

- Architecture rules respected (no server-only code, no API routes)
- Styling uses medical color system (no raw gray/black containers)
- TypeScript strict — no unjustified `any`
- Tests cover new logic
- Accessibility considered (Radix patterns, ARIA attributes, keyboard nav)

---

## Useful Commands

```bash
pnpm dev                  # Dev server (Turbopack)
pnpm build                # Static export → out/
pnpm start                # Preview production build
pnpm type-check           # TypeScript strict check
pnpm lint                 # ESLint
pnpm lint:fix             # ESLint with --fix
pnpm format               # Prettier write
pnpm format:check         # Prettier check (CI)
pnpm test                 # Jest
pnpm test:watch           # Jest watch mode
pnpm clean                # Clear .next + node_modules/.cache
pnpm clean:all            # rm node_modules + .next, reinstall
pnpm analyze              # Build with bundle analysis
```

---

## Questions?

- 📋 [Open an issue](https://github.com/YYC-Cube/YYC3-Medical/issues)
- 📖 [AGENTS.md](AGENTS.md) — Authoritative technical reference
- 📖 [Developer Guide (zh)](docs/YYC3-Med开发者指南.md)
- 📖 [Architecture Doc (zh)](docs/YYC3-Med系统架构文档.md)

Thank you for contributing! 🩺
