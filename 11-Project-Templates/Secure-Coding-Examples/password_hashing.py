"""Password storage: salted slow hash + constant-time verification.

Threat: DB dump exposing credentials; timing attacks on comparison.
Principle: never store plaintext or fast hashes (MD5/SHA-x alone).
Stdlib choice: PBKDF2-HMAC-SHA256. In production prefer argon2/bcrypt libs.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets

PBKDF2_ITERATIONS = 600_000  # OWASP 2023+ guidance for PBKDF2-HMAC-SHA256
SALT_BYTES = 16


def hash_password(password: str) -> str:
    """Returns 'iterations$salt_hex$hash_hex' — self-describing record."""
    salt = secrets.token_bytes(SALT_BYTES)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return f"{PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        iterations_str, salt_hex, hash_hex = stored.split("$")
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
    except (ValueError, AttributeError):
        return False

    candidate = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    # hmac.compare_digest prevents timing side channels; == would leak
    # how many leading bytes matched.
    return hmac.compare_digest(candidate, expected)


if __name__ == "__main__":
    record = hash_password("correct horse battery staple")

    assert verify_password("correct horse battery staple", record)
    assert not verify_password("wrong password", record)
    assert not verify_password("correct horse battery staple", "garbage-record")

    # Same password twice -> different records (unique salt).
    assert record != hash_password("correct horse battery staple")

    print("password_hashing: salted PBKDF2 verified, tampered/wrong inputs rejected")
