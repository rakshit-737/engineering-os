from __future__ import annotations

import hashlib
import string
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.security_utils import (
    constant_time_equals,
    generate_token,
    hash_password,
    hmac_sign,
    hmac_verify,
    sha256_file,
    sha256_hex,
    verify_password,
)

# Well-known PBKDF2-HMAC-SHA256 test vector: P="password", S="salt", c=1.
_PBKDF2_KAT_SALT = b"salt"
_PBKDF2_KAT_1_ITER = (
    "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b"
)


class TestSecurityUtils(unittest.TestCase):
    def test_sha256_hex_known_vectors(self) -> None:
        empty = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        abc = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        self.assertEqual(sha256_hex(""), empty)
        self.assertEqual(sha256_hex(b""), empty)
        self.assertEqual(sha256_hex("abc"), abc)
        self.assertEqual(sha256_hex(b"abc"), abc)

    def test_sha256_file_matches_sha256_hex(self) -> None:
        payload = b"chunked-read-test\n" * 5000
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "payload.bin"
            path.write_bytes(payload)
            self.assertEqual(sha256_file(path, chunk_size=1024), sha256_hex(payload))
            empty_path = Path(tmp) / "empty.bin"
            empty_path.write_bytes(b"")
            self.assertEqual(sha256_file(empty_path), sha256_hex(b""))

    def test_sha256_file_rejects_non_positive_chunk_size(self) -> None:
        # Regression: read(0) returns b"" immediately, silently hashing nothing.
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "payload.bin"
            path.write_bytes(b"data")
            with self.assertRaises(ValueError):
                sha256_file(path, chunk_size=0)
            with self.assertRaises(ValueError):
                sha256_file(path, chunk_size=-1)

    def test_hmac_sign_and_verify_roundtrip(self) -> None:
        key = b"server-secret"
        message = b"amount=100&to=alice"
        signature = hmac_sign(key, message)
        self.assertEqual(len(signature), 64)
        self.assertTrue(hmac_verify(key, message, signature))

    def test_hmac_verify_rejects_tampered_message(self) -> None:
        key = b"server-secret"
        signature = hmac_sign(key, b"amount=100&to=alice")
        self.assertFalse(hmac_verify(key, b"amount=999&to=mallory", signature))
        self.assertFalse(hmac_verify(key, b"amount=100&to=alice", signature[:-1] + "0"))

    def test_hmac_verify_rejects_wrong_key(self) -> None:
        message = b"payload"
        signature = hmac_sign(b"right-key", message)
        self.assertFalse(hmac_verify(b"wrong-key", message, signature))

    def test_hash_password_format_and_random_salt(self) -> None:
        first = hash_password("hunter2", iterations=1000)
        second = hash_password("hunter2", iterations=1000)
        self.assertNotEqual(first, second)  # per-password random salt
        salt_hex, hash_hex = first.split("$")
        self.assertEqual(len(bytes.fromhex(salt_hex)), 16)
        self.assertEqual(len(bytes.fromhex(hash_hex)), 32)

    def test_verify_password_accepts_correct(self) -> None:
        stored = hash_password("correct horse battery staple", iterations=1000)
        self.assertTrue(
            verify_password("correct horse battery staple", stored, iterations=1000)
        )

    def test_verify_password_rejects_wrong_password(self) -> None:
        stored = hash_password("correct horse battery staple", iterations=1000)
        self.assertFalse(verify_password("Tr0ub4dor&3", stored, iterations=1000))
        self.assertFalse(verify_password("", stored, iterations=1000))

    def test_verify_password_rejects_malformed_stored(self) -> None:
        self.assertFalse(verify_password("x", "not-a-valid-record", iterations=1000))
        self.assertFalse(verify_password("x", "zz$zz", iterations=1000))
        self.assertFalse(verify_password("x", "", iterations=1000))
        # Valid salt hex but non-hex / non-ASCII hash part must return False,
        # not raise (regression: compare_digest on non-ASCII str raises TypeError).
        self.assertFalse(verify_password("x", "aa$héllo", iterations=1000))
        self.assertFalse(verify_password("x", "aa$zz", iterations=1000))
        self.assertFalse(verify_password("x", "a$b$c", iterations=1000))

    def test_pbkdf2_known_answer_fixed_salt(self) -> None:
        stored = hash_password("password", salt=_PBKDF2_KAT_SALT, iterations=1)
        self.assertEqual(stored, f"{_PBKDF2_KAT_SALT.hex()}${_PBKDF2_KAT_1_ITER}")
        # Cross-check the module against hashlib directly at 1000 iterations.
        expected = hashlib.pbkdf2_hmac(
            "sha256", b"password", _PBKDF2_KAT_SALT, 1000
        ).hex()
        stored_1000 = hash_password("password", salt=_PBKDF2_KAT_SALT, iterations=1000)
        self.assertEqual(stored_1000.split("$")[1], expected)
        self.assertTrue(verify_password("password", stored_1000, iterations=1000))

    def test_default_iterations_roundtrip(self) -> None:
        stored = hash_password("pw")  # default 600k iterations
        self.assertTrue(verify_password("pw", stored))
        self.assertFalse(verify_password("pW", stored))

    def test_generate_token_uniqueness_and_length(self) -> None:
        tokens = {generate_token() for _ in range(100)}
        self.assertEqual(len(tokens), 100)  # CSPRNG collisions are not plausible
        short = generate_token(8)
        long = generate_token(64)
        self.assertGreater(len(long), len(short))
        # token_urlsafe(n) yields ~4/3 * n base64 chars.
        self.assertGreaterEqual(len(generate_token(32)), 32)
        with self.assertRaises(ValueError):
            generate_token(0)

    def test_generate_token_urlsafe_charset(self) -> None:
        allowed = set(string.ascii_letters + string.digits + "-_")
        for _ in range(20):
            self.assertTrue(set(generate_token(48)) <= allowed)

    def test_constant_time_equals(self) -> None:
        self.assertTrue(constant_time_equals(b"secret", b"secret"))
        self.assertTrue(constant_time_equals("secret", "secret"))
        self.assertFalse(constant_time_equals(b"secret", b"secreT"))
        self.assertFalse(constant_time_equals("secret", "secrets"))
        self.assertFalse(constant_time_equals("", "x"))
        self.assertTrue(constant_time_equals("", ""))


if __name__ == "__main__":
    unittest.main()
