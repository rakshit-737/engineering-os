"""Defensive cryptography utilities (stdlib only) with complexity and interview notes.

Everything here uses only hashlib, hmac, secrets, and pathlib. These are the
stdlib-correct defensive patterns: hashing, MACs, salted password storage,
and CSPRNG token generation.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
from pathlib import Path

PBKDF2_ITERATIONS = 600_000
_PBKDF2_HASH_NAME = "sha256"


def sha256_hex(data: bytes | str) -> str:
    """
    SHA-256 Hex Digest
    Time: O(n) in input length
    Space: O(1) streaming state
    Interview note: a hash gives integrity, not authenticity — anyone can recompute it (vault: MAC vs hash).
    Accepts str (UTF-8 encoded) or bytes.
    """
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: str | Path, chunk_size: int = 65536) -> str:
    """
    SHA-256 of a File (chunked reads)
    Time: O(n) in file size
    Space: O(chunk_size)
    Interview note: stream in chunks so a multi-GB file never has to fit in memory.
    Returns the hex digest of the file contents.
    Raises ValueError for a non-positive chunk_size (read(0) would silently
    hash nothing).
    """
    if chunk_size <= 0:
        raise ValueError("sha256_file requires a positive chunk_size")
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        while True:
            chunk = handle.read(chunk_size)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def hmac_sign(key: bytes, message: bytes) -> str:
    """
    HMAC-SHA256 Signature (hex)
    Time: O(n) in message length
    Space: O(1)
    Interview note: HMAC proves both integrity AND authenticity — only a key holder can produce it (vault: MAC vs hash).
    Use for API request signing, session cookies, and webhook payloads.
    """
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def hmac_verify(key: bytes, message: bytes, signature_hex: str) -> bool:
    """
    HMAC-SHA256 Verification (constant time)
    Time: O(n) in message length
    Space: O(1)
    Interview note: compare with hmac.compare_digest, never == (vault: timing attacks).

    Why == is wrong: string equality short-circuits at the first differing
    byte, so verification time leaks how many leading bytes of a forged
    signature are correct. An attacker who can measure response times can
    recover a valid MAC byte by byte. compare_digest examines every byte
    regardless of where the first mismatch occurs, so timing reveals nothing.
    """
    expected = hmac_sign(key, message)
    return hmac.compare_digest(expected, signature_hex)


def hash_password(
    password: str,
    *,
    salt: bytes | None = None,
    iterations: int = PBKDF2_ITERATIONS,
) -> str:
    """
    Password Hashing (PBKDF2-HMAC-SHA256, per-password random salt)
    Time: O(iterations) — deliberately slow to throttle offline guessing
    Space: O(1)
    Interview note: never store plaintext or fast hashes; salt defeats rainbow tables, iterations defeat brute force (vault: password storage).

    In production prefer argon2 or bcrypt (memory-hard / battle-tested
    libraries), but PBKDF2 via hashlib.pbkdf2_hmac is the stdlib-correct
    pattern: a fresh 16-byte random salt per password and 600k iterations
    (OWASP's 2023+ recommendation for PBKDF2-SHA256). The salt is not a
    secret — it is stored alongside the hash in the format
    "salt_hex$hash_hex" so verify_password can recompute the derivation.
    """
    if salt is None:
        salt = secrets.token_bytes(16)
    derived = hashlib.pbkdf2_hmac(
        _PBKDF2_HASH_NAME, password.encode("utf-8"), salt, iterations
    )
    return f"{salt.hex()}${derived.hex()}"


def verify_password(
    password: str, stored: str, *, iterations: int = PBKDF2_ITERATIONS
) -> bool:
    """
    Password Verification (constant-time comparison)
    Time: O(iterations)
    Space: O(1)
    Interview note: re-derive with the stored salt and compare via compare_digest — never == (vault: password storage, timing attacks).
    Returns False for malformed stored strings instead of raising.
    """
    try:
        salt_hex, hash_hex = stored.split("$")
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
    except ValueError:
        return False
    derived = hashlib.pbkdf2_hmac(
        _PBKDF2_HASH_NAME, password.encode("utf-8"), salt, iterations
    )
    return hmac.compare_digest(derived, expected)


def generate_token(nbytes: int = 32) -> str:
    """
    Secure Random Token (URL-safe)
    Time: O(nbytes)
    Space: O(nbytes)
    Interview note: secrets uses the OS CSPRNG; use for CSRF tokens, session ids, password-reset links (vault: CSRF tokens).

    Why the random module is NOT for security: random uses the Mersenne
    Twister, a deterministic PRNG whose entire internal state can be
    reconstructed from ~624 consecutive outputs — an attacker who sees a few
    tokens can predict every future one. secrets.token_urlsafe reads from
    the OS entropy pool (os.urandom), which is unpredictable by design.
    """
    if nbytes <= 0:
        raise ValueError("generate_token requires a positive byte count")
    return secrets.token_urlsafe(nbytes)


def constant_time_equals(a: bytes | str, b: bytes | str) -> bool:
    """
    Constant-Time Equality Wrapper
    Time: O(n) — always, never short-circuits
    Space: O(1)
    Interview note: use for any secret comparison (tokens, MACs, API keys); plain == leaks match length via timing (vault: timing attacks).
    str arguments are UTF-8 encoded first, so str and bytes may be mixed.
    """
    if isinstance(a, str):
        a = a.encode("utf-8")
    if isinstance(b, str):
        b = b.encode("utf-8")
    return hmac.compare_digest(a, b)
