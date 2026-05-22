# Contributing to YYC³-Med

Thank you for your interest in contributing to YYC³-Med! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.17.0
- pnpm >= 9.0.0
- Git

### Getting Started

```bash
git clone https://github.com/YYC-Cube/YYC3-Medical.git
cd YYC3-Medical
pnpm install
pnpm dev
```

The development server will start at `http://localhost:3000`.

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure:
   - `pnpm type-check` passes
   - `pnpm lint` passes
   - `pnpm build` succeeds
   - New components follow shadcn/ui patterns

3. **Commit** with conventional commit messages:
   ```
   feat: add patient export functionality
   fix: resolve dark mode flicker on load
   docs: update API documentation
   refactor: simplify diagnosis form logic
   ```

4. **Push and create a Pull Request** against `main`.

## Code Standards

### Architecture

- **App Router**: All pages go in `app/` directory
- **Static Export**: No server-side features (no API routes, no middleware, no dynamic server rendering)
- **Client Components**: Use `"use client"` only when needed (hooks, browser APIs, event handlers)
- **Server Components**: Default for all pages — keep them as server components when possible

### Component Guidelines

- Use shadcn/ui components from `components/ui/`
- Follow Radix UI patterns for accessible component design
- Use Tailwind CSS classes for styling (no inline styles)
- Place shared components in `components/` with feature-based subdirectories

### TypeScript

- Strict mode enabled
- Use path aliases (`@/`) for imports
- Define interfaces for all props
- Avoid `any` type

### Styling

- Tailwind CSS utility classes only
- Use CSS variables from `globals.css` for theme colors
- Follow the medical color palette defined in `tailwind.config.ts`

## Project Conventions

### File Naming

- Components: `kebab-case.tsx` (e.g., `patient-card.tsx`)
- Pages: `page.tsx` within route directories
- Layouts: `layout.tsx` within route directories
- Hooks: `use-*.ts` or `use-*.tsx`
- Utilities: `kebab-case.ts`
- Types: `PascalCase.ts` in `types/`

### Import Order

```typescript
// 1. React / Next.js
import { useState } from "react"
import Link from "next/link"

// 2. Third-party libraries
import { Button } from "@/components/ui/button"

// 3. Internal modules
import { useAuth } from "@/hooks/useAuth"
import { formatDate } from "@/lib/utils"
```

## Testing

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

## Building

```bash
pnpm build          # Build static site to out/
```

## Deployment

Pushing to `main` triggers automatic deployment via GitHub Actions.

## Questions?

Open an issue at [GitHub Issues](https://github.com/YYC-Cube/YYC3-Medical/issues).
