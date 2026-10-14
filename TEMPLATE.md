# Life-Study Review Page Template & Universal Authoring Guide

This specification defines the universal architecture, visual standards, and authoring rules for creating concise, high-retention review pages for **any book** in the *Life-Study of the Bible* (Genesis, Exodus, Romans, Hebrews, Revelation, etc.).

---

## 🎯 Universal Design Philosophy

1. **Review-Centric (Not a Transcript):** 
   * Designed for rapid review *after* reading the actual Life-Study message.
   * Focuses on distilled spiritual reality, mental anchors, and vital lines of truth.
2. **Visual Over Long Text:** 
   * Replace long walls of text with diagrams, pipelines, balanced grids, and comparison matrices.
3. **No Form Fields / Textboxes:** 
   * Deep reflection questions are open-ended for mental meditation, paired with an expandable `<details>` model breakdown. No form typing is required.
4. **Verbatim NKJV Clickable Scripture Popups:** 
   * Every Scripture citation is an interactive `.verse-ref` button that opens an instant modal displaying the exact **New King James Version (NKJV)** text (100% offline-ready).
5. **Strict 5-Color Unified Palette:**
   * Avoid color clutter and avoid multiple shades of blue. The entire site uses strictly 5 colors:
     1. **Base Dark Canvas & Cards:** `#111113` / `#18181b` (True neutral zinc/charcoal, zero blue tint).
     2. **Neutral Gray Text & Borders:** `#d4d4d8` (body) / `#a1a1aa` (muted) / `#27272a` (borders).
     3. **White Contrast:** `#fafafa` / `#ffffff` (Headings, titles, high contrast).
     4. **The Single Accent Light Blue:** `#38bdf8` (Luminous sky-400 for high contrast against dark background on ALL links, badges, arrows).
     5. **Subtle Light Blue Wash:** `rgba(56, 189, 248, 0.08)` (Subtle 8% background tint for highlighted elements).

---

## 🔗 Canonical Naming Standard: Penk13/WebToEpub

All book folder names and message HTML file names **must strictly match** the canonical structure in the GitHub repository:
👉 [https://github.com/Penk13/WebToEpub/tree/main/results](https://github.com/Penk13/WebToEpub/tree/main/results)

### 📌 Strict Naming Rules:
1. **Book Folder Name:**
   Must be **identical** to the book directory under `results/` in the repository.
   * *Examples:* `life-study-of-hebrews`, `life-study-of-romans`, `life-study-of-exodus`.
2. **Message HTML File Name:**
   Must be **identical** to the `.epub` filename in that folder, replacing the `.epub` extension with `.html`.
   * *GitHub:* `results/life-study-of-hebrews/001-A-Foreword.epub`
     → *Local HTML:* `life-study-of-hebrews/001-A-Foreword.html`
   * *GitHub:* `results/life-study-of-hebrews/002-God-Has-Spoken.epub`
     → *Local HTML:* `life-study-of-hebrews/002-God-Has-Spoken.html`
   * *GitHub:* `results/life-study-of-hebrews/003-The-Son.epub`
     → *Local HTML:* `life-study-of-hebrews/003-The-Son.html`
   * *GitHub:* `results/life-study-of-romans/001-A-Foreword.epub`
     → *Local HTML:* `life-study-of-romans/001-A-Foreword.html`

---

## 📁 Multi-Book Directory Structure

Each book is self-contained in its own folder under `BibleStudy/`:

```text
BibleStudy/
├── TEMPLATE.md                       # Master authoring guide (this file)
├── README.md
├── index.html                        # Main library portal (lists all Life-Study books)
├── shared/                           # Universal shared assets across all books
│   ├── styles.css                    # Master design system & typography
│   └── verse-modal.js                # Instant modal popup engine
├── life-study-of-hebrews/            # Matches Penk13/WebToEpub results/life-study-of-hebrews
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
│   ├── index.html                    # Searchable message directory for Hebrews
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   ├── 002-God-Has-Spoken.html       # Matches 002-God-Has-Spoken.epub
│   └── ...
├── life-study-of-romans/             # Matches results/life-study-of-romans
│   ├── assets/
│   │   └── verses.js                 # Book-specific NKJV Scripture dictionary
│   ├── index.html                    # Searchable message directory for Romans
│   ├── 001-A-Foreword.html           # Matches 001-A-Foreword.epub
│   ├── 002-The-Gospel-of-God.html   # Matches 002-The-Gospel-of-God.epub
│   └── ...
└── life-study-of-exodus/ (upcoming)
    ├── assets/ (verses.js)
    ├── index.html
    └── ...
```

---

## 📐 Page Architecture: The 3 Mandatory Sections

Every message page follows this exact 3-section flow:

```
[ Top Navigation Bar (Index Link · Message Badge · Next/Prev Links) ]
[ Header (Series Badge · Message Title · Summary Dek · Verse Tags) ]
├── 1. ⚡ Rapid Recall (60-Second high-yield summary bullets)
├── 2. 🌊 Main Content: Visual Diagrams & Mental Models
│     ├── Archetype 1: Progression & Process Pipeline (.step-flow / .step-item)
│     ├── Archetype 2: Dual-Aspect Contrast Grid (.contrast-grid / .contrast-card)
│     ├── Archetype 3: Multi-Item Feature Grid (.tri-cards / .dual-cards)
│     ├── Archetype 4: Typology / Metamorphosis Analogy (.analogy-comparison)
│     └── Archetype 5: Tabular Scripture & Revelation Matrix (.table-wrap)
├── 3. 🧠 Active Recall: Deep Reflection (3–5 Open-Ended Questions)
│     └── Prompt Card + Guiding Hint + Expandable Model Review (<details>)
└── [ Bottom Navigation (Prev Message · All Messages · Next Message) ]
```

---

## 🎨 The 5 Universal Visual Archetypes

Every Life-Study message conveys spiritual truth through specific patterns. Match each topic to one of these 5 visual archetypes:

### Archetype 1: Progression & Process Pipeline (`.step-flow`)
**Best for:** Journeys, historical stages, dispensations, and organic growth processes.
* *Examples:* 
  * **Hebrews:** Line of river crossers (Noah → Abraham → Israel → John → Overcomers).
  * **Exodus:** Egypt → Red Sea → Wilderness → Sinai → Tabernacle.
  * **Romans:** Sinner → Justification → Sanctification → Conformation → Glorification → Body Life.
  * **Genesis:** 8 great persons from Adam to Joseph.

```html
<div class="diagram-container">
  <div class="diagram-title">The Divine Progression</div>
  <div class="step-flow">
    
    <div class="step-item">
      <span class="step-badge">1. Starting Point <button type="button" class="verse-ref" data-ref="Gen. 1:1">Gen. 1:1</button></span>
      <div class="step-from">Old Condition / Realm</div>
      <div class="step-transition">
        <span class="step-label">The Transition</span>
        <div class="step-arrow"></div>
        <span class="step-sub">Spiritual Process / Scripture</span>
      </div>
      <div class="step-to">New Reality / Goal</div>
    </div>

    <div class="step-item">
      <span class="step-badge">2. Next Stage</span>
      <div class="step-from">Wilderness Wandering</div>
      <div class="step-transition">
        <span class="step-label">Jordan River</span>
        <div class="step-arrow"></div>
        <span class="step-sub">Crossing into the Good Land</span>
      </div>
      <div class="step-to">Good Land (Christ)</div>
    </div>

  </div>
</div>
```

---

### Archetype 2: Dual-Aspect Contrast Grid (`.contrast-grid`)
**Best for:** Two opposing or complementary realities, warnings vs. promises, or earthly vs. heavenly perspectives.
* *Examples:*
  * **Galatians / Romans:** Law vs. Grace; The Flesh vs. The Spirit; Letter vs. Spirit.
  * **Genesis:** Tree of Knowledge (Death) vs. Tree of Life (Life).
  * **Hebrews:** Outside the Camp (Forsaking religion) vs. Within the Veil (Touching the heavenly Christ).
  * **Revelation:** Babylon the Great (Apostasy) vs. New Jerusalem (The Bride).

```html
<div class="contrast-grid">
  <div class="contrast-card aspect-a">
    <div>
      <span class="contrast-pill">Aspect A / Warning / Type</span>
      <div class="contrast-title">“The Old / Religious / Flesh”</div>
      <p class="contrast-body">Description of the negative, worldly, or preliminary realm to be forsaken.</p>
    </div>
  </div>

  <div class="contrast-card aspect-b">
    <div>
      <span class="contrast-pill">Aspect B / Promise / Reality</span>
      <div class="contrast-title">“The New / Spiritual / Christ”</div>
      <p class="contrast-body">Description of the positive, heavenly, living realm in spirit to be enjoyed.</p>
    </div>
  </div>
</div>
```

---

### Archetype 3: Multi-Item Feature Grid (`.tri-cards` & `.dual-cards`)
**Best for:** 3-part or 2-part divine attributes, items of furniture, offerings, or spiritual virtues.
* *Examples:*
  * **Hebrews:** Light (Shining) $\cdot$ Life (Enlivening) $\cdot$ Power (Growing).
  * **1 Thessalonians:** Spirit $\cdot$ Soul $\cdot$ Body.
  * **Tabernacle:** Outer Court $\cdot$ Holy Place $\cdot$ Holy of Holies.
  * **Offerings:** Burnt Offering $\cdot$ Meal Offering $\cdot$ Peace Offering.

```html
<div class="tri-cards">
  <div class="feature-card">
    <div class="feature-icon">💡</div>
    <h4>1. Light (Shining)</h4>
    <p>Dispels inward darkness and reveals God’s economy.</p>
  </div>

  <div class="feature-card">
    <div class="feature-icon">🌱</div>
    <h4>2. Life (Enlivening)</h4>
    <p>Organically supplies all divine virtues and attributes.</p>
  </div>

  <div class="feature-card highlight">
    <div class="feature-icon">⚡</div>
    <h4>3. Power (Growing)</h4>
    <p>The quiet, enduring, reproductive power of the divine seed.</p>
  </div>
</div>
```

---

### Archetype 4: Typology / Metamorphosis Analogy (`.analogy-comparison`)
**Best for:** Old Testament types fulfilling in New Testament realities, natural illustrations, or seed-to-fruit transformations.
* *Examples:*
  * **Egg → Chicken:** The eggshell of religion vs. the living hatched Christ in heaven.
  * **Passover Lamb → Christ:** The slain lamb protecting the house vs. Christ our true Passover.
  * **Manna → Living Bread:** Physical food in the desert vs. Christ eaten daily in the Word.
  * **Rock Smitten → Spirit Flowing:** The physical rock at Horeb vs. the Spirit gushing from Christ's pierced side.

```html
<div class="analogy-comparison">
  <div class="analogy-box">
    <div class="analogy-icon">🐑</div>
    <h4>The Old Testament Type</h4>
    <p>A physical lamb without blemish, slain and roasted with fire in Egypt.</p>
  </div>

  <div class="analogy-divider">➔</div>

  <div class="analogy-box highlight">
    <div class="analogy-icon">✝️</div>
    <h4>The New Testament Reality</h4>
    <p>Christ, the Lamb of God (<button type="button" class="verse-ref" data-ref="John 1:29">John 1:29</button>), slain for our eternal redemption and eaten as our feast!</p>
  </div>
</div>
```

---

### Archetype 5: Tabular Revelation Matrix (`.table-wrap`)
**Best for:** Cross-referencing scriptures, comparing dispensations, contrasting covenants, or surveying books.

```html
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Dispensation / Section</th>
        <th>Key Characteristic</th>
        <th>The Reality in Christ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Old Covenant</strong></td>
        <td>External letters inscribed on stone; mortal priests.</td>
        <td>A shadow pointing forward.</td>
      </tr>
      <tr class="highlight-row">
        <td><strong>New Covenant</strong></td>
        <td><strong>Law of life inscribed on the heart; Christ an eternal High Priest.</strong></td>
        <td><strong>Direct organic reality enjoyed in spirit!</strong></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🧠 Universal 4-Question Reflection Archetype

Every message should include **3 to 5 open-ended reflection questions**. Structure them around these 4 proven angles:

1. **The Inward Definition Question:**
   * *Purpose:* Strip away superficial or religious cliches to define what this truth really is.
   * *Formula:* *"What does [Key Term/Truth] mean according to its intrinsic spiritual reality, beyond mere religious tradition?"*
2. **The Typology or Scriptural Contrast Question:**
   * *Purpose:* Contrast the shadow with the reality or the Old with the New.
   * *Formula:* *"How does the contrast between [Old Type/Prophet/Law] and [Christ/Son/Spirit] expose the inadequacy of external religion?"*
3. **The Subtle Deviation / Trap Question:**
   * *Purpose:* Identify how Christians fall into empty shells or religious routines.
   * *Formula:* *"How can good, scriptural practices (like Bible study, meetings, or service) degenerate into an empty shell without Christ?"*
4. **The Daily Experiential & Church Life Question:**
   * *Purpose:* Bring the high peak truth into moment-by-moment living.
   * *Formula:* *"In your daily walk today, what does it mean practically to turn to your spirit and touch Christ as your [Specific Revelation, e.g. High Priest / Life / Bread]?"*

---

## 📜 Complete HTML Template (`TEMPLATE.html`)

Copy and adapt this code for any book:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Message {{MSG_NUM}}: {{MSG_TITLE}} — Life-Study of {{BOOK_NAME}}</title>
  <link rel="stylesheet" href="../shared/styles.css">
</head>
<body>

  <!-- Top Navigation -->
  <nav class="top-nav" aria-label="Main Navigation">
    <div class="nav-links">
      <a href="../index.html"><strong>🏠 All Books</strong></a>
      <span style="color:var(--line-strong)">|</span>
      <a href="index.html"><strong>◂ {{BOOK_NAME}} Index</strong></a>
    </div>
    <div class="nav-links">
      <a href="{{PREV_HTML}}">◂ Prev Message</a>
      <span class="series-badge" style="margin-bottom:0">Message {{MSG_NUM}}</span>
      <a href="{{NEXT_HTML}}">Next Message ▸</a>
    </div>
  </nav>

  <main class="study-shell">
    <!-- Header -->
    <header class="study-header">
      <div class="series-badge">Life-Study of {{BOOK_NAME}} · Message {{MSG_NUM_INT}}</div>
      <h1>{{MSG_TITLE}}</h1>
      <p class="summary-dek">{{1-2 SENTENCE HIGH-LEVEL REVELATION SUMMARY}}</p>
      <div class="meta-tags">
        <span class="tag">⏱ 8–10 min review</span>
        <span class="tag">📖 Verses: <button type="button" class="verse-ref" data-ref="{{KEY_VERSE_REF}}">{{KEY_VERSE_LABEL}}</button></span>
        <span class="tag">🎯 {{TAG_1}} · {{TAG_2}} · {{TAG_3}}</span>
      </div>
    </header>

    <!-- 1. Rapid Recall Section -->
    <div class="fast-review">
      <h3>⚡ Rapid Recall (Read this in 60 seconds)</h3>
      <ul>
        <li><strong>{{CORE_TRUTH_1}}:</strong> {{EXPLANATION_1}}</li>
        <li><strong>{{CORE_TRUTH_2}}:</strong> {{EXPLANATION_2}}</li>
        <li><strong>{{PRACTICAL_EXPERIENCE}}:</strong> {{EXPLANATION_3}}</li>
      </ul>
    </div>

    <!-- 2. Main Content Section (Visual Diagrams & Models) -->
    <section>
      <div class="section-label">Core Revelation 01</div>
      <h2>{{SECTION_1_TITLE}}</h2>
      <p>{{PARAGRAPH_EXPLAINING_THE_POINT}}</p>

      <!-- Choose suitable visual archetype: .tri-cards / .contrast-grid / .step-flow / .analogy-comparison -->
    </section>

    <section>
      <div class="section-label">Core Revelation 02</div>
      <h2>{{SECTION_2_TITLE}}</h2>
      <p>{{PARAGRAPH_EXPLAINING_THE_POINT}}</p>

      <!-- Choose suitable visual archetype -->
    </section>

    <!-- 3. Active Recall & Deep Reflection (No Textboxes) -->
    <section>
      <div class="section-label">Review & Reflection</div>
      <h2>Active Recall: Deep Reflection Questions</h2>
      <p style="color:var(--muted); margin-bottom:1.5rem;">Ponder these open-ended questions to test your grasp and personal application of the message, then open each section to review the key insights.</p>

      <div class="recall-container">

        <!-- Reflection 1 -->
        <div class="recall-card">
          <div class="recall-badge-row">
            <span class="recall-num-badge">Reflection 01</span>
          </div>
          <h3 class="recall-prompt">{{QUESTION_1_PROMPT}}</h3>
          <p class="recall-hint">{{QUESTION_1_HINT}}</p>
          
          <details class="model-review">
            <summary>🔍 Reveal Key Insights & Meditation</summary>
            <div class="model-review-content">
              <p><strong>Core Biblical Truth:</strong> {{KEY_TRUTH_1}}</p>
              <p><strong>Spiritual Reality:</strong> {{KEY_TRUTH_2}}</p>
              <p><strong>Daily Application:</strong> {{PRACTICAL_APPLICATION}}</p>
            </div>
          </details>
        </div>

        <!-- Reflection 2 -->
        <div class="recall-card">
          <div class="recall-badge-row">
            <span class="recall-num-badge">Reflection 02</span>
          </div>
          <h3 class="recall-prompt">{{QUESTION_2_PROMPT}}</h3>
          <p class="recall-hint">{{QUESTION_2_HINT}}</p>
          
          <details class="model-review">
            <summary>🔍 Reveal Key Insights & Meditation</summary>
            <div class="model-review-content">
              <p><strong>Core Biblical Truth:</strong> {{KEY_TRUTH_1}}</p>
              <p><strong>Spiritual Reality:</strong> {{KEY_TRUTH_2}}</p>
            </div>
          </details>
        </div>

        <!-- Reflection 3 -->
        <div class="recall-card">
          <div class="recall-badge-row">
            <span class="recall-num-badge">Reflection 03</span>
          </div>
          <h3 class="recall-prompt">{{QUESTION_3_PROMPT}}</h3>
          <p class="recall-hint">{{QUESTION_3_HINT}}</p>
          
          <details class="model-review">
            <summary>🔍 Reveal Key Insights & Meditation</summary>
            <div class="model-review-content">
              <p><strong>Core Biblical Truth:</strong> {{KEY_TRUTH_1}}</p>
              <p><strong>Personal Experience:</strong> {{KEY_TRUTH_2}}</p>
            </div>
          </details>
        </div>

      </div>
    </section>

    <!-- Navigation -->
    <nav class="lesson-nav">
      <a href="{{PREV_HTML}}" class="btn-nav">⇤ Previous: {{PREV_TITLE}}</a>
      <a href="index.html" class="btn-nav">📂 All Messages</a>
      <a href="{{NEXT_HTML}}" class="btn-nav">Next: {{NEXT_TITLE}} ⇥</a>
    </nav>
  </main>

  <!-- Verbatim Scripture Popup Scripts -->
  <script src="assets/verses.js"></script>
  <script src="../shared/verse-modal.js"></script>
</body>
</html>
```

---

## 🗄️ Managing the NKJV Scripture Dictionary (`assets/verses.js`)

Each book has an `assets/verses.js` file defining the verbatim **NKJV** text for all verses referenced in that book.

```javascript
window.BIBLE_VERSES_NKJV = {
  "Romans 8:2": {
    ref: "Romans 8:2",
    version: "NKJV",
    text: "For the law of the Spirit of life in Christ Jesus has made me free from the law of sin and death."
  },
  "Galatians 2:20": {
    ref: "Galatians 2:20",
    version: "NKJV",
    text: "I have been crucified with Christ; it is no longer I who live, but Christ lives in me; and the life which I now live in the flesh I live by faith in the Son of God, who loved me and gave Himself for me."
  }
};
```

---

## 🔍 Index Page Specification (`index.html`)

Every book folder must feature an `index.html` with:
1. Header identifying the Life-Study book.
2. A client-side search bar (`<input type="text" id="filter-input">`) that filters messages in real time.
3. A clean list of only **available** messages (`.msg-card`) linking directly to the message HTML file.
4. No part dividers or status tags—strictly the clean cards and search bar.
