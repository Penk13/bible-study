# BibleStudy — Life-Study Review Guides

A visual, concise review companion for the *Life-Study of the Bible* by Witness Lee (source: [bibleread.online](https://bibleread.online/life-study-of-the-bible/)).

**Live site:** https://bible-study.penk13.workers.dev

## 🔗 Canonical Naming Standard

All book folders and message HTML file names strictly follow the structure from:
👉 [https://github.com/Penk13/WebToEpub/tree/main/results](https://github.com/Penk13/WebToEpub/tree/main/results)

- **Book Folder:** Matches the folder name under `results/` (e.g. `life-study-of-hebrews`, `life-study-of-romans`, `life-study-of-exodus`).
- **HTML Message Name:** Matches the `.epub` filename, replacing `.epub` with `.html` (e.g. `001-A-Foreword.epub` → `001-A-Foreword.html`).

## Design Philosophy (Mobile-First)

- **Mobile-First Reading Experience:** Engineered primarily for one-handed phone reading (`360px–430px` viewports) with notch & home-indicator safe-area insets (`viewport-fit=cover`), instant touch feedback, minimum 44px touch targets, a reading progress bar, and a sleek bottom-sheet Scripture drawer. Desktop is a clean progressive enhancement.
- **Review-Centric:** Designed for high-yield, rapid review right after reading the actual Life-Study message.
- **Visual over Walls of Text:** Mobile-optimized vertical flow cards, pipelines, and high-contrast dual cards to anchor mental models quickly without endless scrolling.
- **Active Recall:** 3–5 open-ended reflection questions with thumb-friendly tap disclosures for key insights (no form textboxes).
- **Verbatim NKJV Scripture Bottom-Sheet:** Instant drawer for any Bible verse cited (text bundled in each book's `verses.js`), with touch swipe-to-dismiss and a one-tap toggle to the Indonesian TB2 translation.
- **Strict 5-Color Unified Palette:** OLED-friendly deep dark canvas (`#111113`), crisp surfaces (`#18181b`), white headings (`#fafafa`), readable zinc body text (`#d4d4d8`), and strictly ONE luminous sky blue (`#38bdf8`) for zero visual fatigue.
- **Simple, Standalone Architecture:** Clean, pure HTML & CSS with zero runtime dependencies or heavy frameworks.

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
│   ├── styles.css                    # Universal design system & typography
│   ├── verse-modal.js                # Instant modal popup engine
│   └── index-filter.js               # Live search filter for index pages
├── life-study-of-hebrews/            # Matches Penk13/WebToEpub results/life-study-of-hebrews
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
│   ├── index.html                    # Searchable message directory for Hebrews
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   ├── 002-God-Has-Spoken.html       # Matches 002-God-Has-Spoken.epub
│   └── ... (003 onward, added as messages are written)
├── life-study-of-romans/             # Matches Penk13/WebToEpub results/life-study-of-romans
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
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

- Before building, `build_index.py` validates the site and aborts if a message page is missing from its book index, a book is missing from the root index, a relative link is broken, or a `data-ref` verse is missing from `verses.js`.
- `_headers` sets the Content-Security-Policy and other security headers. Scripts load only from the site itself; `connect-src` allows only `https://bible-api.com` (online fallback for verses missing from `verses.js`).
- `wrangler.jsonc` configures the Cloudflare Worker to serve `./dist`.
- Manual deploy (only if auto-deploy is unavailable):

  ```sh
  python build_index.py
  npx wrangler deploy
  ```
