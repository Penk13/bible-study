"""Build the static site into dist/.

Copies static assets, shared styles/scripts, book guides, and index pages
into dist/, excluding repo-only files (*.md, dotfiles, OS metadata), plus
the Cloudflare `_headers` file (security headers / CSP).

Before building it validates the site and aborts on:
  - a message page not linked from its book's index.html
  - a book folder not linked from the root index.html
  - a relative href/src pointing at a missing file
  - a .verse-ref data-ref missing from shared/verses.js
  - a verse key defined twice in shared/verses.js

Stdlib only, so it runs locally or as Cloudflare build command:
  python build_index.py
"""

from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
REPO_ONLY = shutil.ignore_patterns("*.md", ".*", "Thumbs.db", "desktop.ini", "__pycache__")

LINK_RE = re.compile(r'(?:href|src)="([^"#:?]+)[^"]*"')
DATA_REF_RE = re.compile(r'data-ref="([^"]+)"')
VERSE_KEY_RE = re.compile(r'^\s*"([^"]+)":\s*\{', re.M)
VERSES_JS = ROOT / "shared" / "verses.js"


def find_book_dirs():
    return sorted(
        d for d in ROOT.iterdir()
        if d.is_dir()
        and d != DIST
        and d.name != "shared"
        and not d.name.startswith(".")
        and any(d.glob("*.html"))
    )


def read(path):
    return path.read_text(encoding="utf-8")


def check_links(page, errors):
    for target in LINK_RE.findall(read(page)):
        if not (page.parent / target).exists():
            errors.append(f"{page.relative_to(ROOT).as_posix()}: broken link -> {target}")


def validate(book_dirs):
    errors = []
    root_index = ROOT / "index.html"
    root_links = set(LINK_RE.findall(read(root_index))) if root_index.exists() else set()
    if root_index.exists():
        check_links(root_index, errors)

    all_keys = VERSE_KEY_RE.findall(read(VERSES_JS)) if VERSES_JS.exists() else []
    verse_keys = set(all_keys)
    for key in sorted({k for k in all_keys if all_keys.count(k) > 1}):
        errors.append(f"shared/verses.js: verse defined twice -> {key}")

    for book in book_dirs:
        index = book / "index.html"
        if not index.exists():
            errors.append(f"{book.name}: missing index.html")
            continue
        if f"{book.name}/index.html" not in root_links:
            errors.append(f"index.html: book not listed -> {book.name}")

        index_links = set(LINK_RE.findall(read(index)))

        for page in sorted(book.glob("*.html")):
            check_links(page, errors)
            if page.name == "index.html":
                continue
            if page.name not in index_links:
                errors.append(f"{book.name}/index.html: message not listed -> {page.name}")
            for ref in sorted(set(DATA_REF_RE.findall(read(page))) - verse_keys):
                errors.append(f"{page.relative_to(ROOT).as_posix()}: verse missing from verses.js -> {ref}")

    return errors


def main():
    book_dirs = find_book_dirs()
    errors = validate(book_dirs)
    if errors:
        print("Build aborted, fix these first:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)

    shutil.rmtree(DIST, ignore_errors=True)
    DIST.mkdir(parents=True, exist_ok=True)

    # 1. Root index.html
    root_index = ROOT / "index.html"
    if root_index.exists():
        shutil.copy2(root_index, DIST / "index.html")

    # Cloudflare static-assets headers (CSP etc.)
    headers = ROOT / "_headers"
    if headers.exists():
        shutil.copy2(headers, DIST / "_headers")

    # 2. Shared assets
    shared_dir = ROOT / "shared"
    if shared_dir.is_dir():
        shutil.copytree(shared_dir, DIST / "shared", ignore=REPO_ONLY)

    # 3. Content folders (e.g. life-study-of-hebrews, life-study-of-romans)
    for book in book_dirs:
        shutil.copytree(book, DIST / book.name, ignore=REPO_ONLY)

    print(f"Built site into {DIST.name}/ with {len(book_dirs)} book study guide(s).")


if __name__ == "__main__":
    main()
