from __future__ import annotations

import argparse
from pathlib import Path


def normalize_extension(path: Path) -> str:
    ext = path.suffix.lower().strip(".")
    return ext if ext else "no_extension"


def organize(folder: Path, dry_run: bool = False) -> None:
    moved = 0
    for item in folder.iterdir():
        if not item.is_file():
            continue

        ext = normalize_extension(item)
        target_dir = folder / ext
        target_path = target_dir / item.name

        if dry_run:
            print(f"[DRY RUN] {item} -> {target_path}")
            continue

        target_dir.mkdir(parents=True, exist_ok=True)
        item.rename(target_path)
        moved += 1

    if not dry_run:
        print(f"Moved {moved} files.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Organize files by extension")
    parser.add_argument("folder", help="Folder to organize")
    parser.add_argument("--dry-run", action="store_true", help="Show changes only")
    args = parser.parse_args()

    target = Path(args.folder).resolve()
    if not target.exists() or not target.is_dir():
        raise SystemExit(f"Invalid folder: {target}")

    organize(target, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
