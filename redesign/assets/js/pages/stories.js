/* Stories: the hub's topic filter, and the guide's folding contents on phones.
 * Hub: the topic pills filter the guides (an "All guides" pill comes first). Without JS they stay jump links.
 * /stories#talking opens the hub filtered to that topic (the guides' crumbs link there).
 * Motion on transform/opacity only; reduced motion → sections swap with no animation. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---- Guide: on phones the contents start folded; on laptops they stay open beside the words.
  const fold = document.querySelector(".toc__fold");
  if (fold) {
    const wide = matchMedia("(min-width: 1000px)");
    const set = () => { fold.open = wide.matches; };
    set();
    wide.addEventListener("change", set);
    fold.querySelector("summary").addEventListener("click", (e) => { if (wide.matches) e.preventDefault(); });
    $$("a", fold).forEach((a) => a.addEventListener("click", () => { if (!wide.matches) fold.open = false; }));
  }

  // ---- Guide: the contents follow the heading you're reading, however you got there (jumps included).
  const tocLinks = $$(".toc a[href^='#']");
  if (tocLinks.length) {
    const heads = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
    let ticking = false;
    const spy = () => {
      ticking = false;
      let on = 0;
      heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top < innerHeight * 0.3) on = i; });
      if (tocLinks[on].classList.contains("is-on") && last === on) return;
      last = on;
      tocLinks.forEach((a, i) => a.classList.toggle("is-on", i === on));
      // Keep the marked line in sight when the contents scroll inside their own box.
      const box = document.querySelector(".toc"), a = tocLinks[on];
      if (box && box.scrollHeight > box.clientHeight) {
        const t = a.offsetTop - box.clientHeight / 2 + a.offsetHeight / 2;
        box.scrollTo({ top: t, behavior: reduced ? "auto" : "smooth" });
      }
    };
    let last = -1;
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  // ---- Hub: topic filter
  const pills = document.querySelector(".filter__pills");
  const topics = $$("[data-topic]");
  if (!pills || !topics.length) return;

  const all = document.createElement("li");
  all.innerHTML = '<button type="button" class="filter__all" data-filter="all" aria-pressed="true">All guides</button>';
  pills.prepend(all);
  // The jump links become toggle buttons (fresh elements, so the shared smooth-scroll for #links leaves them alone).
  $$("a[data-filter]", pills).forEach((a) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = a.className; b.dataset.filter = a.dataset.filter; b.textContent = a.textContent;
    b.setAttribute("aria-pressed", "false");
    a.replaceWith(b);
  });
  const links = $$("[data-filter]", pills);

  // Hub cards rise in as they scroll into view (they're refiltered later, so the hub handles its own reveal).
  const cards = $$(".topic .storycard, .topic .feature");
  if (!reduced) {
    gsap.set(cards, { opacity: 0, y: 32 });
    ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, overwrite: true }) });
  }

  let current = "all";
  const apply = (id, { scroll = true, instant = false } = {}) => {
    if (!topics.some((t) => t.dataset.topic === id)) id = "all";
    current = id;
    links.forEach((l) => l.setAttribute("aria-pressed", String(l.dataset.filter === id)));
    const on = links.find((l) => l.dataset.filter === id);
    if (on && pills.scrollWidth > pills.clientWidth) pills.scrollTo({ left: on.offsetLeft - pills.clientWidth / 2 + on.offsetWidth / 2, behavior: reduced ? "auto" : "smooth" });
    const show = topics.filter((t) => id === "all" || t.dataset.topic === id);
    const hide = topics.filter((t) => !show.includes(t));
    const swap = () => {
      hide.forEach((t) => (t.hidden = true));
      show.forEach((t, i) => { t.hidden = false; t.classList.toggle("page-sec--soft", i % 2 === 1); });
      if (!reduced) {
        ScrollTrigger.refresh();
        const shown = show.flatMap((t) => $$(".storycard, .feature", t));
        gsap.fromTo(shown, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.05, overwrite: true, delay: 0.15 });
      }
      if (scroll) {
        const top = document.querySelector(".filter").getBoundingClientRect().top + scrollY - 80;
        if (scrollY > top || id !== "all") scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      }
    };
    if (reduced || instant) return swap();
    const leaving = hide.filter((t) => !t.hidden);
    if (!leaving.length) return swap();
    gsap.to(leaving, { opacity: 0, y: 16, duration: 0.25, ease: "power2.in", onComplete: () => { gsap.set(leaving, { clearProps: "opacity,transform" }); swap(); } });
  };

  pills.addEventListener("click", (e) => {
    const l = e.target.closest("[data-filter]");
    if (!l) return;
    e.preventDefault();
    const f = l.dataset.filter;
    const id = f === current && f !== "all" ? "all" : f;
    history.replaceState(null, "", id === "all" ? location.pathname : "#" + id);
    apply(id);
  });

  const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id) apply(id, { scroll: true, instant: true }); };
  fromHash();
  addEventListener("hashchange", fromHash);
})();
