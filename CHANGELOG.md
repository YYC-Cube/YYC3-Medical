# Changelog

All notable changes to YYC³-Med will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-22

### Added

- Next.js 15 App Router architecture with static export (`output: 'export'`)
- GitHub Pages deployment with custom domain `medical.yyc3.vip`
- pnpm package manager with strict dependency management
- shadcn/ui + Radix UI component system
- Tailwind CSS 3 with medical theme and brand colors
- AI diagnosis module with case library
- Patient management with dynamic routing (SSG)
- Admin dashboard with system monitoring
- Analytics module with prediction and trend analysis
- Teleconsultation scheduling and records
- EHR integration (connections, mapping, sync)
- Clinical decision support (drug reference, guidelines, treatments)
- Medications management (interactions, inventory, prescriptions)
- Research module (analysis, samples, trials)
- Knowledge graph visualization
- Multi-language support (zh-CN, en-US)
- Dark/light theme with system preference
- Responsive design for mobile and desktop
- Security pages (access control, audit, compliance)
- CI/CD pipeline with GitHub Actions

### Changed

- Migrated from Vercel deployment to GitHub Pages
- Migrated from npm to pnpm
- Upgraded from Next.js 14 to Next.js 15
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
- All assets now served locally from `/public/`
- Content Security Policy headers configured in `next.config.mjs`
- Automated security scanning via CodeQL and njsscan workflows

### Documentation

- Professional README with badges, architecture diagram, and full module listing
- CONTRIBUTING.md with development standards and component guidelines
- CHANGELOG.md following Keep a Changelog format
- LICENSE (MIT)
- CODE_OF_CONDUCT.md (Contributor Covenant 2.1)
- SECURITY.md with vulnerability reporting process
- Complete icon set deployed (favicon, PWA, Apple Touch, WebP, MS Tiles)
