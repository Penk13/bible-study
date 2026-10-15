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
              <span class="verse-version-tag">NKJV</span>
            </div>
            <button type="button" class="verse-modal-close" id="verse-modal-close-btn" aria-label="Close popup">✕</button>
          </header>
          <div class="verse-modal-body" id="verse-modal-body">
            <!-- Verse Text injected here -->
          </div>
          <footer class="verse-modal-footer">
            <button type="button" class="verse-modal-btn" id="verse-modal-copy-btn">📋 Copy</button>
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

      const copyBtn = modal.querySelector("#verse-modal-copy-btn");
      copyBtn.addEventListener("click", () => {
        const ref = modal.querySelector("#verse-modal-ref").textContent;
        const text = modal.querySelector("#verse-modal-body").textContent.trim();
        const full = `"${text}" — ${ref} (NKJV)`;
        navigator.clipboard.writeText(full).then(() => {
          copyBtn.textContent = "Copied! ✓";
          setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 1500);
        });
      });
    }
    return modal;
  }

  // Show Verse Popup / Bottom-Sheet
  function showVerse(refKey) {
    const modal = ensureModal();
    const refElem = modal.querySelector("#verse-modal-ref");
    const bodyElem = modal.querySelector("#verse-modal-body");

    const data = (window.BIBLE_VERSES_NKJV && window.BIBLE_VERSES_NKJV[refKey]);

    if (data) {
      refElem.textContent = data.ref || refKey;
      bodyElem.innerHTML = `<blockquote class="verse-quote">“${data.text}”</blockquote>`;
    } else {
      // Fallback
      refElem.textContent = refKey;
      bodyElem.innerHTML = `
        <blockquote class="verse-quote">
          <em>Loading scripture for <strong>${refKey}</strong> (NKJV)...</em>
        </blockquote>
      `;
      // Attempt quick fetch from API if connected
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
