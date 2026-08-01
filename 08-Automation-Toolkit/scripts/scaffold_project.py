from __future__ import annotations

import argparse
from pathlib import Path


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def scaffold_python_api(root: Path) -> None:
    files = {
        "README.md": "# Project\n\n## Quickstart\n\n```bash\npython -m venv .venv\n```\n",
        "src/main.py": "def main() -> None:\n    print(\"hello\")\n\n\nif __name__ == \"__main__\":\n    main()\n",
        "tests/test_smoke.py": "def test_smoke() -> None:\n    assert True\n",
        ".gitignore": "__pycache__/\n.venv/\n.pytest_cache/\n",
    }
    for rel, content in files.items():
        write_file(root / rel, content)


def scaffold_web_app(root: Path) -> None:
    files = {
        "README.md": "# Web App\n\n## Setup\n\nDescribe install and run steps here.\n",
        "src/index.html": "<!doctype html><html><head><meta charset='utf-8'><title>App</title></head><body><div id='app'></div></body></html>",
        "src/styles.css": ":root { --bg: #f7f7f2; --fg: #1e1e1b; } body { background: var(--bg); color: var(--fg); }",
    }
    for rel, content in files.items():
        write_file(root / rel, content)


def main() -> None:
    parser = argparse.ArgumentParser(description="Project scaffold generator")
    parser.add_argument("--name", required=True, help="Project folder name")
    parser.add_argument(
        "--template",
        required=True,
        choices=["python-api", "web-app"],
        help="Scaffold template",
    )
    parser.add_argument(
        "--base-dir",
        default=".",
        help="Base directory where project folder will be created",
    )
    args = parser.parse_args()

    root = Path(args.base_dir).resolve() / args.name
    root.mkdir(parents=True, exist_ok=True)

    if args.template == "python-api":
        scaffold_python_api(root)
    elif args.template == "web-app":
        scaffold_web_app(root)

    print(f"Scaffold created at: {root}")


if __name__ == "__main__":
    main()
