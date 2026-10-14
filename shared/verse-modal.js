(() => {
  "use strict";

  // Create Modal DOM once
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
        <div class="verse-modal-card">
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

  // Show Verse Popup
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
})();
