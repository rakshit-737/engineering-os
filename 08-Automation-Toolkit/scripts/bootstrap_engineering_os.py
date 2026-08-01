"""One-command bootstrap: replicate this Engineering OS into any target directory.

Usage:
    python bootstrap_engineering_os.py <target_dir> [--dry-run] [--force]

Copies the full asset tree (templates, scripts, vault, docs) while skipping
runtime junk (__pycache__, .venv, .git, caches). Idempotent by default:
existing files at the target are left untouched unless --force is passed,
so re-running after you have customized your copy is safe.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

SKIP_DIRS = {"__pycache__", ".git", ".venv", "venv", ".pytest_cache", ".mypy_cache", "node_modules"}
SKIP_SUFFIXES = {".pyc", ".pyo", ".log", ".tmp"}


def iter_source_files(root: Path):
    for path in sorted(root.rglob("*")):
        if path.is_dir():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in SKIP_SUFFIXES:
            continue
        yield path


def bootstrap(source_root: Path, target_root: Path, dry_run: bool, force: bool) -> tuple[int, int]:
    copied = 0
    skipped = 0

    for src in iter_source_files(source_root):
        rel = src.relative_to(source_root)
        dst = target_root / rel

        if dst.exists() and not force:
            skipped += 1
            continue

        action = "would copy" if dry_run else "copy"
        print(f"[{action}] {rel}")
        if not dry_run:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
        copied += 1

    return copied, skipped


def main() -> int:
    parser = argparse.ArgumentParser(description="Bootstrap Engineering OS into a new location")
    parser.add_argument("target", help="Target directory (created if missing)")
    parser.add_argument("--dry-run", action="store_true", help="Show actions without writing")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files at target")
    args = parser.parse_args()

    # Script lives at 08-Automation-Toolkit/scripts/ -> OS root is two levels up.
    source_root = Path(__file__).resolve().parents[2]
    target_root = Path(args.target).resolve()

    if target_root == source_root or target_root.is_relative_to(source_root):
        print("error: target must be outside the source Engineering OS", file=sys.stderr)
        return 2

    copied, skipped = bootstrap(source_root, target_root, args.dry_run, args.force)
    mode = "DRY RUN — nothing written" if args.dry_run else "done"
    print(f"\n{mode}: {copied} files copied, {skipped} existing files kept")
    if not args.dry_run:
        print(f"Engineering OS ready at: {target_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
