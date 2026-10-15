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
    "Proverbs": "Amsal", "Ecclesiastes": "Pengkhotbah", "Song of Songs": "Kidung Agung", "Isaiah": "Yesaya",
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

  function convertToIndonesianRef(refStr) {
    if (!refStr) return "";
    for (const [enBook, idBook] of Object.entries(ID_BOOK_MAP)) {
      if (refStr.startsWith(enBook + " ")) {
        return refStr.replace(enBook + " ", idBook + " ");
      }
    }
    return refStr;
  }

  let currentRefKey = null;
  let currentLang = "nkjv"; // 'nkjv' | 'tb2'

  // Render modal content based on active language
  function renderModalContent(refKey, lang) {
    const modal = document.getElementById("bible-verse-modal");
    if (!modal) return;

    const refElem = modal.querySelector("#verse-modal-ref");
    const tagElem = modal.querySelector("#verse-version-tag");
    const bodyElem = modal.querySelector("#verse-modal-body");
    const transBtn = modal.querySelector("#verse-modal-trans-btn");

    const data = (window.BIBLE_VERSES_NKJV && window.BIBLE_VERSES_NKJV[refKey]);

    if (lang === "tb2") {
      tagElem.textContent = "TB2";
      tagElem.setAttribute("title", "Terjemahan Baru Edisi 2");
      transBtn.innerHTML = "🇺🇸 English (NKJV)";
      transBtn.setAttribute("aria-label", "Lihat versi bahasa Inggris (NKJV)");

      if (data && data.tb2) {
        refElem.textContent = data.refTB2 || convertToIndonesianRef(data.ref || refKey);
        bodyElem.innerHTML = `<blockquote class="verse-quote">“${data.tb2}”</blockquote>`;
      } else if (data) {
        refElem.textContent = convertToIndonesianRef(data.ref || refKey);
        bodyElem.innerHTML = `
          <blockquote class="verse-quote">“${data.text}”</blockquote>
          <p style="font-size:0.8rem; color:var(--muted); margin-top:0.5rem;">Terjemahan TB2 belum tersedia secara offline.</p>
        `;
      } else {
        refElem.textContent = convertToIndonesianRef(refKey);
        bodyElem.innerHTML = `
          <blockquote class="verse-quote">
            <em>Memuat firman untuk <strong>${convertToIndonesianRef(refKey)}</strong> (TB2)...</em>
          </blockquote>
        `;
      }
    } else {
      // NKJV mode
      tagElem.textContent = "NKJV";
      tagElem.setAttribute("title", "New King James Version");
      transBtn.innerHTML = "🇮🇩 Terjemahan TB2";
      transBtn.setAttribute("aria-label", "Lihat Terjemahan Baru Edisi 2 (Indonesia)");

      if (data) {
        refElem.textContent = data.ref || refKey;
        bodyElem.innerHTML = `<blockquote class="verse-quote">“${data.text}”</blockquote>`;
      } else {
        refElem.textContent = refKey;
        bodyElem.innerHTML = `
          <blockquote class="verse-quote">
            <em>Loading scripture for <strong>${refKey}</strong> (NKJV)...</em>
          </blockquote>
        `;
        // Quick fallback fetch
        fetch(`https://bible-api.com/${encodeURIComponent(refKey)}?translation=web`)
          .then(res => res.json())
          .then(apiData => {
            if (apiData.text) {
              bodyElem.innerHTML = `
                <blockquote class="verse-quote">“${apiData.text.trim()}”</blockquote>
                <p style="font-size:0.8rem; color:var(--muted); margin-top:0.5rem;">Translation: ${apiData.translation_name} (Fallback)</p>
              `;
            } else {
              bodyElem.innerHTML = `<p>Verse text for <strong>${refKey}</strong> not found.</p>`;
            }
          })
          .catch(() => {
            bodyElem.innerHTML = `<p>Verse text for <strong>${refKey}</strong>. (Offline mode)</p>`;
          });
      }
    }
  }

  // 2. Create Modal / Bottom-Sheet DOM once
  function ensureModal() {
    let modal = document.getElementById("bible-verse-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "bible-verse-modal";
      modal.className = "verse-modal-overlay";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-hidden", "true");
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
          <div class="verse-modal-body" id="verse-modal-body">
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
        modal.classList.remove("is-active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };

      modal.querySelector("#verse-modal-close-btn").addEventListener("click", close);
      modal.querySelector("#verse-modal-ok-btn").addEventListener("click", close);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-active")) {
          close();
        }
      });

      // Mobile Touch Swipe-Down to Dismiss
      let touchStartY = 0;
      let touchDeltaY = 0;

      card.addEventListener("touchstart", (e) => {
        // Only trigger swipe-down if scrolled to the top of the card
        if (card.scrollTop <= 0) {
          touchStartY = e.touches[0].clientY;
          touchDeltaY = 0;
        } else {
          touchStartY = 0;
        }
      }, { passive: true });

      card.addEventListener("touchmove", (e) => {
        if (touchStartY > 0) {
          const currentY = e.touches[0].clientY;
          touchDeltaY = currentY - touchStartY;
          if (touchDeltaY > 0) {
            // Dragging down: move card smoothly with thumb
            card.style.transform = `translateY(${touchDeltaY}px)`;
          }
        }
      }, { passive: true });

      card.addEventListener("touchend", () => {
        if (touchStartY > 0 && touchDeltaY > 80) {
          // Swiped down more than 80px: dismiss bottom sheet
          card.style.transform = "";
          close();
        } else {
          // Snap back
          card.style.transform = "";
        }
        touchStartY = 0;
        touchDeltaY = 0;
      }, { passive: true });

      // Translation toggle button handler
      const transBtn = modal.querySelector("#verse-modal-trans-btn");
      transBtn.addEventListener("click", () => {
        if (!currentRefKey) return;
        currentLang = (currentLang === "nkjv" ? "tb2" : "nkjv");
        renderModalContent(currentRefKey, currentLang);
      });
    }
    return modal;
  }

  // Show Verse Popup / Bottom-Sheet
  function showVerse(refKey) {
    ensureModal();
    currentRefKey = refKey;
    currentLang = "nkjv"; // default to NKJV, allowing 1-tap toggle to TB2
    renderModalContent(currentRefKey, currentLang);

    const modal = document.getElementById("bible-verse-modal");
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Delegate click for any .verse-ref
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".verse-ref");
    if (target) {
      e.preventDefault();
      const ref = target.getAttribute("data-ref") || target.textContent.trim();
      showVerse(ref);
    }
  });

  // Initialize reading progress on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReadingProgress);
  } else {
    initReadingProgress();
  }
})();
