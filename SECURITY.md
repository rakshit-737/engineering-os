# Security Policy

Engineering OS is a static site plus a Markdown knowledge base. It has no backend and stores personal progress only in the visitor's own browser (`localStorage`).

## Reporting a vulnerability

Please report vulnerabilities privately via **GitHub Security Advisories** ("Report a vulnerability" on the Security tab). Do not open a public issue. Expect an acknowledgement within 7 days.

## Scope

- XSS or HTML injection through rendered Markdown (all Markdown is sanitized with DOMPurify before rendering)
- Unsafe handling of imported progress JSON
- Supply-chain issues in `package.json` dependencies or GitHub Actions workflows
- Accidentally committed secrets

## Security model

- Markdown is rendered client-side and sanitized; raw HTML scripts, event handlers and `javascript:` URLs are stripped.
- External links open with `rel="noopener noreferrer"`.
- Imported JSON is schema-validated before it touches state.
- No secrets exist in this repository. Never commit API keys; use environment variables and `.env` files that are git-ignored.
- Dependencies are kept minimal; `npm audit` runs in CI.

Offensive-security content in `06-Cybersecurity-Toolkit` is for authorized testing, labs and CTFs only.
