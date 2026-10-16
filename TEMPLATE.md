# Message Page Template & Authoring Guide

How to write a review page for any book of the *Life-Study of the Bible*. Pages are plain HTML using a small set of components from `shared/styles.css`. No inline styles, no inline scripts (the CSP blocks them).

## Principles

- **Review, not transcript.** Written for after reading the real message: the vital lines, not every point.
- **Short.** A recap bullet is one or two sentences. A section is a heading, a short paragraph, and at most one or two components.
- **One component per idea.** Pick the component that matches the shape of the idea (see below); plain paragraphs are fine too.
- **Every verse is tappable.** Cite Scripture with a `.verse-ref` button; the text comes from `shared/verses.js` (NKJV + Indonesian TB2).
- **Mobile first.** Everything is designed for a phone; desktop just gets more room. Light and dark themes follow the device.

## Naming

Folder and file names match [Penk13/WebToEpub `results/`](https://github.com/Penk13/WebToEpub/tree/main/results):

- Book folder = the folder under `results/` (`life-study-of-hebrews`).
- Message file = the `.epub` name with `.html` (`003-The-Son.epub` → `003-The-Son.html`).

## Page structure

```
bar           Life-Study / Book                         006
page-head     eyebrow · h1 · dek · key verses
recap         Rapid recall — 3–5 bullets
section × 2–4 h2 · p · one component
reflect       3–5 questions, each opens to an answer
pager         ← Previous      Next →
```

## Full page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#131313" media="(prefers-color-scheme: dark)">
  <title>Message {{NNN}}: {{TITLE}} — Life-Study of {{BOOK}}</title>
  <link rel="stylesheet" href="../shared/styles.css">
</head>
<body>

  <header class="bar">
    <a href="../index.html">Life-Study</a>
    <span class="sep">/</span>
    <a href="index.html">{{BOOK}}</a>
    <span class="here">{{NNN}}</span>
  </header>

  <main class="page">
    <header class="page-head">
      <p class="eyebrow">{{BOOK}} · Message {{N}}</p>
      <h1>{{TITLE}}</h1>
      <p class="dek">{{ONE OR TWO SENTENCES: THE CENTRAL REVELATION}}</p>
      <p class="keyverses"><span>Key verses</span>
        <button type="button" class="verse-ref" data-ref="Hebrews 2:3">Heb. 2:3</button>
        <button type="button" class="verse-ref" data-ref="Hebrews 2:10">Heb. 2:10</button>
      </p>
    </header>

    <section class="recap" aria-label="Rapid recall">
      <h2>Rapid recall</h2>
      <ul>
        <li><strong>{{POINT}}:</strong> {{ONE OR TWO SENTENCES}}</li>
        <li><strong>{{POINT}}:</strong> {{ONE OR TWO SENTENCES}}</li>
        <li><strong>{{POINT}}:</strong> {{ONE OR TWO SENTENCES}}</li>
      </ul>
    </section>

    <section>
      <h2>{{SECTION TITLE}}</h2>
      <p>{{SHORT PARAGRAPH}}</p>
      <!-- one component -->
    </section>

    <section class="reflect">
      <h2>Reflect</h2>
      <p class="dek">Think each question through first, then open it to compare.</p>

      <div class="questions">
        <details class="q">
          <summary><span class="q-text">{{QUESTION}}</span><span class="q-hint">{{HINT}}</span></summary>
          <div class="answer">
            <p><strong>{{LABEL}}:</strong> {{INSIGHT}}</p>
            <p><strong>{{LABEL}}:</strong> {{INSIGHT}}</p>
          </div>
        </details>
      </div>
    </section>

    <nav class="pager" aria-label="Messages">
      <a class="prev" href="{{PREV}}.html"><small>← Previous</small>{{PREV_NNN}} · {{PREV_TITLE}}</a>
      <a class="next" href="{{NEXT}}.html"><small>Next →</small>{{NEXT_NNN}} · {{NEXT_TITLE}}</a>
    </nav>
  </main>

  <script src="../shared/verses.js"></script>
  <script src="../shared/verse-modal.js"></script>
</body>
</html>
```

Omit `.prev` on the first message and `.next` on the latest one. When adding a message, also add a `.next` link to the previous page.

## Components

### Cards — contrasts, sets of 2–4 items

Use for law vs. grace, three aspects, items of furniture. Add `key` to the card that is the point (usually the positive or New Testament side). Label, icon and list are optional.

```html
<div class="cards">
  <div class="card">
    <span class="card-label">Old Covenant</span>
    <h4>Standing Daily</h4>
    <p>The priests never sat down; the work was never finished.</p>
  </div>
  <div class="card key">
    <span class="card-label">New Covenant</span>
    <h4>Sat Down Forever</h4>
    <p>One sacrifice, finished (<button type="button" class="verse-ref" data-ref="Hebrews 10:12">Heb. 10:12</button>).</p>
  </div>
</div>
```

```html
<div class="card">
  <span class="card-icon" aria-hidden="true">💡</span>
  <h4>Light</h4>
  <p>Dispels inward darkness.</p>
</div>
```

### Pair — type → reality, before → after

Same as cards, plus `pair`: exactly two cards joined by an arrow (↓ on phones, → on wider screens).

```html
<div class="cards pair">
  <div class="card">
    <span class="card-icon" aria-hidden="true">🐑</span>
    <h4>The Passover Lamb</h4>
    <p>Slain and eaten in Egypt.</p>
  </div>
  <div class="card key">
    <span class="card-icon" aria-hidden="true">✝️</span>
    <h4>Christ Our Passover</h4>
    <p>The Lamb of God (<button type="button" class="verse-ref" data-ref="John 1:29">John 1:29</button>).</p>
  </div>
</div>
```

### Flow — journeys, stages, progressions

A numbered timeline inside a figure. Each step: a title, an optional `shift` (from → to), and an optional `via` line (what causes the move). Don't number the titles; the dots do it.

```html
<figure class="figure">
  <figcaption>The Three Stages of Salvation</figcaption>
  <ol class="flow">
    <li>
      <h4>Out of Egypt <button type="button" class="verse-ref" data-ref="Hebrews 1:3">Heb. 1:3</button></h4>
      <p class="shift"><span>Slavery in Egypt</span><span class="arrow" aria-hidden="true">→</span><span>Initial Salvation</span></p>
      <p class="via"><strong>Passover &amp; Red Sea</strong> — Purification of sins</p>
    </li>
  </ol>
  <p class="callout">Optional one-line motto.</p>
</figure>
```

A figure can also hold a plain `<ol>`/`<ul>` (e.g. the outline of a book).

### Table — cross-references and surveys

Use when there are 3+ attributes per row. Wrap for horizontal scroll on phones; mark the key row with `class="key"`.

```html
<div class="table-wrap">
  <table>
    <thead>
      <tr><th>Covenant</th><th>Characteristic</th><th>Reality</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Old</strong></td><td>Letters on stone</td><td>A shadow</td></tr>
      <tr class="key"><td><strong>New</strong></td><td>Law of life in the heart</td><td>Christ Himself</td></tr>
    </tbody>
  </table>
</div>
```

### Callout — a note or summary

```html
<aside class="callout">
  <h3>The Extract of Romans</h3>
  <p>“The just shall have life and live by faith.”</p>
</aside>
```

## Reflection questions

3–5 per message, open-ended (no text boxes). Good angles:

1. **Definition** — what is this truth intrinsically, beyond religious tradition?
2. **Contrast** — how does the type/law/prophet compare with Christ/the Son/the Spirit?
3. **Deviation** — how can good practices become an empty shell without Christ?
4. **Experience** — what does it mean today to turn to the spirit and touch Christ as ___?

Answers: 2–3 short paragraphs, each led by a bold label.

## Scripture (`shared/verses.js`)

One dictionary serves every book. Before adding a verse, search the file: it may already be there. Keep entries in Bible order under their book's `// --- Book ---` comment. Every `data-ref` must exist in it, and each key may appear only once (the build fails otherwise). Use full book names in `data-ref` (`Hebrews 2:3`), abbreviations in the visible label (`Heb. 2:3`). Only add verses a page actually cites. `text` is NKJV without surrounding quote marks (the sheet adds them).

```javascript
window.BIBLE_VERSES_NKJV = {
  "Romans 8:2": {
    ref: "Romans 8:2",
    refTB2: "Roma 8:2",
    version: "NKJV",
    text: "For the law of the Spirit of life in Christ Jesus has made me free from the law of sin and death.",
    tb2: "Sebab hukum Roh yang memberi hidup telah membebaskan engkau dalam Kristus Yesus dari hukum dosa dan kematian."
  }
};
```

## Book index (`index.html`)

Each book folder lists its messages in `#filter-list` (searchable via `shared/index-filter.js`). Every message file must be listed (the build checks).

```html
<li><a href="006-So-Great-a-Salvation.html"><span class="toc-num">006</span><span class="toc-title">So Great a Salvation</span></a></li>
```

A new book also needs an entry in the root `index.html`:

```html
<li><a href="life-study-of-romans/index.html"><span class="toc-title">Romans</span><span class="toc-meta">2 messages</span></a></li>
```

## Writing rules

- HTML, not Markdown: `<em>metochoi</em>`, never `*metochoi*`.
- Escape `&` as `&amp;` in text.
- No `style="…"` attributes and no new classes; if a page needs something new, add it to `shared/styles.css` and document it here.
