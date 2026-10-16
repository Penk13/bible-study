(() => {
  "use strict";

  // Live search filter for index pages (#filter-input over .msg-card list)
  const filterInput = document.getElementById("filter-input");
  const msgCards = document.querySelectorAll(".msg-card");
  const noResults = document.getElementById("no-results");
  if (!filterInput || !noResults) return;

  filterInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    msgCards.forEach(card => {
      const match = card.textContent.toLowerCase().includes(q);
      card.style.display = match ? "flex" : "none";
      if (match) visibleCount++;
    });

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  });
})();
