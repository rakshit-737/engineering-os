# Secure Coding Examples (Python, stdlib only)

Runnable defensive patterns. Each file: the threat, the wrong way (marked, never for use), the right way, and a self-verifying demo.

Run everything:

```bash
python run_all.py
```

## Threat Map (STRIDE + OWASP)

| File | Threat | STRIDE | OWASP Top 10 |
|------|--------|--------|--------------|
| `input_validation.py` | Malformed/hostile input | Tampering | A03 Injection (root cause) |
| `sql_injection_prevention.py` | SQL injection | Tampering / Info disclosure | A03 Injection |
| `password_hashing.py` | Credential theft from DB dumps | Info disclosure | A02 Cryptographic Failures |
| `path_traversal_defense.py` | `../../etc/passwd` style reads | Info disclosure | A01 Broken Access Control |
| `url_validation_ssrf.py` | Server-side request forgery | Info disclosure / Elevation | A10 SSRF |

## Rules These Examples Encode

1. Validate at the boundary with allowlists; reject, don't sanitize into shape.
2. Never build SQL/commands/paths/URLs by string concatenation with user input.
3. Store passwords only as salted, slow hashes (PBKDF2/bcrypt/argon2), compare in constant time.
4. Canonicalize paths before any containment check.
5. For outbound fetches of user-supplied URLs: allowlist schemes + block private address space.

Link these to `06-Cybersecurity-Toolkit/Threat-Model-Template.md`: every mitigation row in a threat model should point at a concrete pattern like these.
