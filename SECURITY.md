# Security Policy for Kheelona

## Reporting a Vulnerability

If you discover a security vulnerability in this repository, **please do not open a public GitHub issue**. Instead, please report it privately via:

1. **GitHub Security Advisory**: Visit [this repository's security tab](../../security/advisories) and click "Report a vulnerability"
2. **Email**: Send details to `security@kheelona.com` (if applicable)

Include the following details:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

## Supported Versions

Security updates are provided for:

- **Latest major version**: Full support
- **Previous major version**: Security fixes only for 6 months

| Version | Supported  | Notes               |
| ------- | ---------- | ------------------- |
| 1.x     | ✅ Yes     | Current release     |
| 0.x     | ⚠️ Limited | Security fixes only |

## Security Best Practices

This project follows security best practices including:

- **Dependency scanning**: Automated via Dependabot
- **SAST**: TypeScript strict mode, ESLint security rules
- **Code review**: All PRs require review before merge
- **CI/CD**: Security checks run on every PR
- **Secrets management**: No sensitive data in code; use environment variables
- **Headers**: CSP, HSTS, X-Frame-Options, and other security headers enabled

## Keeping Dependencies Secure

We use:

- **Dependabot** for automated vulnerability scanning
- **npm audit** in CI pipeline
- Regular security updates

To check vulnerabilities locally:

```bash
npm audit
npm audit fix
```

## Contact

For security questions or concerns, please reach out to the maintainers.

---

Thank you for helping keep Kheelona secure!
