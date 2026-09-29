---
title: "Applied Cryptography"
description: "Practical crypto for engineers: primitives, modes, key management, and pitfalls."
domain: cybersecurity
category: cryptography
type: concept
difficulty: intermediate
status: evergreen
tags: [cybersecurity, cryptography]
prerequisites: [Hashing-vs-Encryption]
related: [TLS-Handshake]
order: 130
---

# Applied Cryptography

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

## Core Idea

Cryptography gives you four tools: confidentiality (encryption), integrity (hashes/MACs), authenticity (MACs/signatures), and key agreement (DH). Applied crypto is knowing which tool answers which question — and never building the tools yourself. Almost every real-world crypto failure is misuse of good primitives (wrong mode, reused nonce, hardcoded key), not a broken cipher.

## Details

**Symmetric encryption — one shared key, fast, for bulk data**
- Standard choice: AES-256-GCM (or ChaCha20-Poly1305). These are AEAD modes: they encrypt *and* authenticate, so tampering is detected on decrypt.
- Why ECB mode is broken: it encrypts each 16-byte block independently, so identical plaintext blocks produce identical ciphertext blocks. Encrypt a bitmap of the Linux penguin in ECB and the penguin outline is still visible in the "ciphertext." Patterns leak; confidentiality fails without the key ever being touched.
- Nonce/IV reuse danger: GCM requires a unique nonce per encryption under the same key. Reuse a nonce and an attacker can XOR the two ciphertexts to recover plaintext relationships *and* forge authentication tags — the mode's guarantees collapse entirely. Use a counter or random 96-bit nonce, never a constant.

**Asymmetric encryption — key pair, slow, for small data and identity**
- Public key encrypts/verifies; private key decrypts/signs. Solves key distribution: anyone can encrypt to you without a prior shared secret.
- RSA: secure at ≥2048-bit keys (3072 for long-term). ECC (Curve25519, P-256): same security at ~256-bit keys — smaller, faster, now the default.
- Too slow for bulk data — you never AES-encrypt a file with RSA-sized math; you encrypt the *key*.

**Hybrid encryption — why TLS uses both**
1. Asymmetric part: authenticate the server (certificate signature) and agree on a shared secret (ECDH key exchange).
2. Symmetric part: derive AES/ChaCha20 session keys from that secret and encrypt the actual traffic.
Best of both: asymmetric solves "we've never met," symmetric gives speed. Every modern protocol (TLS, SSH, Signal, age) is hybrid. Details of the negotiation: [[TLS-Handshake]].

**Hash vs MAC vs signature — decision table**

| Need | Tool | Key? | Who can verify? |
|---|---|---|---|
| Detect accidental corruption / dedupe / fingerprint | Hash (SHA-256) | None | Anyone |
| Integrity + authenticity between two parties sharing a key | MAC (HMAC-SHA256) | Shared secret | Only key holders |
| Integrity + authenticity + non-repudiation to the world | Digital signature (Ed25519, RSA-PSS) | Private signs, public verifies | Anyone with public key |
| Store passwords | Password hash (Argon2id, bcrypt) | Salt per password | Server only |

Key distinction interviews probe: a MAC proves "someone with the shared key made this" (either party could have); a signature proves "the private-key holder made this" — that is non-repudiation. A bare hash proves nothing against an attacker who can also replace the hash. See [[Hashing-vs-Encryption]] for the hash/encrypt split.

**Key exchange — Diffie-Hellman intuition**
Two parties mix a public base with their own private value and exchange the mixes; each then adds their private value to the other's mix. Both arrive at the same shared secret, while an eavesdropper who saw only the mixes cannot recover it (discrete log is hard). Paint-mixing analogy: common color + each side's secret color; final blends match, unmixing is infeasible. DH alone doesn't authenticate — an active MITM can run DH with each side separately — which is why TLS signs the exchange with the certificate key. Ephemeral DH per session gives forward secrecy: stealing the server's long-term key later doesn't decrypt recorded traffic.

**Common misuse catalog**

| Misuse | Why it fails | Fix |
|---|---|---|
| Hardcoded keys in source/repo | Key leaks with the code; can't rotate | Secrets manager / env injection, rotate on exposure |
| Homemade crypto ("XOR with password," custom protocol) | No analysis; subtle breaks (padding oracles, timing) | Vetted libraries only |
| MD5/SHA-1 for security decisions | Practical collision attacks — forged certs, tampered files pass | SHA-256+ ; Argon2id for passwords |
| IV/nonce reuse | ECB-like leakage; GCM auth fully breaks | Unique nonce per encryption, counter or random |
| Encryption without authentication (raw CBC/CTR) | Attacker flips ciphertext bits, padding-oracle decryption | AEAD (GCM/ChaCha20-Poly1305) always |
| Fast hash for passwords (plain SHA-256) | GPU brute force at billions/sec | Slow, salted, memory-hard: Argon2id |
| Rolling your own token/session format | Forgery, algorithm-confusion bugs | Standard libs, `alg` allowlist |

**The rule**: use high-level tools — libsodium (library), age (file encryption), TLS (transport), Argon2id (passwords). Never implement primitives or invent protocols; the design skill is choosing and configuring correctly.

## Interview Angle

- "Symmetric vs asymmetric — when each?" Symmetric for bulk data (fast, shared key needed); asymmetric for key exchange and signatures (slow, solves distribution). Then say "real systems are hybrid, like TLS" — that sentence is the mark of understanding.
- "Why is ECB bad?" The penguin: identical plaintext blocks → identical ciphertext blocks → patterns visible. One-line answer with a picture behind it.
- "Hash vs MAC vs signature?" Reproduce the table: no key / shared key / key pair; only signatures give non-repudiation.
- "How would you store passwords?" Argon2id or bcrypt with per-user salt — never reversible encryption, never fast hashes. Follow-up "why not SHA-256?" → GPU speed.
- "What's forward secrecy?" Ephemeral DH per session; compromise of long-term keys doesn't expose past sessions.
- Red flags to volunteer avoiding: hardcoded keys, MD5/SHA-1, non-AEAD modes, homemade crypto. Naming misuses unprompted signals practical maturity.

## Related

- [[Hashing-vs-Encryption]]
- [[TLS-Handshake]]
- [[CIA-Triad]]
- [[OWASP-Top-10]]
- [[Cybersecurity-Index]]
