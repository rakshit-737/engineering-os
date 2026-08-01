"""Path traversal defense: canonicalize, then check containment.

Threat: user-supplied filename like '../../secret.txt' escaping the
intended directory.
Principle: resolve() BEFORE the containment check; string prefix checks
on unresolved paths are bypassable.
"""

from __future__ import annotations

from pathlib import Path


class UnsafePathError(ValueError):
    pass


def safe_join(base_dir: Path, user_filename: str) -> Path:
    """Join user input to a base directory, guaranteed to stay inside it."""
    base = base_dir.resolve()
    candidate = (base / user_filename).resolve()
    if not candidate.is_relative_to(base):
        raise UnsafePathError(f"path escapes base directory: {user_filename!r}")
    return candidate


if __name__ == "__main__":
    import tempfile

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp) / "uploads"
        base.mkdir()
        (base / "report.txt").write_text("ok")

        assert safe_join(base, "report.txt").read_text() == "ok"
        assert safe_join(base, "sub/../report.txt").read_text() == "ok"

        attacks = ["../outside.txt", "..\\..\\windows\\win.ini", "sub/../../escape"]
        for attack in attacks:
            try:
                safe_join(base, attack)
                raise AssertionError(f"should have blocked: {attack}")
            except UnsafePathError:
                pass

    print("path_traversal_defense: traversal attempts blocked, legit paths served")
