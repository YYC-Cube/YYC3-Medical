# Tech Debt: ESLint 9 Flat Config Migration

Status: **complete** (2026-07-04)

## Outcome

Migrated from legacy ESLint 8 + `.eslintrc.json` to ESLint 9 flat config.

| Component | Before | After |
|-----------|--------|-------|
| `eslint` | 8.57.1 | 9.39.4 |
| `eslint-config-next` | 15.5.20 | 16.2.10 |
| `@typescript-eslint/*` | 7.18.0 (split plugin + parser) | 8.62.1 (unified `typescript-eslint`) |
| `eslint-config-prettier` | 9.1.0 | 10.1.8 |
| Config format | `.eslintrc.json` | `eslint.config.js` (flat) |
| `@eslint/eslintrc` (FlatCompat) | — | not needed (eslint-config-next 16 ships native flat config) |

## Verification (2026-07-04)

- `pnpm lint` → 0 errors, 248 warnings (132 `@typescript-eslint/no-unused-vars` + 108 new `react-hooks/*` + 8 misc).
- `pnpm type-check` → 0 errors.
- `pnpm test` → 147 tests passing.
- `pnpm build` → ✓ Compiled successfully in 5.0s (114/114 static pages).

> The +141 warning delta vs. baseline (107 → 248) comes from two sources: (1) `eslint-plugin-react-hooks` v7 introduced new rules (`set-state-in-effect`, `purity`, `immutability`, `preserve-manual-memoization`, `static-components`) — downgraded to `warn` so they are tracked but not blocking; (2) `typescript-eslint` v8 detects more unused vars. Both are real findings that warrant a dedicated cleanup pass (tracked in `any-audit.md` follow-up).

## Implementation

### New: `eslint.config.js` (flat config)

- Imports `eslint-config-next/core-web-vitals` directly (Next 16 ships a native flat config array — no `FlatCompat` shim required).
- Imports `typescript-eslint` to expose the `@typescript-eslint` plugin to custom rule blocks (flat config requires plugins per-block).
- Preserves all 22 carryover rules from `.eslintrc.json` verbatim.
- Adds 5 new `react-hooks` rules (introduced by `eslint-plugin-react-hooks` v7) at `warn` level.

### Deleted: `.eslintrc.json` (legacy format unsupported by ESLint 9)

### Edit: `package.json`

- Added: `typescript-eslint@^8.62.1`, bumped `eslint@^9.39.4`, `eslint-config-next@^16.2.10`, `eslint-config-prettier@^10.1.8`.
- Removed: `@typescript-eslint/eslint-plugin@^7`, `@typescript-eslint/parser@^7`.
- Added: `immer@^10.1.1` (peer dep of zustand's `immer` middleware, surfaced by jest after install cleanup).

## Notes

- The pnpm workspace file at `/Users/yanyu/pnpm-workspace.yaml` (containing only `allowBuilds: esbuild: false`) was being treated as a workspace root, blocking install. Workaround: `pnpm install --ignore-workspace`. This is an environment concern, not a repo issue — once that file is removed or the user runs in a clean pnpm env, plain `pnpm install` works.
- AGENTS.md gotcha about "eslint-config-next lags Next 16" is now resolved.
