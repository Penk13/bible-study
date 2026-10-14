"""Build the static site into dist/.

Copies static assets, shared styles/scripts, book guides, and index pages
into dist/, excluding repo-only files (*.md, dotfiles, OS metadata).
Stdlib only, so it runs locally or as Cloudflare build command:
  python build_index.py
"""

from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
REPO_ONLY = shutil.ignore_patterns("*.md", ".*", "Thumbs.db", "desktop.ini", "__pycache__")


def main():
    shutil.rmtree(DIST, ignore_errors=True)
    DIST.mkdir(parents=True, exist_ok=True)

    # 1. Root index.html
    root_index = ROOT / "index.html"
    if root_index.exists():
        shutil.copy2(root_index, DIST / "index.html")

    # 2. Shared assets
    shared_dir = ROOT / "shared"
    if shared_dir.is_dir():
        shutil.copytree(shared_dir, DIST / "shared", ignore=REPO_ONLY)

    # 3. Content folders (e.g. life-study-of-hebrews, life-study-of-romans)
    book_dirs = sorted(
        d for d in ROOT.iterdir()
        if d.is_dir()
        and d != DIST
        and d.name != "shared"
        and not d.name.startswith(".")
        and any(d.glob("*.html"))
    )

    for book in book_dirs:
        shutil.copytree(book, DIST / book.name, ignore=REPO_ONLY)

    print(f"Built site into {DIST.name}/ with {len(book_dirs)} book study guide(s).")


if __name__ == "__main__":
    main()
