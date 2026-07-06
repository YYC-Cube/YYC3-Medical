# Security Policy

## Supported Versions

| Version | Supported | Status |
|---------|-----------|--------|
| 1.1.x   | ✅ | Current release |
| 1.0.x   | ⚠️ | Security fixes only |

## Reporting a Vulnerability

If you discover a security vulnerability in YYC³-Med, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email security reports to the project maintainers
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Security Measures

### Architecture

- **Static export** (`output: 'export'`) — no server-side attack surface
- **No runtime backend** — zero server process, no API routes, no middleware
- All pages prerendered at build time (SSG)
- HTTPS enforced via GitHub Pages

### Code Security

- No sensitive data in client-side code
- Environment variables excluded from repository (`.gitignore`)
- Content Security Policy headers configured in `next.config.mjs`
- No external CDN dependencies (all assets self-hosted from `/public/`)
- No inline styles (Tailwind CSS utility classes only)

### Dependency Security

- Dependencies audited via `pnpm audit`
- Automated security scanning via GitHub Actions:
  - **CodeQL** — semantic code analysis
  - **njsscan** — Node.js security scan
- `pnpm audit --prod --audit-level=high` runs in CI (non-blocking)

```bash
# Run security audit locally
pnpm audit
```

## Medical Data Compliance

> **Important**: YYC³-Med is designed for the medical healthcare domain.

### Current State (v1.1.0)

- **No real patient data is stored or processed** — all data is mock/demo
- Authentication is client-side only (`localStorage` via Zustand persist)
- No real database connection (future backend will use Prisma + MySQL)

### Future Considerations

When the backend is implemented, the following compliance frameworks should be evaluated:

| Framework | Region | Relevance |
|-----------|--------|-----------|
| **HIPAA** | US | Health Insurance Portability and Accountability Act |
| **等保 2.0** (MLPS) | China | 多级保护方案 — information security protection system |
| **GDPR** | EU | General Data Protection Regulation |
| **PIPL** | China | 个人信息保护法 — Personal Information Protection Law |

**Action items for backend implementation:**

- [ ] End-to-end encryption for patient data
- [ ] Audit logging for all data access
- [ ] Role-based access control (RBAC) with server-side enforcement
- [ ] Data retention and deletion policies
- [ ] Regular security penetration testing

## Responsible Disclosure

We ask that you:

- Give us reasonable time (at least 90 days) to respond and fix the issue
- Do not access or modify other users' data
- Do not degrade the quality of service for other users
- Report vulnerabilities privately before any public disclosure

## Security Headers

The following headers are configured in `next.config.mjs`:

```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy
```
