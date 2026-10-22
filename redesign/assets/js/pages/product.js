/* Product page (/products/kheelu). Loads after main.min.js and pages.js.
 * Works without motion: tabs, the four-step stage, the film rail. With motion: headings rise word by word as they
 * scroll in, the films preview on hover (in view on touch), the languages light up in turn, gentle parallax.
 * Transform/opacity only; prefers-reduced-motion → final states, no loops. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Example conversations: three tabs, one chat (roving tabindex, arrow keys) ---------- */
  const tabs = $("[data-tabs]");
  if (tabs) {
    const btns = $$('[role="tab"]', tabs);
    const pill = document.createElement("i"); pill.className = "pdp-tabs__pill"; pill.setAttribute("aria-hidden", "true"); tabs.prepend(pill);
    let cur = btns[0];
    const place = () => { const s = tabs.style; s.setProperty("--px", cur.offsetLeft + "px"); s.setProperty("--pw", cur.offsetWidth + "px"); s.setProperty("--py", cur.offsetTop + "px"); s.setProperty("--ph", cur.offsetHeight + "px"); };
    const select = (b, opts = {}) => {
      cur = b;
      btns.forEach((x) => { const on = x === b; x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
      place();
      if (opts.focus) b.focus();
      if (opts.animate && !reduced) gsap.fromTo($$(".pdp-msg", document.getElementById(b.getAttribute("aria-controls"))), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.22 });
    };
    btns.forEach((b, i) => {
      b.addEventListener("click", () => b !== cur && select(b, { animate: true }));
      b.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (e.key === "Home" || e.key === "End") { e.preventDefault(); select(btns[e.key === "Home" ? 0 : btns.length - 1], { focus: true, animate: true }); return; }
        if (!d) return; e.preventDefault(); select(btns[(i + d + btns.length) % btns.length], { focus: true, animate: true });
      });
    });
    pill.style.transition = "none"; select(cur); requestAnimationFrame(() => (pill.style.transition = ""));
    addEventListener("resize", place); document.fonts?.ready.then(place);
    // The first chat plays in once, when it scrolls into view.
    if (!reduced) { const first = $$(".pdp-msg", $("[data-chat] [role='tabpanel']:not([hidden])")); gsap.set(first, { opacity: 0, y: 18 }); ScrollTrigger.create({ trigger: "[data-chat]", start: "top 75%", once: true, onEnter: () => gsap.to(first, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.35 }) }); }
  }

  /* ---------- Four steps: whichever step crosses the middle of the window drives Khelu's stage ---------- */
  const stage = $("[data-stage]"); const steps = $$("[data-steps-list] > li");
  if (stage && steps.length && "IntersectionObserver" in window) {
    const set = (n) => { if (stage.dataset.state === n) return; stage.dataset.state = n; steps.forEach((li) => li.classList.toggle("is-on", li.dataset.step === n)); };
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && set(e.target.dataset.step)), { rootMargin: "-48% 0px -48% 0px" });
    steps.forEach((li) => io.observe(li));
  }

  /* ---------- Films: arrows, a counter, and previews ---------- */
  const rail = $("[data-rail-track]");
  if (rail) {
    const films = $$(".film", rail); const count = $("[data-rail-count]"); const [prev, next] = $$("[data-rail]");
    const stepW = () => (films[1] ? films[1].offsetLeft - films[0].offsetLeft : rail.clientWidth);
    $$("[data-rail]").forEach((b) => b.addEventListener("click", () => rail.scrollBy({ left: +b.dataset.rail * stepW(), behavior: reduced ? "auto" : "smooth" })));
    const upd = () => {
      const max = rail.scrollWidth - rail.clientWidth; const i = max > 4 && rail.scrollLeft >= max - 4 ? films.length - 1 : Math.round(rail.scrollLeft / stepW());
      count.textContent = `${Math.min(films.length, i + 1)} of ${films.length}`;
      prev.disabled = rail.scrollLeft < 4; next.disabled = rail.scrollLeft > max - 4;
    };
    rail.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    if (!reduced) {
      const loop = (v) => { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); };
      if (fine) films.forEach((f) => { const p = $(".film__play", f), v = $("video", f); p.addEventListener("pointerenter", () => loop(v)); p.addEventListener("pointerleave", () => v.pause()); });
      else { const io = new IntersectionObserver((es) => es.forEach((e) => (e.intersectionRatio > 0.8 ? loop(e.target) : e.target.pause())), { threshold: [0, 0.8] }); $$("video", rail).forEach((v) => io.observe(v)); }
    }
  }

  if (reduced) return;

  /* ---------- Headings with [data-psplit]: words rise in as the heading scrolls into view ---------- */
  $$("[data-psplit]").forEach((h) => {
    const walk = (n) => [...n.childNodes].forEach((c) => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) f.append(w); else { const s = document.createElement("span"); s.className = "psw"; s.textContent = w; f.append(s); } }); c.replaceWith(f); }
      else if (c.nodeType === 1) { if (c.classList.contains("mark")) c.classList.add("psw"); else walk(c); }
    });
    walk(h);
    gsap.to($$(".psw", h), { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });

  /* ---------- Hero: the sun sticker pops on, Khelu drifts up a little as you leave ---------- */
  gsap.from(".pdp-sun", { scale: 0, rotation: -40, duration: 0.9, ease: "back.out(1.8)", delay: 0.7 });
  gsap.to("[data-hero-visual]", { yPercent: 7, ease: "none", scrollTrigger: { trigger: ".pdp-hero", start: "top top", end: "bottom top", scrub: 0.5 } });
  gsap.to(".pdp-sun", { y: -50, rotation: 6, ease: "none", scrollTrigger: { trigger: ".pdp-hero", start: "top top", end: "bottom top", scrub: 0.5 } });

  /* ---------- Photos drift inside their frames; the privacy centre rises into its card ---------- */
  $$("[data-parallax]").forEach((img) => gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.5 } }));
  const phone = $(".pdp-safe__phone img");
  if (phone) gsap.fromTo(phone, { yPercent: 28 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".pdp-safe__card", start: "top bottom", end: "center 60%", scrub: 0.6 } });

  /* ---------- Compare: Khelu's ticks pop in, row by row ---------- */
  const ticks = $$("[data-ticks] .yes");
  if (ticks.length) gsap.from(ticks, { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.12, scrollTrigger: { trigger: "[data-ticks]", start: "top 80%", once: true } });

  /* ---------- Languages: each one lights up in turn while the card is on screen ---------- */
  const langs = $$("[data-langs] li");
  if (langs.length && "IntersectionObserver" in window) {
    let i = 0, t = 0;
    const tick = () => { langs.forEach((l, j) => l.classList.toggle("is-on", j === i)); i = (i + 1) % langs.length; };
    new IntersectionObserver(([e]) => { clearInterval(t); if (e.isIntersecting) { tick(); t = setInterval(tick, 1300); } }, { threshold: 0.4 }).observe($("[data-langs]"));
  }
})();
