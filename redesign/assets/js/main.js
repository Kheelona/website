/* Kheelona redesign: the motion layer.
 * Every chapter is a sticky "track" (CSS) whose scroll progress drives a GSAP timeline (ScrollTrigger scrub).
 * Motion is transform/opacity only. prefers-reduced-motion → everything shows in its final, static state.
 * Pointer effects (cursor, magnetic buttons, tilt, eye glints, question-mark repel) run on fine pointers only. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  if (reduced || !window.gsap) { root.classList.add("reduced"); initStatic(); return; }
  root.classList.add("motion");
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (desktop only; native touch scroll keeps INP low) ---------- */
  let lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.8 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const t = $(a.getAttribute("href")); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }));
  }

  /* ---------- Living Kheelu: breathing, sway, blinks (only while on screen) ---------- */
  $$("[data-kheelu]").forEach((k) => {
    const body = $(".kheelu__body", k);
    const lids = $$(".kheelu__lid", k);
    const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true })
      .to(body, { scaleY: 1.014, scaleX: 0.996, y: -4, rotation: 0.8, duration: 2.2, ease: "sine.inOut" });
    let blinkTimer;
    const blink = () => {
      gsap.timeline().to(lids, { scaleY: 1, duration: 0.07, ease: "power1.in" }).to(lids, { scaleY: 0, duration: 0.12, ease: "power1.out" });
      blinkTimer = setTimeout(blink, 2600 + Math.random() * 3200);
    };
    ScrollTrigger.create({
      trigger: k, start: "top bottom", end: "bottom top",
      onToggle: (s) => { if (s.isActive) { idle.play(); clearTimeout(blinkTimer); blinkTimer = setTimeout(blink, 900); } else { idle.pause(); clearTimeout(blinkTimer); } },
    });
  });

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  const nav = $("#nav");
  ScrollTrigger.create({ start: 200, end: "max", onUpdate: (s) => nav.classList.toggle("is-hidden", s.direction === 1 && s.scroll() > 400) });

  /* ---------- Generic reveals ---------- */
  ScrollTrigger.batch(".reveal", { start: "top 85%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }) });

  /* ---------- 1 · Hero: copy lifts away, Kheelu takes the stage, the questions arrive ---------- */
  (() => {
    const track = $("#hero"); const copy = $$("[data-hero-copy], [data-hero-actions]"); const stage = $(".hero__stage", track); const cap = $("[data-hero-caption]");
    const field = $("[data-qfield]");
    const colors = ["#f59ab8", "#f2a65a", "#e9b84a", "#5fbfa6", "#5aa9ee", "#9d86ee"];
    const qs = [];
    for (let i = 0; i < 26; i++) {
      const outer = document.createElement("span"); outer.className = "qmark";
      const a = (i / 26) * Math.PI * 2 + Math.random() * 0.3; const r = 0.32 + Math.random() * 0.2;
      outer.style.left = 50 + Math.cos(a) * r * 100 + "%"; outer.style.top = 46 + Math.sin(a) * r * 90 + "%";
      outer.style.setProperty("--c", colors[i % colors.length]);
      const inner = document.createElement("span"); inner.textContent = "?"; inner.style.display = "inline-block";
      inner.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
      outer.appendChild(inner); field.appendChild(outer); qs.push({ outer, inner, a });
    }
    gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .to(copy, { y: -120, opacity: 0, ease: "power1.in", duration: 0.35 }, 0.02)
      .to(stage, { y: () => innerHeight * 0.06, scale: 1.18, ease: "power2.inOut", duration: 0.45 }, 0.05)
      .fromTo(qs.map((q) => q.outer), { opacity: 0, scale: 0.2, x: (i) => -Math.cos(qs[i].a) * 160, y: (i) => -Math.sin(qs[i].a) * 160 },
        { opacity: 1, scale: 1, x: 0, y: 0, stagger: { each: 0.012, from: "random" }, ease: "back.out(1.6)", duration: 0.3 }, 0.22)
      .to(cap, { opacity: 1, y: -10, duration: 0.15 }, 0.45)
      .to(qs.map((q) => q.outer), { y: (i) => -40 - (i % 5) * 18, rotation: (i) => (i % 2 ? 12 : -12), duration: 0.4, ease: "none" }, 0.55)
      .to([cap, ...qs.map((q) => q.outer)], { opacity: 0, duration: 0.12 }, 0.9);
    // Questions scatter away from the cursor.
    if (fine) {
      const movers = qs.map((q) => ({ el: q.inner, x: gsap.quickTo(q.inner, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(q.inner, "y", { duration: 0.6, ease: "power3" }) }));
      track.addEventListener("pointermove", (e) => {
        movers.forEach((m) => {
          const r = m.el.getBoundingClientRect(); const dx = r.left + r.width / 2 - e.clientX; const dy = r.top + r.height / 2 - e.clientY;
          const d = Math.hypot(dx, dy); const f = d < 160 ? (160 - d) / 160 : 0;
          m.x((dx / (d || 1)) * f * 70); m.y((dy / (d || 1)) * f * 70);
        });
      });
    }
  })();

  /* ---------- 2 · Manifesto: words fill in as you read ---------- */
  $$("[data-words]").forEach((p) => {
    const wrapWords = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => { if (!w.trim()) { frag.append(w); return; } const s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.append(s); });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrapWords(n);
      });
    };
    wrapWords(p);
    gsap.fromTo($$(".w", p), { opacity: 0.14 }, { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 42%", scrub: 0.5 } });
  });

  /* ---------- 3 · Press: zoom into the tummy, press, glow, listen ---------- */
  (() => {
    const track = $("#how"); const k = $("[data-press-kheelu]"); const ring = $("[data-ring]", k); const btn = $("[data-btn]", k);
    const ripples = $$(".kheelu__ripple", k); const chips = $$("[data-noscreen] span"); const steps = $$("[data-steps] li");
    const listen = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((r, i) => listen.fromTo(r, { scale: 0.6, opacity: 0.85 }, { scale: 1.9, opacity: 0, duration: 1.6, ease: "power1.out" }, i * 0.5));
    const zoom = () => { const s = innerWidth < 700 ? 2.1 : 2.6; const H = k.offsetHeight; const cy = k.offsetTop + H / 2; return { s, y: innerHeight * 0.47 - cy - 0.118 * H * s }; };
    const setStep = (i) => steps.forEach((s, j) => s.classList.toggle("is-on", j <= i));
    gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => { const p = st.progress; setStep(p < 0.42 ? -1 : p < 0.6 ? 0 : p < 0.76 ? 1 : 2); p > 0.74 && p < 0.97 ? listen.play() : listen.pause(); } } })
      .fromTo(chips, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.12 }, 0.04)
      .to(chips, { opacity: 0, y: -20, stagger: 0.03, duration: 0.1 }, 0.24)
      .to(".press__copy", { opacity: 0, y: -40, duration: 0.08 }, 0.28)
      .to(".press__steps", { opacity: 1, duration: 0.06 }, 0.36)
      .to(k, { scale: () => zoom().s, y: () => zoom().y, ease: "power2.inOut", duration: 0.2 }, 0.3)
      .fromTo(btn, { opacity: 0, boxShadow: "0 0 0 0 rgba(10,110,232,.6)" }, { opacity: 1, boxShadow: "0 0 0 14px rgba(10,110,232,0)", duration: 0.12, repeat: 1 }, 0.46)
      .fromTo(ring, { opacity: 0 }, { opacity: 1, boxShadow: "0 0 0 6px rgba(255,181,71,.55), 0 0 60px 24px rgba(255,181,71,.45)", duration: 0.1 }, 0.6)
      .to(k, { scale: 1, y: 0, ease: "power2.inOut", duration: 0.12 }, 0.86)
      .to(".press__steps", { opacity: 0, duration: 0.05 }, 0.88)
      .to(".press__copy", { opacity: 1, y: 0, duration: 0.08 }, 0.9);
  })();

  /* ---------- 4 · Answer, then ask back ---------- */
  (() => {
    const track = $("#asks"); const rays = $$("[data-rays] path", track); const scatter = $("[data-scatter]", track); const qm = $("[data-qmark]", track);
    const cards = $$(".step-card", track); const back = $(".askback", track); const sky = $(".sky", track);
    rays.forEach((r) => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
    const dots = [];
    for (let i = 0; i < 46; i++) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); const t = Math.random(); c.setAttribute("cx", 120 + t * 400); c.setAttribute("cy", 120 + t * 230 + (Math.random() - 0.5) * 30); c.setAttribute("r", 3 + Math.random() * 3); c.style.opacity = 0; scatter.appendChild(c); dots.push(c); }
    gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .to(rays, { strokeDashoffset: 0, stagger: 0.02, duration: 0.2, ease: "none" }, 0.04)
      .to(cards[0], { opacity: 1, x: 0, duration: 0.08 }, 0.12)
      .to(dots, { opacity: 0.9, duration: 0.05, stagger: 0.002 }, 0.32)
      .to(dots, { x: () => (Math.random() - 0.5) * 260, y: () => -Math.random() * 220, duration: 0.25, ease: "power2.out", stagger: 0.002 }, 0.36)
      .to(rays.filter((_, i) => i !== 4), { opacity: 0.15, duration: 0.1 }, 0.38)
      .to(cards[1], { opacity: 1, duration: 0.08 }, 0.36)
      .to(qm, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.1 }, 0.54)
      .to(sky, { background: "linear-gradient(#7fbff3, #cfe6fb 70%, #e7f3e6)", duration: 0.12 }, 0.54)
      .to(cards[2], { opacity: 1, duration: 0.08 }, 0.56)
      .fromTo(back, { opacity: 0, y: 30, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, ease: "back.out(1.7)", duration: 0.12 }, 0.7)
      .to({}, { duration: 0.01 }, 0.99);
    gsap.set(cards, { x: 24 });
    gsap.to(cards, { x: 0, stagger: 0.1, scrollTrigger: { trigger: track, start: "top top", end: "60% bottom", scrub: 0.6 } });
  })();

  /* ---------- 5 · A day at home: rooms change, Kheelu stays and speaks ---------- */
  (() => {
    const track = $("#day"); const scenes = $$(".scene", track); const dots = $$("[data-home-progress] i", track);
    const time = $("[data-home-time]"), line = $("[data-home-line]"), mode = $("[data-home-mode]"), say = $("[data-home-say]"), bubble = $("[data-home-bubble]");
    const k = $("[data-home-kheelu]"); const ripples = $$(".kheelu__ripple", k); const ring = $("[data-ring]", k);
    const DAY = [
      ["7:40 am · Breakfast", "The first <span class=mark>why</span> of the day.", "AI mode · on home Wi‑Fi", "What do you think makes toast go crunchy?"],
      ["4:15 pm · After school", "Yesterday’s question, <span class=mark>picked up again.</span>", "Kheelu remembers earlier chats", "Shall we find out how rockets land?"],
      ["6:30 pm · While you cook", "A question to think about, <span class=mark>not a cartoon to watch.</span>", "AI mode · on home Wi‑Fi", "How many spoons can you count on the counter?"],
      ["Sunday · At Nani’s", "Stories and jingles, <span class=mark>no Wi‑Fi needed.</span>", "Story mode · works offline", "Once upon a time, a little rabbit asked the moon a question…"],
      ["8:30 pm · Bedtime", "One last story, <span class=mark>lights low.</span>", "Story mode · works offline", "Goodnight. What shall we dream about tonight?"],
    ];
    const talk = gsap.timeline({ repeat: -1 });
    ripples.forEach((r, i) => talk.fromTo(r, { scale: 0.6, opacity: 0.8 }, { scale: 1.8, opacity: 0, duration: 1.4, ease: "power1.out" }, i * 0.7));
    gsap.set(ring, { opacity: 1, boxShadow: "0 0 0 4px rgba(255,181,71,.5), 0 0 30px 10px rgba(255,181,71,.35)" });
    let cur = 0;
    const show = (i) => {
      if (i === cur) return;
      const dir = i > cur ? 1 : -1; const prev = cur; cur = i;
      gsap.to(scenes[prev], { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.inOut" });
      gsap.fromTo(scenes[i], { opacity: 0, scale: 1.06, xPercent: 3 * dir }, { opacity: 1, scale: 1, xPercent: 0, duration: 0.9, ease: "power3.out" });
      gsap.timeline().to(k, { y: -38, duration: 0.25, ease: "power2.out" }).to(k, { y: 0, duration: 0.45, ease: "bounce.out" });
      const [t, l, m, s] = DAY[i];
      gsap.timeline()
        .to([time, line, mode], { opacity: 0, y: -12, duration: 0.2, stagger: 0.03 })
        .add(() => { time.textContent = t; line.innerHTML = l; mode.textContent = m; })
        .to([time, line, mode], { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
      gsap.timeline()
        .to(bubble, { opacity: 0, scale: 0.85, duration: 0.18, transformOrigin: "10% 100%" })
        .add(() => { say.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; })
        .to(bubble, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" })
        .add(() => { say.textContent = s; }, "+=0.55")
        .fromTo(say, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
    };
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => show(Math.min(DAY.length - 1, Math.floor(st.progress * DAY.length * 0.999))),
      onToggle: (st) => (st.isActive ? talk.play() : talk.pause()) });
    gsap.to($$(".scene img", track), { yPercent: -3, ease: "none", scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: true } });
  })();

  /* ---------- 6 · Languages: greetings orbit, the sentence switches language ---------- */
  (() => {
    const track = $("#languages"); const chips = $$("[data-chips] .chip", track); const [en, hi] = $$("[data-swap]", track);
    const grid = innerWidth < 700; const holder = $("[data-chips]", track);
    if (grid) { holder.classList.add("chips--grid"); $(".langs__copy", track).appendChild(holder); }
    const place = (rot) => {
      if (grid) return;
      const rx = Math.min(innerWidth * 0.42, 540), ry = Math.min(innerHeight * 0.17, 150);
      chips.forEach((c, i) => { const a = (i / chips.length) * Math.PI * 2 + rot; c.style.left = `calc(50% + ${Math.cos(a) * rx}px)`; c.style.top = `calc(50% + ${Math.sin(a) * ry}px)`; c.style.translate = "-50% -50%"; c.style.zIndex = Math.sin(a) > 0 ? 6 : 1; });
    };
    place(0);
    gsap.fromTo(chips, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.05, ease: "back.out(2)", scrollTrigger: { trigger: track, start: "top 60%", end: "top top", scrub: 0.6 } });
    ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", scrub: true, onUpdate: (st) => place(st.progress * Math.PI * 0.9) });
    gsap.timeline({ scrollTrigger: { trigger: track, start: "40% bottom", end: "70% bottom", scrub: 0.6 } }).to(en, { opacity: 0, y: -10 }).fromTo(hi, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, "<0.3");
    addEventListener("resize", () => place(0));
  })();

  /* ---------- 7 · Memory: yesterday → today, the path draws itself ---------- */
  (() => {
    const board = $("[data-memory]"); if (!board) return; const path = $("[data-mem-path]", board);
    const svg = path.ownerSVGElement; const ns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(ns, "defs"); const cp = document.createElementNS(ns, "clipPath"); cp.id = "memclip";
    const rect = document.createElementNS(ns, "rect"); rect.setAttribute("x", 0); rect.setAttribute("y", -50); rect.setAttribute("height", 600); rect.setAttribute("width", 0);
    cp.appendChild(rect); defs.appendChild(cp); svg.prepend(defs); path.setAttribute("clip-path", "url(#memclip)");
    const [y, t] = $$(".mem-card", board);
    gsap.timeline({ scrollTrigger: { trigger: board, start: "top 80%", end: "bottom 50%", scrub: 0.6 } })
      .from(y, { opacity: 0, y: 30, duration: 0.2 })
      .to(rect, { attr: { width: 1000 }, duration: 0.6, ease: "none" })
      .from(t, { opacity: 0, y: 30, scale: 0.94, duration: 0.25 }, ">-0.1");
  })();

  /* ---------- 8 · Bedtime stars ---------- */
  const sky = $("[data-stars]");
  if (sky) for (let i = 0; i < 42; i++) { const s = document.createElement("i"); s.className = "star"; s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 70 + "%"; s.style.animationDelay = Math.random() * 3 + "s"; sky.appendChild(s); }

  /* ---------- 9 · Parent app: the phone changes screens as the list advances ---------- */
  (() => {
    const track = $("#app"); const items = $$("[data-app-list] li", track); const shots = $$("[data-app-screens] img", track); let cur = 0;
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => {
      const i = Math.min(items.length - 1, Math.floor(st.progress * items.length * 0.999)); if (i === cur) return;
      gsap.to(shots[cur], { opacity: 0, y: -24, duration: 0.5, ease: "power2.in" }); gsap.fromTo(shots[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      items.forEach((it, j) => it.classList.toggle("is-on", j === i)); cur = i;
    } });
    gsap.from(".phone", { y: 80, rotation: -4, scrollTrigger: { trigger: track, start: "top bottom", end: "top top", scrub: 0.6 } });
  })();

  /* ---------- 10 · Safety lines light up as they pass the centre ---------- */
  $$("[data-safety] li").forEach((li) => ScrollTrigger.create({ trigger: li, start: "top 62%", end: "bottom 38%", toggleClass: "is-lit" }));

  /* ---------- Films: preview on hover (or in view on touch), full film in a dialog ---------- */
  const modal = $("#modal"); const mv = $("video", modal);
  const openFilm = (src, wide) => { modal.classList.toggle("modal--wide", !!wide); mv.src = src; modal.showModal(); mv.play().catch(() => {}); };
  const closeFilm = () => { mv.pause(); mv.removeAttribute("src"); mv.load(); modal.close(); };
  $("[data-close]", modal).addEventListener("click", closeFilm); modal.addEventListener("close", () => { mv.pause(); });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeFilm(); });
  $$("[data-video]").forEach((b) => b.addEventListener("click", () => openFilm(b.dataset.video, b.hasAttribute("data-wide"))));
  const loops = $$(".film video");
  const startLoop = (v) => { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); };
  if (fine) $$(".film").forEach((f) => { const v = $("video", f); f.addEventListener("pointerenter", () => startLoop(v)); f.addEventListener("pointerleave", () => v.pause()); });
  else { const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? startLoop(e.target) : e.target.pause())), { threshold: 0.6 }); loops.forEach((v) => io.observe(v)); }

  /* ---------- Buy pill + WhatsApp: after the hero, out of the way over the offer and the close ---------- */
  const buybar = $("#buybar"), wa = $("#wa");
  const pillState = () => {
    const heroBtn = $("#hero-cta").getBoundingClientRect(); const offer = $("#offer").getBoundingClientRect(); const close = $("#close").getBoundingClientRect();
    const past = heroBtn.bottom < 0; const overBuy = (offer.top < innerHeight && offer.bottom > 0) || close.top < innerHeight;
    buybar.classList.toggle("is-on", past && !overBuy); wa.classList.toggle("is-on", past);
  };
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: pillState }); pillState();

  /* ---------- Pointer layer ---------- */
  if (fine) {
    // Custom cursor
    const cur = $("#cursor"); const cx = gsap.quickTo(cur, "x", { duration: 0.25, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: 0.25, ease: "power3" });
    addEventListener("pointermove", (e) => { cur.classList.add("is-live"); cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("a, button, summary, .chip, .mode, [data-drag], .film, .expert__video");
      cur.className = "cursor"; cur.textContent = "";
      if (!t) return;
      if (t.matches(".film, .expert__video")) { cur.classList.add("is-play"); cur.textContent = "PLAY"; }
      else if (t.matches("[data-drag]")) { cur.classList.add("is-drag"); cur.textContent = "DRAG"; }
      else cur.classList.add("is-link");
    });
    // Magnetic buttons
    $$("[data-magnetic]").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--mx", (e.clientX - r.left - r.width / 2) * 0.25 + "px"); b.style.setProperty("--my", (e.clientY - r.top - r.height / 2) * 0.35 + "px"); });
      b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
    });
    // Kheelu turns toward the pointer (3D tilt) and its eyes catch the light where you are.
    $$("[data-tilt]").forEach((wrap) => {
      const k = $(".kheelu", wrap); const rx = gsap.quickTo(k, "rotationY", { duration: 0.8, ease: "power3" }), ry = gsap.quickTo(k, "rotationX", { duration: 0.8, ease: "power3" });
      wrap.addEventListener("pointermove", (e) => { const r = wrap.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; rx(px * 18); ry(-py * 10); });
      wrap.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
    addEventListener("pointermove", (e) => {
      const gx = (e.clientX / innerWidth - 0.5) * 6, gy = (e.clientY / innerHeight - 0.5) * 6;
      root.style.setProperty("--gx", gx + "px"); root.style.setProperty("--gy", gy + "px");
    });
    // Drag-to-scroll film rail
    $$("[data-drag]").forEach((r) => { let down = false, sx = 0, sl = 0, moved = false;
      r.addEventListener("pointerdown", (e) => { down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; });
      addEventListener("pointerup", () => { down = false; });
      r.addEventListener("pointermove", (e) => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; r.scrollLeft = sl - d; });
      r.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());

  /* ---------- Static fallback (reduced motion / no GSAP) ---------- */
  function initStatic() {
    const modal = document.getElementById("modal"); if (!modal) return; const mv = modal.querySelector("video");
    document.querySelectorAll("[data-video]").forEach((b) => b.addEventListener("click", () => { mv.src = b.dataset.video; modal.showModal(); }));
    modal.querySelector("[data-close]").addEventListener("click", () => { mv.pause(); modal.close(); });
    document.querySelectorAll(".scene").forEach((s, i) => { s.style.opacity = i === 0 ? 1 : 0; });
    document.querySelectorAll("[data-safety] li").forEach((li) => li.classList.add("is-lit"));
    document.getElementById("buybar").classList.add("is-on");
  }
})();
