# BibleStudy — Life-Study Review Guides

A visual, concise review companion for the *Life-Study of the Bible* by Witness Lee (source: [bibleread.online](https://bibleread.online/life-study-of-the-bible/)).

## 🔗 Canonical Naming Standard

All book folders and message HTML file names strictly follow the structure from:
👉 [https://github.com/Penk13/WebToEpub/tree/main/results](https://github.com/Penk13/WebToEpub/tree/main/results)

- **Book Folder:** Matches the folder name under `results/` (e.g. `life-study-of-hebrews`, `life-study-of-romans`, `life-study-of-exodus`).
- **HTML Message Name:** Matches the `.epub` filename, replacing `.epub` with `.html` (e.g. `001-A-Foreword.epub` → `001-A-Foreword.html`).

## Design Philosophy

- **Visual over Text:** Flowcharts, pipelines, and balanced contrast cards to anchor mental models quickly.
- **Review-Centric:** Designed for rapid review right after reading the actual Life-Study book.
- **Active Recall:** 3–5 open-ended reflection questions with expandable key insights (no form textboxes).
- **Verbatim NKJV Clickable Scripture:** Instant offline popup dialog for any Bible verse cited.
- **Strict 5-Color Unified Palette:** High contrast, zero color clutter (neutral charcoal dark, white, gray, and strictly ONE luminous light blue #38bdf8 for crisp readability).
- **Simple, Standalone Architecture:** Clean HTML & CSS with zero build steps or external dependencies.

## Structure

```text
BibleStudy/
├── TEMPLATE.md                       # Master authoring guide & HTML boilerplate
├── README.md
├── index.html                        # Main library portal (lists all available Life-Study books)
├── shared/                           # Universal shared assets (no code repetition)
│   ├── styles.css                    # Universal design system & typography
│   └── verse-modal.js                # Instant modal popup engine
├── life-study-of-hebrews/            # Matches Penk13/WebToEpub results/life-study-of-hebrews
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
│   ├── index.html                    # Searchable message directory for Hebrews
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   ├── 002-God-Has-Spoken.html       # Matches 002-God-Has-Spoken.epub
│   └── ... (003 to 069)
├── life-study-of-romans/             # Matches Penk13/WebToEpub results/life-study-of-romans
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
│   ├── index.html                    # Searchable message directory for Romans
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   └── 002-The-Gospel-of-God.html   # Matches 002-The-Gospel-of-God.epub
└── life-study-of-exodus/ (upcoming)
```
