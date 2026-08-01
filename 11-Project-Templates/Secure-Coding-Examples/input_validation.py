"""Boundary input validation: allowlist over blocklist, reject over repair.

Threat: hostile or malformed input reaching business logic.
Principle: validate structure, type, length, and range at the boundary.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

# Allowlist patterns: define what IS valid, never enumerate what is "bad".
USERNAME_RE = re.compile(r"^[a-z0-9_]{3,32}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$")


class ValidationError(ValueError):
    pass


@dataclass(frozen=True)
class Registration:
    username: str
    email: str
    age: int


def validate_registration(raw: dict) -> Registration:
    """Parse-don't-validate: output is a typed object or an exception."""
    username = str(raw.get("username", "")).strip().lower()
    if not USERNAME_RE.fullmatch(username):
        raise ValidationError("username must be 3-32 chars of a-z, 0-9, _")

    email = str(raw.get("email", "")).strip()
    if len(email) > 254 or not EMAIL_RE.fullmatch(email):
        raise ValidationError("invalid email")

    try:
        age = int(raw.get("age", -1))
    except (TypeError, ValueError):
        raise ValidationError("age must be an integer") from None
    if not 13 <= age <= 130:
        raise ValidationError("age out of range")

    return Registration(username=username, email=email, age=age)


if __name__ == "__main__":
    ok = validate_registration({"username": "rakshit_01", "email": "a@b.io", "age": "20"})
    assert ok.age == 20

    hostile_inputs = [
        {"username": "a; DROP TABLE users;--", "email": "a@b.io", "age": 20},
        {"username": "valid_name", "email": "not-an-email", "age": 20},
        {"username": "valid_name", "email": "a@b.io", "age": "NaN"},
        {"username": "x" * 500, "email": "a@b.io", "age": 20},
    ]
    for raw in hostile_inputs:
        try:
            validate_registration(raw)
            raise AssertionError(f"should have rejected: {raw}")
        except ValidationError:
            pass
    print("input_validation: all hostile inputs rejected, valid input parsed")
