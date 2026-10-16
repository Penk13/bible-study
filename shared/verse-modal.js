(() => {
  "use strict";

  // 1. Reading Progress Bar Engine
  function initReadingProgress() {
    let progressBar = document.getElementById("reading-progress");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = "reading-progress";
      progressBar.setAttribute("aria-hidden", "true");
      document.body.prepend(progressBar);
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        progressBar.style.width = percent + "%";
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
  }

  // Indonesian Book Names Map for reference conversion
  const ID_BOOK_MAP = {
    "Genesis": "Kejadian", "Exodus": "Keluaran", "Leviticus": "Imamat", "Numbers": "Bilangan", "Deuteronomy": "Ulangan",
    "Joshua": "Yosua", "Judges": "Hakim-hakim", "Ruth": "Rut", "1 Samuel": "1 Samuel", "2 Samuel": "2 Samuel",
    "1 Kings": "1 Raja-raja", "2 Kings": "2 Raja-raja", "1 Chronicles": "1 Tawarikh", "2 Chronicles": "2 Tawarikh",
    "Ezra": "Ezra", "Nehemiah": "Nehemia", "Esther": "Ester", "Job": "Ayub", "Psalm": "Mazmur", "Psalms": "Mazmur",
    "Proverbs": "Amsal", "Ecclesiastes": "Pengkhotbah", "Song of Songs": "Kidung Agung", "Song of Solomon": "Kidung Agung",
    "Isaiah": "Yesaya",
    "Jeremiah": "Yeremia", "Lamentations": "Ratapan", "Ezekiel": "Yehezkiel", "Daniel": "Daniel", "Hosea": "Hosea",
    "Joel": "Yoel", "Amos": "Amos", "Obadiah": "Obaja", "Jonah": "Yunus", "Micah": "Mikha", "Nahum": "Nahum",
    "Habakkuk": "Habakuk", "Zephaniah": "Zefanya", "Haggai": "Hagai", "Zechariah": "Zakharia", "Malachi": "Maleakhi",
    "Matthew": "Matius", "Mark": "Markus", "Luke": "Lukas", "John": "Yohanes", "Acts": "Kisah Para Rasul",
    "Romans": "Roma", "1 Corinthians": "1 Korintus", "2 Corinthians": "2 Korintus", "Galatians": "Galatia",
    "Ephesians": "Efesus", "Philippians": "Filipi", "Colossians": "Kolose", "1 Thessalonians": "1 Tesalonika",
    "2 Thessalonians": "2 Tesalonika", "1 Timothy": "1 Timotius", "2 Timothy": "2 Timotius", "Titus": "Titus",
    "Philemon": "Filemon", "Hebrews": "Ibrani", "James": "Yakobus", "1 Peter": "1 Petrus", "2 Peter": "2 Petrus",
    "1 John": "1 Yohanes", "2 John": "2 Yohanes", "3 John": "3 Yohanes", "Jude": "Yudas", "Revelation": "Wahyu"
  };

  // Longest names first so "Song of Solomon" / "Psalms" win over shorter prefixes
  const ID_BOOK_ENTRIES = Object.entries(ID_BOOK_MAP).sort((a, b) => b[0].length - a[0].length);

  function convertToIndonesianRef(refStr) {
    if (!refStr) return "";
    for (const [enBook, idBook] of ID_BOOK_ENTRIES) {
      if (refStr.startsWith(enBook + " ")) {
        return idBook + refStr.slice(enBook.length);
      }
    }
    return refStr;
  }

  // Safe DOM builders: verse and API text is always set as text, never parsed as HTML
  function el(tag, props, children) {
    const node = document.createElement(tag);
    if (props) Object.assign(node, props);
    for (const child of children || []) {
      node.append(child);
    }
    return node;
  }

  function quote(text) {
    return el("blockquote", { className: "verse-quote", textContent: `“${text}”` });
  }

  function note(text) {
    return el("p", { className: "verse-modal-note", textContent: text });
  }

  function message(prefix, ref, suffix) {
    return el("p", {}, [prefix, el("strong", { textContent: ref }), suffix]);
  }

  let currentRefKey = null;
  let currentLang = "nkjv"; // 'nkjv' | 'tb2'
  let pendingFetch = null;
  let lastTrigger = null;

  function cancelPendingFetch() {
    if (pendingFetch) {
      pendingFetch.abort();
      pendingFetch = null;
    }
  }

  function setVersionTag(tagElem, label, title) {
    tagElem.textContent = label;
    tagElem.setAttribute("title", title);
  }

  // Render modal content based on active language
  function renderModalContent(refKey, lang) {
    const modal = document.getElementById("bible-verse-modal");
    if (!modal) return;

    cancelPendingFetch();

    const refElem = modal.querySelector("#verse-modal-ref");
    const tagElem = modal.querySelector("#verse-version-tag");
    const bodyElem = modal.querySelector("#verse-modal-body");
    const transBtn = modal.querySelector("#verse-modal-trans-btn");

    const data = window.BIBLE_VERSES_NKJV && window.BIBLE_VERSES_NKJV[refKey];

    if (lang === "tb2") {
      setVersionTag(tagElem, "TB2", "Terjemahan Baru Edisi 2");
      transBtn.textContent = "🇺🇸 English (NKJV)";
      transBtn.setAttribute("aria-label", "Lihat versi bahasa Inggris (NKJV)");

      if (data && data.tb2) {
        refElem.textContent = data.refTB2 || convertToIndonesianRef(data.ref || refKey);
        bodyElem.replaceChildren(quote(data.tb2));
      } else if (data) {
        setVersionTag(tagElem, "NKJV", "New King James Version");
        refElem.textContent = convertToIndonesianRef(data.ref || refKey);
        bodyElem.replaceChildren(quote(data.text), note("Terjemahan TB2 belum tersedia secara offline."));
      } else {
        refElem.textContent = convertToIndonesianRef(refKey);
        bodyElem.replaceChildren(note(`Terjemahan TB2 untuk ${convertToIndonesianRef(refKey)} belum tersedia.`));
      }
      return;
    }

    // NKJV mode
    setVersionTag(tagElem, "NKJV", "New King James Version");
    transBtn.textContent = "🇮🇩 Terjemahan TB2";
    transBtn.setAttribute("aria-label", "Lihat Terjemahan Baru Edisi 2 (Indonesia)");

    if (data) {
      refElem.textContent = data.ref || refKey;
      bodyElem.replaceChildren(quote(data.text));
      return;
    }

    // Not in the offline dictionary: fall back to bible-api.com (World English Bible)
    refElem.textContent = refKey;
    setVersionTag(tagElem, "WEB", "World English Bible (online fallback)");
    bodyElem.replaceChildren(message("Loading scripture for ", refKey, "..."));

    const controller = new AbortController();
    pendingFetch = controller;
    fetch(`https://bible-api.com/${encodeURIComponent(refKey)}?translation=web`, { signal: controller.signal })
      .then(res => res.json())
      .then(apiData => {
        if (controller.signal.aborted) return;
        if (apiData && typeof apiData.text === "string" && apiData.text.trim()) {
          const name = typeof apiData.translation_name === "string" ? apiData.translation_name : "World English Bible";
          bodyElem.replaceChildren(quote(apiData.text.trim()), note(`Translation: ${name} (Fallback)`));
        } else {
          bodyElem.replaceChildren(message("Verse text for ", refKey, " not found."));
        }
      })
      .catch(err => {
        if (controller.signal.aborted || (err && err.name === "AbortError")) return;
        bodyElem.replaceChildren(message("Verse text for ", refKey, " is unavailable offline."));
      })
      .finally(() => {
        if (pendingFetch === controller) pendingFetch = null;
      });
  }

  function focusableIn(container) {
    return Array.from(container.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])"))
      .filter(node => !node.disabled);
  }

  // 2. Create Modal / Bottom-Sheet DOM once
  function ensureModal() {
    let modal = document.getElementById("bible-verse-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "bible-verse-modal";
    modal.className = "verse-modal-overlay";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-labelledby", "verse-modal-ref");
    modal.innerHTML = `
      <div class="verse-modal-card" id="verse-modal-card">
        <div class="verse-modal-handle" aria-hidden="true"></div>
        <header class="verse-modal-header">
          <div class="verse-modal-title-group">
            <span class="verse-modal-book" id="verse-modal-ref">Scripture Reference</span>
            <span class="verse-version-tag" id="verse-version-tag">NKJV</span>
          </div>
          <button type="button" class="verse-modal-close" id="verse-modal-close-btn" aria-label="Close popup">✕</button>
        </header>
        <div class="verse-modal-body" id="verse-modal-body" aria-live="polite">
          <!-- Verse Text injected here -->
        </div>
        <footer class="verse-modal-footer">
          <button type="button" class="verse-modal-btn" id="verse-modal-trans-btn" aria-label="Lihat Terjemahan Baru Edisi 2">🇮🇩 Terjemahan TB2</button>
          <button type="button" class="verse-modal-btn primary" id="verse-modal-ok-btn">Done</button>
        </footer>
      </div>
    `;
    document.body.appendChild(modal);

    const card = modal.querySelector("#verse-modal-card");

    // Event handlers
    const close = () => {
      if (!modal.classList.contains("is-active")) return;
      cancelPendingFetch();
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      // Return focus to the verse button that opened the sheet
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    };

    modal.querySelector("#verse-modal-close-btn").addEventListener("click", close);
    modal.querySelector("#verse-modal-ok-btn").addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-active")) return;
      if (e.key === "Escape") {
        close();
      } else if (e.key === "Tab") {
        // Keep keyboard focus inside the dialog
        const items = focusableIn(card);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const outside = !card.contains(document.activeElement);
        if (e.shiftKey && (outside || document.activeElement === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (outside || document.activeElement === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Mobile Touch Swipe-Down to Dismiss
    let touchStartY = null;
    let touchDeltaY = 0;

    card.addEventListener("touchstart", (e) => {
      // Only trigger swipe-down if scrolled to the top of the card
      touchStartY = card.scrollTop <= 0 ? e.touches[0].clientY : null;
      touchDeltaY = 0;
    }, { passive: true });

    card.addEventListener("touchmove", (e) => {
      if (touchStartY !== null) {
        touchDeltaY = e.touches[0].clientY - touchStartY;
        if (touchDeltaY > 0) {
          // Dragging down: move card smoothly with thumb
          card.style.transform = `translateY(${touchDeltaY}px)`;
        }
      }
    }, { passive: true });

    card.addEventListener("touchend", () => {
      // Snap back, or dismiss when swiped down more than 80px
      card.style.transform = "";
      if (touchStartY !== null && touchDeltaY > 80) close();
      touchStartY = null;
      touchDeltaY = 0;
    }, { passive: true });

    // Translation toggle button handler
    modal.querySelector("#verse-modal-trans-btn").addEventListener("click", () => {
      if (!currentRefKey) return;
      currentLang = (currentLang === "nkjv" ? "tb2" : "nkjv");
      renderModalContent(currentRefKey, currentLang);
    });

    return modal;
  }

  // Show Verse Popup / Bottom-Sheet
  function showVerse(refKey, trigger) {
    const modal = ensureModal();
    lastTrigger = trigger || null;
    currentRefKey = refKey;
    currentLang = "nkjv"; // default to NKJV, allowing 1-tap toggle to TB2
    renderModalContent(currentRefKey, currentLang);

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector("#verse-modal-close-btn").focus({ preventScroll: true });
  }

  // Delegate click for any .verse-ref
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".verse-ref");
    if (target) {
      e.preventDefault();
      const ref = target.getAttribute("data-ref") || target.textContent.trim();
      showVerse(ref, target);
    }
  });

  // Initialize reading progress on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReadingProgress);
  } else {
    initReadingProgress();
  }
})();
