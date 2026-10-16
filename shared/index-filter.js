(() => {
  "use strict";

  // Live search for index pages: #filter-input filters the items of #filter-list
  const input = document.getElementById("filter-input");
  const list = document.getElementById("filter-list");
  const empty = document.getElementById("no-results");
  if (!input || !list || !empty) return;

  const items = Array.from(list.children);

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    let shown = 0;
    for (const item of items) {
      const match = item.textContent.toLowerCase().includes(q);
      item.hidden = !match;
      if (match) shown++;
    }
    empty.style.display = shown ? "none" : "block";
  });
})();
