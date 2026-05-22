# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅ |

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

- Static export architecture (no server-side attack surface)
- Content Security Policy headers configured
- No sensitive data in client-side code
- Dependencies audited via `pnpm audit`
- Automated security scanning via GitHub Actions (CodeQL, njsscan)
- Environment variables excluded from repository
- HTTPS enforced via GitHub Pages

## Dependency Security

Run security audit:

```bash
pnpm audit
```

## Responsible Disclosure

We ask that you:
- Give us reasonable time to respond and fix the issue
- Do not access or modify other users' data
- Do not degrade the quality of service for other users
