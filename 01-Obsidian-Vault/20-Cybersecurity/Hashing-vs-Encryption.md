---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# Hashing vs Encryption

Hub: [[Cybersecurity-Index]]

## Core Idea

Hashing is a one-way, fixed-length fingerprint of data — no key, not reversible; it serves integrity and password storage. Encryption is a reversible transform under a key; it serves confidentiality. Encoding (base64, URL-encoding) is neither — it has no secret and provides zero security. A digital signature is a hash of the message encrypted/signed with a private key, giving integrity plus authenticity plus non-repudiation.

## Details

**Hash function properties (cryptographic)**
- Deterministic, fixed output (SHA-256 → 256 bits) for any input size.
- Preimage resistance: given `h`, can't find `m` with `H(m) = h`.
- Second-preimage resistance: given `m1`, can't find `m2 ≠ m1` with same hash.
- Collision resistance: can't find *any* pair with the same hash. MD5 and SHA-1 are broken for collisions — never use for signatures/certs; SHA-256/SHA-3 are fine.

**Encryption families**
- Symmetric: one shared key, fast (AES-256-GCM). Problem: key distribution.
- Asymmetric: public/private keypair (RSA, ECDH/Ed25519), ~1000x slower. Solves key distribution; used to establish symmetric keys — exactly what the [[TLS-Handshake]] does.
- Authenticated encryption (AES-GCM, ChaCha20-Poly1305) gives confidentiality *and* integrity in one primitive; plain CBC without a MAC is malleable.

**Comparison table**

| | Hashing | Encryption | Encoding |
|---|---|---|---|
| Reversible | No | Yes, with key | Yes, trivially |
| Key | None (salt ≠ key) | Required | None |
| CIA leg | Integrity | Confidentiality | None |
| Examples | SHA-256, argon2 | AES-GCM, RSA | base64 |

**Password storage — the canonical exam question**
Passwords must survive a DB dump. Fast hashes (SHA-256) fail here: GPUs try billions/sec. Use a deliberately slow, salted, memory-hard KDF: argon2id (first choice), bcrypt, or scrypt. Salt (random, per-user, stored in the clear) defeats rainbow tables and makes identical passwords hash differently.

```python
from argon2 import PasswordHasher  # pip install argon2-cffi

ph = PasswordHasher()              # argon2id, sane defaults
stored = ph.hash("hunter2")        # salt generated + embedded automatically
ph.verify(stored, "hunter2")       # True; raises on mismatch (constant-time)
```

Never: plaintext, reversible encryption (key theft = all passwords), unsalted or fast hashes.

**HMAC vs plain hash**
`SHA256(data)` proves integrity only if the hash arrives via a trusted channel. `HMAC(key, data)` proves integrity *and* that the sender knows the key — used in JWTs (HS256), API request signing, cookies. Plain `SHA256(secret + data)` is vulnerable to length-extension; use HMAC.

**Common pitfalls**
- "Encrypting passwords" — wrong on purpose in interviews to see if you correct it.
- Using base64 as "encryption."
- Comparing hashes with `==` (timing side channel) instead of `hmac.compare_digest`.
- Rolling your own crypto instead of libsodium/`cryptography`.

## Interview Angle

- One-liner to lead with: "Hash when you never need the original back (passwords, integrity); encrypt when you do (data at rest, transit)."
- Expect: "How do you store passwords?" Full answer: argon2id/bcrypt + per-user salt + slow work factor; mention pepper (server-side secret) as a bonus.
- Expect: "Difference between hashing, encryption, encoding?" — the table above, delivered in three sentences.
- Expect: "What's a digital signature?" Hash the message, sign the hash with the private key; anyone verifies with the public key. Ties into certificates and [[TLS-Handshake]].
- Red-flag phrases to avoid: "decrypt the hash," "MD5 for passwords."

## Related

- [[TLS-Handshake]]
- [[CIA-Triad]]
- [[Authentication-vs-Authorization]]
- [[Hash-Tables]]
- [[Cybersecurity-Index]]
