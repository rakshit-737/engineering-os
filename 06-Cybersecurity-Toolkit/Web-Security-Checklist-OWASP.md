# Web Security Checklist (OWASP-Aligned)

## Authentication

- [ ] Strong password policy or passkeys
- [ ] MFA for sensitive actions
- [ ] Brute-force protection and lockout strategy
- [ ] Session timeout and revocation

## Authorization

- [ ] Server-side authorization for every sensitive endpoint
- [ ] No IDOR / BOLA vulnerabilities
- [ ] Role checks centralized

## Input and Output Handling

- [ ] Parameterized SQL queries
- [ ] Output encoding against XSS
- [ ] File upload type/content validation
- [ ] Strict schema validation for APIs

## Secrets and Crypto

- [ ] No hardcoded secrets
- [ ] HTTPS everywhere
- [ ] Salted password hashing (Argon2/bcrypt/scrypt)
- [ ] Key rotation policy

## Headers and Browser Security

- [ ] CSP configured
- [ ] HSTS enabled
- [ ] X-Frame-Options / frame-ancestors
- [ ] Secure, HttpOnly, SameSite cookies

## Monitoring

- [ ] Audit logs for auth and privilege events
- [ ] Alerting for suspicious behavior
- [ ] WAF or equivalent control for internet-facing apps