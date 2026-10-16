# BibleStudy — Life-Study Review Guides

A visual, concise review companion for the *Life-Study of the Bible* by Witness Lee (source: [bibleread.online](https://bibleread.online/life-study-of-the-bible/)).

**Live site:** https://bible-study.penk13.workers.dev

## 🔗 Canonical Naming Standard

All book folders and message HTML file names strictly follow the structure from:
👉 [https://github.com/Penk13/WebToEpub/tree/main/results](https://github.com/Penk13/WebToEpub/tree/main/results)

- **Book Folder:** Matches the folder name under `results/` (e.g. `life-study-of-hebrews`, `life-study-of-romans`, `life-study-of-exodus`).
- **HTML Message Name:** Matches the `.epub` filename, replacing `.epub` with `.html` (e.g. `001-A-Foreword.epub` → `001-A-Foreword.html`).

## Design

- **Reading first, mobile first:** one centered column, serif body text, light and dark themes that follow the device, safe-area insets and 44px touch targets.
- **Review, not transcript:** a rapid-recall summary, 2–4 short sections, then 3–5 reflection questions that open to model answers.
- **Small component set:** cards (with a `pair` variant for type → reality), a numbered flow, tables, callouts and questions. See `TEMPLATE.md`.
- **Tappable Scripture:** every cited verse opens a bottom sheet with NKJV and Indonesian TB2 text from `shared/verses.js`.
- **Plain HTML & CSS:** no frameworks, no build-time templating, no runtime dependencies.

## Structure

```text
BibleStudy/
├── TEMPLATE.md                       # Master authoring guide & HTML boilerplate
├── README.md
├── build_index.py                    # Static dist packager for Cloudflare deployment
├── wrangler.jsonc                    # Cloudflare Worker static assets configuration
├── _headers                          # Security headers (CSP) served by Cloudflare
├── index.html                        # Main library portal (lists all available Life-Study books)
├── shared/                           # Universal shared assets (no code repetition)
│   ├── styles.css                    # Design system (all components)
│   ├── verses.js                     # Scripture dictionary for all books (NKJV + TB2)
│   ├── verse-modal.js                # Verse bottom sheet + reading progress
│   └── index-filter.js               # Live search for index pages
├── life-study-of-hebrews/            # Matches Penk13/WebToEpub results/life-study-of-hebrews
│   ├── index.html                    # Searchable message directory for Hebrews
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   ├── 002-God-Has-Spoken.html       # Matches 002-God-Has-Spoken.epub
│   └── ... (003 onward, added as messages are written)
├── life-study-of-romans/             # Matches Penk13/WebToEpub results/life-study-of-romans
│   ├── index.html                    # Searchable message directory for Romans
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   └── 002-The-Gospel-of-God.html   # Matches 002-The-Gospel-of-God.epub
└── life-study-of-exodus/ (upcoming)
```

## Site & Deployment

Static site deployed as a Cloudflare Worker with static assets. **Auto-deploys on every push to `main`** — Cloudflare runs the build and publishes `dist/`; no manual deploy needed.

- `build_index.py` builds the site into `dist/` (gitignored), packaging all book guides and shared styles while excluding markdown authoring notes (`TEMPLATE.md`, `README.md`) and internal repository files. It is the Cloudflare build command; run it locally to check the build:

  ```sh
  python build_index.py
  ```

- Before building, `build_index.py` validates the site and aborts if a message page is missing from its book index, a book is missing from the root index, a relative link is broken, or a `data-ref` verse is missing from (or defined twice in) `shared/verses.js`.
- `_headers` sets the Content-Security-Policy and other security headers. Scripts load only from the site itself; `connect-src` allows only `https://bible-api.com` (online fallback for verses missing from `verses.js`).
- `wrangler.jsonc` configures the Cloudflare Worker to serve `./dist`.
- Manual deploy (only if auto-deploy is unavailable):

  ```sh
  python build_index.py
  npx wrangler deploy
  ```
