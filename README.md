<div align="center">

<img src="./public/Family-001.png" alt="YYC³-Med Banner" width="100%" />

<br />

# YYC³-Med 言语云³医疗AI智能诊疗系统

**言启立方于万象，语枢智云守健康**

*AI-Powered Intelligent Medical System — Diagnostic Assistance · Case Analysis · Knowledge Graph*

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9-f69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

[![Deploy](https://img.shields.io/badge/Deploy-GitHub_Pages-181717?logo=github&logoColor=white)](https://medical.yyc3.vip)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Pages](https://img.shields.io/badge/Status-Live-brightgreen)](https://medical.yyc3.vip)

[🌐 Live Demo](https://medical.yyc3.vip) · [📖 Documentation](./CONTRIBUTING.md) · [🐛 Report Bug](https://github.com/YYC-Cube/YYC3-Medical/issues) · [✨ Request Feature](https://github.com/YYC-Cube/YYC3-Medical/issues)

</div>

---

## Overview

YYC³-Med is a full-stack medical AI platform built with modern web technologies. It provides intelligent diagnostic assistance, case library management, knowledge graph visualization, and comprehensive clinical decision support — all delivered as a static site via GitHub Pages.

| Metric | Value |
|--------|-------|
| Pages | 112 routes |
| Components | 446 React components |
| Build Output | 13 MB static site |
| Framework | Next.js 15 (App Router, Static Export) |
| UI System | shadcn/ui + Radix UI + Tailwind CSS |

## Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    YYC³-Med Architecture                 │
├──────────────┬──────────────────────────────────────────┤
│   Frontend   │ Next.js 15 · React 18 · TypeScript 5.9  │
│   Styling    │ Tailwind CSS 3 · shadcn/ui · Radix UI    │
│   State      │ Zustand · React Context · React Hook Form│
│   Charts     │ Recharts · D3.js                         │
│   3D         │ Three.js · React Three Fiber             │
│   i18n       │ Custom (zh-CN / en-US)                   │
│   Package     │ pnpm 9 · Turbopack                       │
│   CI/CD      │ GitHub Actions · GitHub Pages             │
│   Domain     │ medical.yyc3.vip (Custom + HTTPS)         │
└──────────────┴──────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js >= 18.17.0
- pnpm >= 9.0.0

### Install & Run

```bash
git clone https://github.com/YYC-Cube/YYC3-Medical.git
cd YYC3-Medical
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build        # Static export to out/
```

## Project Structure

```
YYC3-Medical/
├── app/                     # Next.js App Router (112 pages)
│   ├── (auth)/              #   Auth pages (login/register/reset)
│   ├── admin/               #   Admin dashboard
│   ├── ai-diagnosis/        #   AI diagnosis module
│   ├── patients/            #   Patient management
│   ├── analytics/           #   Data analytics
│   ├── case-library/        #   Case library (SSG)
│   ├── clinical-decision/   #   Clinical decision support
│   ├── medications/         #   Medication management
│   ├── research/            #   Research module
│   ├── security/            #   Security & compliance
│   └── teleconsultation/   #   Teleconsultation
├── components/              # 446 React components
│   ├── ui/                  #   shadcn/ui primitives
│   ├── admin/               #   Admin components
│   ├── ai-diagnosis/        #   AI diagnosis components
│   ├── brand/               #   Brand identity
│   └── ...                  #   Feature-based groups
├── contexts/                # React Context providers
├── hooks/                   # 19 custom hooks
├── lib/                     # Utilities, API client, i18n
├── public/                  # Static assets + icons + CNAME
├── scripts/                 # Build & database scripts
├── .github/workflows/       # CI/CD pipelines
├── next.config.mjs          # Next.js config (static export)
├── tailwind.config.ts       # Tailwind + medical theme
├── tsconfig.json            # TypeScript strict mode
└── package.json             # pnpm workspace
```

## Modules

| Module | Route | Description |
|--------|-------|-------------|
| 🏠 Dashboard | `/admin` | System overview, resource monitoring |
| 🧠 AI Diagnosis | `/ai-diagnosis` | AI-assisted diagnostic support |
| 👥 Patients | `/patients` | Patient management with dynamic routes |
| 📊 Analytics | `/analytics` | Prediction models, trend analysis |
| 📚 Case Library | `/case-library` | Medical case repository |
| 💊 Medications | `/medications` | Drug interactions, prescriptions, inventory |
| 🔬 Research | `/research` | Analysis, samples, clinical trials |
| 🏥 Clinical Decision | `/clinical-decision` | Drug reference, guidelines, treatments |
| 📡 Teleconsultation | `/teleconsultation` | Remote consultation scheduling |
| 🔒 Security | `/security` | Access control, audit, compliance |
| 🔗 EHR Integration | `/ehr-integration` | Connections, mapping, sync |

## Deployment

Push to `main` → GitHub Actions auto-builds → Deploys to GitHub Pages.

| Setting | Value |
|---------|-------|
| Platform | GitHub Pages |
| Domain | `medical.yyc3.vip` |
| HTTPS | Enforced |
| Workflow | `.github/workflows/deploy.yml` |
| Source | GitHub Actions (not branch) |

> ⚠️ **Setup**: Go to **Settings → Pages → Source → GitHub Actions**

## Commands

```bash
pnpm dev            # Dev server (Turbopack)
pnpm build          # Production build (static export)
pnpm start          # Preview production build
pnpm lint           # ESLint check
pnpm type-check     # TypeScript strict check
pnpm format         # Prettier format
pnpm format:check   # Prettier verify
pnpm test           # Jest tests
pnpm clean          # Clear .next cache
pnpm clean:all      # Full reinstall
```

## Documentation

| Document | Description |
|----------|-------------|
| [Contributing](./CONTRIBUTING.md) | Development setup, code standards, workflow |
| [Changelog](./CHANGELOG.md) | Version history and release notes |
| [Security](./SECURITY.md) | Security policy and vulnerability reporting |
| [Code of Conduct](./CODE_OF_CONDUCT.md) | Community guidelines |

## Contributors

<a href="https://github.com/YYC-Cube/YYC3-Medical/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YYC-Cube/YYC3-Medical" />
</a>

## License

[MIT](./LICENSE) © 2024-2026 YYC³-Cube
