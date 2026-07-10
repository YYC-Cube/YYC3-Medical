<div align="center">

<img src="./public/Family-001.jpg" alt="YYC³-Med Banner" width="100%" />

<br />

# YYC³-Med · 言语云³医疗AI智能诊疗系统

**言启立方于万象，语枢智云守健康**

_AI-Powered Intelligent Medical Diagnosis Platform — Diagnostic Assistance · Case Analysis · Clinical Decision Support_

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9-f69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[![Tests](https://img.shields.io/badge/Tests-311_passed-brightgreen)](./__tests__)
[![Lint](https://img.shields.io/badge/Lint-0_errors-green)](./eslint.config.js)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)
[![Deploy](https://img.shields.io/badge/Deploy-Live-brightgreen?logo=github&logoColor=white)](https://medical.yyc3.vip)

[🌐 Live Demo](https://medical.yyc3.vip) · [📖 Documentation](./docs/) · [🐛 Report Bug](https://github.com/YYC-Cube/YYC3-Medical/issues) · [✨ Request Feature](https://github.com/YYC-Cube/YYC3-Medical/issues)

</div>

---

## Overview

YYC³-Med is a bilingual (zh-CN / en-US / ja-JP / ko-KR) medical AI platform frontend, delivered as a fully static site via GitHub Pages. It provides intelligent diagnostic assistance, patient management, case libraries, clinical decision support, knowledge graphs, and research tools — all built with a medical-grade blue/teal design system.

| Metric       | Value                                  |
| ------------ | -------------------------------------- |
| Routes       | 112 App Router pages                   |
| Components   | 441 React components                   |
| Custom Hooks | 19                                     |
| Services     | 31 domain service modules              |
| Tests        | 311 passing (16 suites)                |
| Loc          | ~121,000 lines of TypeScript/TSX       |
| Bundle       | ~25 MB static export                   |
| i18n         | 4 locales (zh-CN, en-US, ja-JP, ko-KR) |

## Tech Stack

| Layer               | Technology                                          |
| ------------------- | --------------------------------------------------- |
| **Framework**       | Next.js 16.2 (App Router, Turbopack, Static Export) |
| **Runtime**         | React 18.3                                          |
| **Language**        | TypeScript 5.8 (strict mode)                        |
| **Styling**         | Tailwind CSS 3.4 + shadcn/ui (Radix-based)          |
| **State**           | Zustand 5 + React Context + React Hook Form 7       |
| **Validation**      | Zod 4                                               |
| **Charts**          | Recharts 2.15 + D3.js 7.9                           |
| **3D / Viz**        | Three.js 0.176 + @react-three/fiber 8.18            |
| **Animation**       | Framer Motion 12 + tailwindcss-animate              |
| **Icons**           | lucide-react                                        |
| **Fonts**           | GeistSans (self-hosted, offline-buildable)          |
| **Testing**         | Jest 29 + Testing Library + jsdom                   |
| **Package Manager** | pnpm 9.15                                           |
| **CI/CD**           | GitHub Actions → GitHub Pages                       |
| **Domain**          | `medical.yyc3.vip` (HTTPS enforced)                 |

## Quick Start

### Prerequisites

- **Node.js** ≥ 18.17.0
- **pnpm** ≥ 9.0.0

```bash
git clone https://github.com/YYC-Cube/YYC3-Medical.git
cd YYC3-Medical
pnpm install
pnpm dev          # http://localhost:3000
```

> **pnpm workspace note**: If `pnpm install` fails with "No projects found", run `pnpm install --ignore-workspace` — a parent `pnpm-workspace.yaml` may hijack the workspace root.

### Build

```bash
pnpm build        # Static export → out/
```

## Commands

```bash
到时候            # Dev server (Turbopack)
pnpm build          # Production build (static export → out/)
pnpm start          # Preview production build
pnpm test           # Jest test suite
pnpm test:watch     # Jest watch mode
pnpm type-check     # tsc --noEmit (strict)
pnpm lint           # ESLint (flat config)
pnpm lint:fix       # ESLint --fix
pnpm format         # Prettier write
pnpm format:check   # Prettier check
pnpm clean          # Clear .next + node_modules/.cache
pnpm clean:all      # rm node_modules + .next, reinstall
```

## Project Structure

```
YYC3-Medical/
├── app/                       # Next.js App Router (112 routes)
│   ├── (auth)/                #   Route group: login / register / reset
│   ├── (medical)/             #   Route group: medical module layouts
│   ├── admin/                 #   Admin dashboard + submodules
│   ├── ai-diagnosis/          #   AI diagnostic assistance
│   ├── patients/              #   Patient management ([id] SSG)
│   ├── case-library/          #   Medical case repository ([id] SSG)
│   ├── clinical-decision/     #   Clinical decision support
│   ├── analytics/             #   Data analytics & prediction
│   ├── medications/           #   Medication management
│   ├── research/              #   Research tools
│   ├── teleconsultation/      #   Remote consultation
│   ├── security/              #   Security & compliance
│   └── layout.tsx             #   Root layout (providers wired)
├── components/                # 441 React components
│   ├── ui/                    #   shadcn/ui primitives
│   ├── layout/                #   App shell, header, sidebar, breadcrumb
│   ├── admin/                 #   Admin feature components
│   ├── ai-diagnosis/          #   AI diagnosis components
│   ├── brand/                 #   Logo & identity system
│   └── …                      #   Feature-grouped directories
├── contexts/                  # React Context providers
├── hooks/                     # 19 custom hooks
├── lib/                       # Utils, i18n, API client, env, offline
├── services/                  # 31 domain service modules
├── store/                     # Zustand stores (Auth, Settings, Notification)
├── types/                     # TypeScript type definitions
├── i18n/                      # Medical terminology translations
├── prisma/                    # Prisma schema (MySQL — future backend)
├── public/                    # Static assets, icons, manifest, CNAME
├── docs/                      # Developer documentation
├── .github/workflows/         # CI/CD pipelines (8 workflows)
├── next.config.mjs            # Next.js config (static export)
├── tailwind.config.ts         # Tailwind + medical theme + animations
├── eslint.config.js           # ESLint 9 flat config
├── jest.config.js             # Jest + coverage thresholds
└── tsconfig.json              # TypeScript strict mode
```

## Feature Modules

| Module            | Route                | Description                                 |
| ----------------- | -------------------- | ------------------------------------------- |
| Dashboard         | `/admin`             | System overview, resource monitoring        |
| AI Diagnosis      | `/ai-diagnosis`      | AI-assisted diagnostic support              |
| Patients          | `/patients`          | Patient management with dynamic routes      |
| Analytics         | `/analytics`         | Prediction models, trend analysis           |
| Case Library      | `/case-library`      | Medical case repository                     |
| Medications       | `/medications`       | Drug interactions, prescriptions, inventory |
| Research          | `/research`          | Analysis, samples, clinical trials          |
| Clinical Decision | `/clinical-decision` | Drug reference, guidelines, treatments      |
| Teleconsultation  | `/teleconsultation`  | Remote consultation scheduling              |
| Security          | `/security`          | Access control, audit, compliance           |
| EHR Integration   | `/ehr-integration`   | Connections, mapping, sync                  |
| Knowledge Graph   | `/knowledge-graph`   | Medical knowledge visualization             |

## Architecture Constraints

This is a **static export site** (`output: 'export'`). The following are **not available**:

- ❌ API Routes (`app/api/...`)
- ❌ Middleware (`middleware.ts`)
- ❌ Server Actions, `cookies()`, `headers()` in render
- ❌ ISR / dynamic server rendering

Interactive features use **client components** (`"use client"`) with browser APIs. Pages default to server components with static metadata.

## Deployment

Push to `main` → GitHub Actions builds → Deploys to GitHub Pages.

| Setting  | Value                          |
| -------- | ------------------------------ |
| Platform | GitHub Pages                   |
| Domain   | `medical.yyc3.vip`             |
| HTTPS    | Enforced                       |
| Workflow | `.github/workflows/deploy.yml` |
| Source   | GitHub Actions (not branch)    |

> **Setup**: Settings → Pages → Source → GitHub Actions

## Documentation

| Document                                           | Description                                    |
| -------------------------------------------------- | ---------------------------------------------- |
| [Contributing](./CONTRIBUTING.md)                  | Development setup, code standards, PR workflow |
| [Changelog](./CHANGELOG.md)                        | Version history and release notes              |
| [AI Agent Guide](./AGENTS.md)                      | Comprehensive guide for AI coding assistants   |
| [Security](./SECURITY.md)                          | Security policy and vulnerability reporting    |
| [Code of Conduct](./CODE_OF_CONDUCT.md)            | Community guidelines                           |
| [Naming Conventions](./docs/naming-conventions.md) | File and component naming rules                |
| [Architecture](./docs/architecture.md)             | System architecture and design decisions       |
| [Developer Guide](./docs/developer-guide.md)       | Technical onboarding and conventions           |

## Contributors

<a href="https://github.com/YYC-Cube/YYC3-Medical/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YYC-Cube/YYC3-Medical" />
</a>

## License

[MIT](./LICENSE) © 2024-2026 YYC³-Cube. All rights reserved.
