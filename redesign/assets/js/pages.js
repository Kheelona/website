/* Kheelona redesign — shared motion for every page other than home (loads after main.min.js).
 * main.js already gives these pages: smooth scroll, nav, .reveal, living Khelu ([data-kheelu]), the cursor,
 * [data-magnetic], [data-tilt], the footer and the Skip button. This file adds the pieces long pages use.
 * Transform/opacity only; prefers-reduced-motion → everything shows in its final state. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Table of contents: the section you're reading is marked (works without motion too).
  const toc = $$(".toc a[href^='#']");
  if (toc.length && "IntersectionObserver" in window) {
    const map = new Map(toc.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { toc.forEach((a) => a.classList.remove("is-on")); map.get(e.target.id)?.classList.add("is-on"); } }), { rootMargin: "-20% 0px -70% 0px" });
    map.forEach((_, id) => { const t = document.getElementById(id); if (t) io.observe(t); });
  }
  if (reduced) return;

  // Headings with [data-split]: each word rises in.
  $$("[data-split]").forEach((h) => {
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) f.append(w); else { const s = document.createElement("span"); s.className = "split-w"; s.textContent = w; f.append(s); } }); c.replaceWith(f); }
      else if (c.nodeType === 1 && !c.classList.contains("split-w")) { if (c.classList.contains("mark")) { c.classList.add("split-w"); } else walk(c); }
    });
    walk(h);
    gsap.to($$(".split-w", h), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, delay: 0.1 });
  });

  // [data-stagger]: its children rise in one after another when it scrolls into view.
  $$("[data-stagger]").forEach((g) => gsap.from([...g.children], { y: 36, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: g, start: "top 85%", once: true } }));

  // [data-count="123"]: the number counts up once in view.
  $$("[data-count]").forEach((el) => { const to = +el.dataset.count, o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-IN")), scrollTrigger: { trigger: el, start: "top 90%", once: true } }); });

  // .flow: the rainbow line draws down as you scroll the steps.
  $$(".flow").forEach((f) => { const line = document.createElement("i"); line.className = "flow__line"; f.prepend(line); gsap.fromTo(line, { "--p": 0 }, { "--p": 1, ease: "none", scrollTrigger: { trigger: f, start: "top 70%", end: "bottom 60%", scrub: 0.6 } }); });

  // Long reads: a thin rainbow progress bar at the top of the window.
  const bar = $(".readbar"); const body = $("[data-read]");
  if (bar && body) gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { trigger: body, start: "top 20%", end: "bottom 80%", scrub: 0.3 } });

  // Cards with [data-tilt-card] lean toward the pointer.
  if (fine) $$("[data-tilt-card]").forEach((c) => {
    const rx = gsap.quickTo(c, "rotationY", { duration: 0.6, ease: "power3" }), ry = gsap.quickTo(c, "rotationX", { duration: 0.6, ease: "power3" });
    gsap.set(c, { transformPerspective: 900 });
    c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - 0.5) * 10); ry(-((e.clientY - r.top) / r.height - 0.5) * 8); });
    c.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });
})();
