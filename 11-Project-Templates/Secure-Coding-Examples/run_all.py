"""Run every secure-coding demo; non-zero exit if any fails."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

EXAMPLES = [
    "input_validation.py",
    "sql_injection_prevention.py",
    "password_hashing.py",
    "path_traversal_defense.py",
    "url_validation_ssrf.py",
]


def main() -> int:
    here = Path(__file__).resolve().parent
    failures = 0
    for name in EXAMPLES:
        result = subprocess.run([sys.executable, str(here / name)], capture_output=True, text=True)
        status = "PASS" if result.returncode == 0 else "FAIL"
        print(f"[{status}] {name}")
        if result.returncode != 0:
            failures += 1
            print(result.stdout)
            print(result.stderr)
    print(f"\n{len(EXAMPLES) - failures}/{len(EXAMPLES)} examples passed")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
