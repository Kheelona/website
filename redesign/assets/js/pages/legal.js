/* Legal pages: the table of contents is always open beside the text on laptops, and folds away on phones so the
 * policy itself comes first (tap "On this page" to open it; choosing a section folds it again).
 * The scrollspy and the reading bar come from pages.js. Works the same with reduced motion. */
(() => {
  const box = document.querySelector(".toc__box");
  if (!box) return;
  const wide = matchMedia("(min-width: 1000px)");
  const sync = () => { if (wide.matches) box.open = true; };
  if (!wide.matches) box.open = false;
  wide.addEventListener("change", sync);
  // On laptops the summary is only a label: keep the list open.
  box.addEventListener("toggle", () => { if (wide.matches && !box.open) box.open = true; });
  // Fold before main.js measures where to scroll (capture runs first), so the jump lands on the heading.
  box.addEventListener("click", (e) => { if (!wide.matches && e.target.closest("a[href^='#']")) box.open = false; }, true);
  // Laptops: keep the section you're reading visible inside the sticky list when it's taller than the window.
  const toc = box.closest(".toc");
  new MutationObserver(() => {
    const on = box.querySelector("a.is-on");
    if (!on || !wide.matches || toc.scrollHeight <= toc.clientHeight) return;
    const t = on.offsetTop - toc.clientHeight / 2 + on.offsetHeight / 2;
    toc.scrollTo({ top: t, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }).observe(box, { subtree: true, attributes: true, attributeFilter: ["class"] });
})();
