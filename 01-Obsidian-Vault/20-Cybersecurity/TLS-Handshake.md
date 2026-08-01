---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# TLS Handshake

Hub: [[Cybersecurity-Index]]

## Core Idea

The TLS handshake sets up a secure channel before any application data flows. It does three things: negotiate parameters (TLS version + cipher suite), authenticate the server (and optionally the client) via X.509 certificates, and derive a shared symmetric session key using asymmetric key exchange. Asymmetric crypto is used only to bootstrap; the actual data is protected with fast symmetric crypto (AES-GCM / ChaCha20-Poly1305).

## Details

**TLS 1.3 handshake (1-RTT, the modern default)**

1. **ClientHello** → client sends supported TLS versions, cipher suites, and — key change in 1.3 — its ephemeral (EC)DHE key share(s) immediately, guessing the group.
2. **ServerHello** → server picks the cipher suite, sends its own ephemeral key share. Both sides now compute the shared secret via Diffie-Hellman and derive session keys. Everything after this point is encrypted.
3. Server sends {Certificate}, {CertificateVerify} (signs the handshake transcript with its cert private key — proving it owns the cert), and {Finished}.
4. Client verifies the certificate chain and the signature, sends {Finished}. Application data flows. One round trip total; 0-RTT resumption is possible for repeat visits (with replay caveats).

**Why (EC)DHE gives forward secrecy**
The session key comes from *ephemeral* Diffie-Hellman keys, thrown away after the session. The certificate's long-term private key only *signs* — it never encrypts the key exchange. So even if the server's private key is stolen later, past captured traffic stays secret. TLS 1.3 removed static RSA key exchange precisely because it lacked this property.

**Certificate authentication (the trust part)**
- The server presents a chain: leaf cert → intermediate(s) → root CA.
- The client validates: signature chain up to a trusted root in its store, not expired, not revoked (OCSP/CRL), and hostname matches the SAN. A digital signature verification here = hash of cert data checked against the CA's public key ([[Hashing-vs-Encryption]]).
- This is what stops a MITM: an attacker can copy the cert but cannot prove ownership in CertificateVerify without the private key.

**mTLS (mutual TLS) — both sides authenticate**
Standard TLS authenticates only the server. In mTLS the server also requests a client certificate; the client sends its cert and signs the transcript to prove ownership. Steps added: server sends CertificateRequest → client sends its Certificate + CertificateVerify → server validates the client chain against its trusted CAs. Common in service-to-service auth and zero-trust networks, where it enforces [[Authentication-vs-Authorization]] at the transport layer.

**TLS 1.3 vs 1.2 (interview-relevant deltas)**
- 1.2: 2-RTT handshake, allowed static RSA key exchange (no forward secrecy), many weak ciphers.
- 1.3: 1-RTT (0-RTT resumption), forward secrecy mandatory (ephemeral only), stripped legacy ciphers (RC4, CBC modes, SHA-1), AEAD ciphers only, most of the handshake encrypted.

**Common pitfalls / misconceptions**
- "TLS encrypts with the certificate's key" — no, the cert key authenticates/signs; the DHE-derived symmetric key encrypts data.
- Skipping certificate validation in client code (disabling verify to "make it work") reopens MITM — a frequent real-world bug.
- Expired/misconfigured chains (missing intermediate) cause outages; forgetting revocation checks weakens trust.
- Trusting the network instead of mTLS for internal services.
- 0-RTT resumption data is replayable — only send idempotent requests in early data, never a "transfer money" POST.
- OCSP stapling: the server attaches a fresh, CA-signed revocation proof during the handshake, so the client avoids a slow, privacy-leaking OCSP round trip to the CA.

## Interview Angle

- Be able to narrate the 1.3 handshake in ~4 steps and name what each achieves: negotiate, key-exchange, authenticate, confirm.
- Nail forward secrecy: ephemeral DH keys mean stolen long-term keys don't decrypt past traffic — say *why* 1.3 dropped RSA key exchange.
- Expect: "Asymmetric vs symmetric — where is each used?" Asymmetric to authenticate + establish the key; symmetric (AES-GCM) for bulk data because it's ~1000x faster.
- Expect: "How does the client know it's talking to the real server?" Certificate chain validation up to a trusted root + hostname check + CertificateVerify signature.
- Know mTLS steps and when to use it (service mesh, zero trust). Ties to [[CIA-Triad]] — TLS defends confidentiality and integrity in transit.

## Related

- [[Hashing-vs-Encryption]]
- [[CIA-Triad]]
- [[Authentication-vs-Authorization]]
- [[Cybersecurity-Index]]
