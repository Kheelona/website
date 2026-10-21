/* Kheelona redesign v2: the motion layer.
 * Each chapter is a CSS sticky "track"; its scroll progress drives a GSAP timeline (ScrollTrigger scrub).
 * Transform/opacity only. Reduced motion → static final states. Pointer effects only on fine pointers.
 * Everything is measured on refresh, so resizing (laptop ↔ TV) re-lays out cleanly. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  initAlways();
  if (reduced || !window.gsap) { root.classList.add("reduced"); initStatic(); return; }
  root.classList.add("motion");
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ invalidateOnRefresh: true });
  const scrubbed = (trigger, extra = {}) => ({ trigger, start: "top top", end: "bottom bottom", scrub: 0.6, ...extra });

  /* ---------- Smooth scroll (desktop) ---------- */
  let lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.8 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const goTo = (target) => { if (!target) return; lenis ? lenis.scrollTo(target, { offset: -70, duration: 1.2 }) : target.scrollIntoView({ behavior: "smooth" }); };
  // In-page links, including every "Skip" button, which jumps to the start of the next chapter.
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const t = $(a.getAttribute("href")); if (!t) return; e.preventDefault(); goTo(t); }));

  /* ---------- Living Khelu ---------- */
  $$("[data-khelu]").forEach((k) => {
    const body = $(".khelu__body", k), lids = $$(".khelu__lid", k);
    const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true }).to(body, { scaleY: 1.014, scaleX: 0.996, y: -4, rotation: 0.8, duration: 2.2, ease: "sine.inOut" });
    let timer;
    const blink = () => { gsap.timeline().to(lids, { scaleY: 1, duration: 0.07 }).to(lids, { scaleY: 0, duration: 0.12 }); timer = setTimeout(blink, 2600 + Math.random() * 3200); };
    ScrollTrigger.create({ trigger: k, start: "top bottom", end: "bottom top", onToggle: (s) => { clearTimeout(timer); if (s.isActive) { idle.play(); timer = setTimeout(blink, 900); } else idle.pause(); } });
  });

  /* ---------- Nav + dock ---------- */
  const nav = $("#nav"), dockCta = $("#hero-cta"), wa = $("#wa");
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
    const y = s.scroll();
    nav.classList.toggle("is-scrolled", y > 8);
    nav.classList.toggle("is-hidden", s.direction === 1 && y > 500);
  } });
  // The dock's button is the hero CTA on the first screen, then the sticky-bar CTA (both tracking values kept).
  ScrollTrigger.create({ trigger: "#hero", start: "bottom 80%",
    onEnter: () => { dockCta.dataset.phCaptureAttributeCta = "sticky-bar"; wa.classList.add("is-on"); },
    onLeaveBack: () => { dockCta.dataset.phCaptureAttributeCta = "hero"; wa.classList.remove("is-on"); } });

  ScrollTrigger.batch(".reveal", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }) });

  /* ---------- 01 · Hero ---------- */
  (() => {
    const track = $("#hero"), copy = $("[data-hero-copy]"), stage = $(".hero__stage", track);
    const [b1, b2] = $$("[data-beat]", track); const field = $("[data-qfield]");
    const colors = ["#f59ab8", "#f2a65a", "#e9b84a", "#5fbfa6", "#5aa9ee", "#9d86ee"]; const qs = [];
    for (let i = 0; i < 24; i++) {
      const o = document.createElement("span"); o.className = "qmark"; const a = (i / 24) * Math.PI * 2 + Math.random() * 0.3, r = 0.34 + Math.random() * 0.16;
      o.style.left = 50 + Math.cos(a) * r * 100 + "%"; o.style.top = 52 + Math.sin(a) * r * 80 + "%"; o.style.setProperty("--c", colors[i % 6]);
      const n = document.createElement("span"); n.textContent = "?"; n.style.display = "inline-block"; n.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
      o.appendChild(n); field.appendChild(o); qs.push({ o, n, a });
    }
    const Q = qs.map((q) => q.o);
    gsap.timeline({ scrollTrigger: scrubbed(track) })
      .to(copy, { y: -80, opacity: 0, duration: 0.2, ease: "power1.in" }, 0.04)
      .to(stage, { scale: 1.1, y: () => innerHeight * 0.04, duration: 0.4, ease: "power2.inOut" }, 0.04)
      .fromTo(b1, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.2)
      .to(b1, { opacity: 0, y: -24, duration: 0.1 }, 0.44)
      .fromTo(Q, { opacity: 0, scale: 0.2, x: (i) => -Math.cos(qs[i].a) * 140, y: (i) => -Math.sin(qs[i].a) * 140 }, { opacity: 1, scale: 1, x: 0, y: 0, stagger: { each: 0.008, from: "random" }, ease: "back.out(1.6)", duration: 0.2 }, 0.5)
      .fromTo(b2, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12 }, 0.54)
      .to(Q, { y: (i) => -30 - (i % 5) * 14, duration: 0.3, ease: "none" }, 0.66)
      .to([b2, ...Q], { opacity: 0, duration: 0.08 }, 0.92);
    if (fine) {
      const mv = qs.map((q) => ({ el: q.n, x: gsap.quickTo(q.n, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(q.n, "y", { duration: 0.6, ease: "power3" }) }));
      track.addEventListener("pointermove", (e) => mv.forEach((m) => { const r = m.el.getBoundingClientRect(), dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY, d = Math.hypot(dx, dy), f = d < 160 ? (160 - d) / 160 : 0; m.x((dx / (d || 1)) * f * 70); m.y((dy / (d || 1)) * f * 70); }));
    }
  })();

  /* ---------- 01 · The idea: words fill in as you read ---------- */
  $$("[data-words]").forEach((p) => {
    const wrap = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((w) => { if (!w.trim()) return f.append(w); const s = document.createElement("span"); s.className = "w"; s.textContent = w; f.append(s); }); n.replaceWith(f); }
      else if (n.nodeType === 1) wrap(n);
    });
    wrap(p);
    // The dim state exists only once the heading is near, so no low-contrast text ships at load.
    gsap.fromTo($$(".w", p), { opacity: 0.18 }, { opacity: 1, stagger: 0.15, ease: "none", immediateRender: false, scrollTrigger: { trigger: p, start: "top bottom", end: "bottom 50%", scrub: 0.5 } });
  });

  /* ---------- Sounds for the toy demo (loaded only when tapped) ---------- */
  const sfx = {};
  const play = (id) => { try { const a = (sfx[id] ||= new Audio(`assets/audio/${id}.m4a`)); a.currentTime = 0; a.volume = 0.6; a.play().catch(() => {}); } catch (e) { /* audio is optional */ } };

  /* ---------- 02 · Press, then try the buttons ---------- */
  (() => {
    const track = $("#how"), stage = $(".stage", track), k = $("[data-press-khelu]", track), ring = $("[data-ring]", k);
    const ripples = $$(".khelu__ripple", k), steps = $$("[data-steps] li", track), copy = $("[data-press-copy]"), tryBox = $("[data-try]"), stepsBox = $("[data-steps]");
    const listen = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((r, i) => listen.fromTo(r, { scale: 0.6, opacity: 0.85 }, { scale: 1.9, opacity: 0, duration: 1.6, ease: "power1.out" }, i * 0.5));
    const zoom = () => { const s = innerWidth < 700 ? 1.9 : 2.3, H = k.offsetHeight, cy = k.offsetTop + H / 2; return { s, y: innerHeight * 0.5 - cy - 0.15 * H * s }; };
    const setStep = (i) => steps.forEach((s, j) => s.classList.toggle("is-on", j <= i));
    gsap.timeline({ scrollTrigger: scrubbed(track, { onUpdate: (st) => {
      const p = st.progress; setStep(p < 0.3 ? -1 : p < 0.42 ? 0 : p < 0.54 ? 1 : 2);
      p > 0.5 && p < 0.97 ? listen.play() : listen.pause();
      stage.classList.toggle("is-try", p > 0.6 && p < 0.98);
    } }) })
      .to(copy, { opacity: 0, y: -30, duration: 0.08 }, 0.16)
      .to(k, { scale: () => zoom().s, y: () => zoom().y, duration: 0.18, ease: "power2.inOut" }, 0.14)
      .to(stepsBox, { opacity: 1, duration: 0.06 }, 0.24)
      .fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.42)
      .to(stepsBox, { opacity: 0, duration: 0.05 }, 0.58)
      .to(tryBox, { opacity: 1, duration: 0.06 }, 0.6)
      .to({}, { duration: 0.01 }, 0.99);
    // What each real button does (firmware: AI, Khelu = stories/songs, next, prev, volume up/down, plus power).
    const title = $("[data-try-title]"), text = $("[data-try-text]"), vol = $("[data-vol]"); let level = 3, on = true;
    const ACT = {
      ai: ["✦ Talk", "Press and ask a question. The light ring glows while Khelu listens. Then it answers, and asks one back.", "listen"],
      story: ["Stories & songs", "Plays stories, poems and songs. Story mode works without Wi‑Fi.", "musicbox"],
      prev: ["⏮ Previous", "Go back to the last story or song.", "tap"],
      next: ["⏭ Next", "Skip to the next story or song.", "tap"],
      down: ["− Volume", "Quieter, for bedtime.", "tick"],
      up: ["+ Volume", "Louder, for the living room.", "tick"],
      power: ["⏻ Power", "Turn Khelu on or off.", "toggle"],
    };
    $$("[data-ctl]", track).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.ctl; const [t, d, s] = ACT[id];
      if (id === "up") level = Math.min(5, level + 1);
      if (id === "down") level = Math.max(1, level - 1);
      if (id === "power") on = !on;
      title.textContent = id === "power" ? (on ? "⏻ On" : "⏻ Off") : t;
      text.textContent = id === "power" ? (on ? "Khelu is awake and ready." : "Khelu is off. Press again to wake it.") : d;
      vol.hidden = !(id === "up" || id === "down"); $$("i", vol).forEach((i, j) => i.classList.toggle("on", j < level));
      gsap.fromTo(tryBox, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
      gsap.to(ring, { opacity: on ? 1 : 0.1, duration: 0.3 });
      if (id === "ai" && on) gsap.fromTo(ring, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      if (on || id === "power") play(s);
    }));
  })();

  /* ---------- 03 · The conversation drives the sky ---------- */
  (() => {
    const track = $("#talk"), bubbles = $$("[data-chat] .bubble", track), rays = $$("[data-rays] path", track), scatter = $("[data-scatter]", track), sunset = $("[data-sunset]", track), sun = $("[data-sun]", track);
    rays.forEach((r) => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
    const dots = [];
    for (let i = 0; i < 44; i++) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); const t = Math.random(); c.setAttribute("cx", 120 + t * 400); c.setAttribute("cy", 120 + t * 230 + (Math.random() - 0.5) * 30); c.setAttribute("r", 3 + Math.random() * 3); c.style.opacity = 0; scatter.appendChild(c); dots.push(c); }
    const pop = { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "back.out(2)" };
    gsap.set(bubbles, { y: 16, scale: 0.96 });
    gsap.timeline({ scrollTrigger: scrubbed(track) })
      .to(bubbles[0], pop, 0.04)
      .to(bubbles[1], pop, 0.2).to(rays, { strokeDashoffset: 0, stagger: 0.015, duration: 0.14, ease: "none" }, 0.2)
      .to(bubbles[2], pop, 0.4).to(dots, { opacity: 0.9, duration: 0.04, stagger: 0.002 }, 0.4)
      .to(dots, { x: () => (Math.random() - 0.5) * 260, y: () => -Math.random() * 220, duration: 0.16, stagger: 0.002 }, 0.42)
      .to(rays.filter((_, i) => i !== 4), { opacity: 0.15, duration: 0.08 }, 0.44)
      .to(bubbles[3], pop, 0.6)
      .to(bubbles[4], pop, 0.78).to(sunset, { opacity: 1, duration: 0.1 }, 0.78).to([...rays, ...dots], { opacity: 0, duration: 0.08 }, 0.78).to(sun, { y: 200, duration: 0.12 }, 0.78)
      .to({}, { duration: 0.01 }, 0.99);
  })();

  /* ---------- 04 · A day at home ---------- */
  (() => {
    const track = $("#day"), scenes = $$(".scene", track), dots = $$("[data-home-progress] i", track);
    const time = $("[data-home-time]"), line = $("[data-home-line]"), mode = $("[data-home-mode]"), say = $("[data-home-say]"), bubble = $("[data-home-bubble]");
    const k = $("[data-home-khelu]"), ripples = $$(".khelu__ripple", k), ring = $("[data-ring]", k);
    const DAY = [
      ["7:40 am · Breakfast", "The first question <span class=mark>of the day.</span>", "AI mode · on home Wi‑Fi", "What makes toast go crunchy?"],
      ["4:15 pm · After school", "It remembers <span class=mark>yesterday.</span>", "Picks up where your child stopped", "Shall we find out how rockets land?"],
      ["6:30 pm · While you cook", "Something to <span class=mark>think about.</span>", "AI mode · on home Wi‑Fi", "How many spoons can you count?"],
      ["Sunday · At Nani’s", "Stories, <span class=mark>no Wi‑Fi needed.</span>", "Story mode · works offline", "Once upon a time, a little rabbit…"],
      ["8:30 pm · Bedtime", "One last <span class=mark>story.</span>", "Story mode · works offline", "Goodnight! What shall we dream about?"],
    ];
    const talk = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((r, i) => talk.fromTo(r, { scale: 0.6, opacity: 0.8 }, { scale: 1.8, opacity: 0, duration: 1.4, ease: "power1.out" }, i * 0.7));
    gsap.set(ring, { opacity: 1 });
    let cur = 0;
    const show = (i) => {
      if (i === cur) return; const dir = i > cur ? 1 : -1, prev = cur; cur = i;
      gsap.to(scenes[prev], { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.inOut" });
      gsap.fromTo(scenes[i], { opacity: 0, scale: 1.06, xPercent: 3 * dir }, { opacity: 1, scale: 1, xPercent: 0, duration: 0.9, ease: "power3.out" });
      gsap.timeline().to(k, { y: -36, duration: 0.25, ease: "power2.out" }).to(k, { y: 0, duration: 0.45, ease: "bounce.out" });
      const [t, l, m, s] = DAY[i];
      gsap.timeline().to([time, line, mode], { opacity: 0, y: -10, duration: 0.18, stagger: 0.03 }).add(() => { time.textContent = t; line.innerHTML = l; mode.textContent = m; }).to([time, line, mode], { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power3.out" });
      gsap.timeline().to(bubble, { opacity: 0, scale: 0.85, duration: 0.18, transformOrigin: "10% 100%" }).add(() => { say.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; }).to(bubble, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }).add(() => { say.textContent = s; }, "+=0.5").fromTo(say, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
    };
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => show(Math.min(DAY.length - 1, Math.floor(st.progress * DAY.length * 0.999))), onToggle: (st) => (st.isActive ? talk.play() : talk.pause()) });
  })();

  /* ---------- 05 · Languages orbit Khelu (re-measured on every refresh/resize) ---------- */
  (() => {
    const track = $("#languages"), orbit = $(".langs__orbit", track), chips = $$("[data-chips] .chip", track), [en, hi] = $$("[data-swap]", track); let rot = 0;
    const place = () => {
      const w = orbit.clientWidth, h = orbit.clientHeight, rx = w * 0.44, ry = h * 0.4;
      chips.forEach((c, i) => { const a = (i / chips.length) * Math.PI * 2 + rot; c.style.left = `${w / 2 + Math.cos(a) * rx}px`; c.style.top = `${h * 0.46 + Math.sin(a) * ry}px`; c.style.zIndex = Math.sin(a) > 0 ? 6 : 1; });
    };
    place(); ScrollTrigger.addEventListener("refresh", place);
    ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", onUpdate: (st) => { rot = st.progress * Math.PI * 0.9; place(); } });
    gsap.fromTo(chips, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.05, ease: "back.out(2)", scrollTrigger: { trigger: track, start: "top 60%", end: "top top", scrub: 0.6 } });
    gsap.timeline({ scrollTrigger: { trigger: track, start: "45% bottom", end: "75% bottom", scrub: 0.6 } }).to(en, { opacity: 0, y: -10 }).fromTo(hi, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, "<0.3");
  })();

  /* ---------- 06 · Memory path ---------- */
  (() => {
    const board = $("[data-memory]"); if (!board) return; const path = $("[data-mem-path]", board), svg = path.ownerSVGElement, ns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(ns, "defs"), cp = document.createElementNS(ns, "clipPath"); cp.id = "memclip"; const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", 0); rect.setAttribute("y", -50); rect.setAttribute("height", 600); rect.setAttribute("width", 0); cp.appendChild(rect); defs.appendChild(cp); svg.prepend(defs); path.setAttribute("clip-path", "url(#memclip)");
    const [y, t] = $$(".mem-card", board);
    gsap.timeline({ scrollTrigger: { trigger: board, start: "top 85%", end: "bottom 60%", scrub: 0.6 } }).from(y, { opacity: 0, y: 30, duration: 0.2 }).to(rect, { attr: { width: 1000 }, duration: 0.6, ease: "none" }).from(t, { opacity: 0, y: 30, scale: 0.94, duration: 0.25 }, ">-0.1");
  })();

  /* ---------- 07 · Bedtime stars ---------- */
  const sky = $("[data-stars]");
  if (sky) for (let i = 0; i < 42; i++) { const s = document.createElement("i"); s.className = "star"; s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 70 + "%"; s.style.animationDelay = Math.random() * 3 + "s"; sky.appendChild(s); }

  /* ---------- 08 · Privacy beats ---------- */
  (() => {
    const track = $("#privacy"), beats = $$("[data-beats] .beat", track), lock = $(".lock", track), forget = $("[data-forget]", track), items = $$("li", forget); let cur = 0;
    gsap.set(lock, { scale: 0, rotation: -20 });
    const show = (i) => {
      if (i === cur) return;
      gsap.to(beats[cur], { opacity: 0, y: -16, duration: 0.3 });
      gsap.fromTo(beats[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      gsap.fromTo($$(".pcard", beats[i]), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: "power3.out", delay: 0.1 });
      gsap.to(forget, { opacity: i === 3 ? 1 : 0, duration: 0.3 });
      if (i === 3) { gsap.set(items, { x: 0, opacity: 1 }); gsap.to(items, { x: "120%", opacity: 0, stagger: 0.6, duration: 0.5, delay: 0.8, ease: "power2.in" }); }
      cur = i;
    };
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => show(Math.min(3, Math.floor(st.progress * 4 * 0.999))) });
    gsap.to(lock, { scale: 1, rotation: 0, ease: "back.out(2.5)", scrollTrigger: { trigger: track, start: "top 60%", end: "top 20%", scrub: 0.6 } });
    gsap.from(".pphone", { y: 60, rotation: 3, scrollTrigger: { trigger: track, start: "top bottom", end: "top top", scrub: 0.6 } });
  })();

  /* ---------- 09 · Safety tiles ---------- */
  ScrollTrigger.batch(".tile", { start: "top 90%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, onComplete: () => gsap.set(els, { clearProps: "transform" }) }) });

  /* ---------- 10 · Parent app tabs (tap, or they advance while in view) ---------- */
  (() => {
    const tabs = $$("[data-tab]"), shots = $$("[data-tabshots] img"); let i = 0, timer;
    const set = (n) => { i = n; tabs.forEach((t, j) => { t.classList.toggle("is-on", j === n); t.setAttribute("aria-selected", j === n); }); shots.forEach((s, j) => s.classList.toggle("is-on", j === n)); };
    tabs.forEach((t, n) => t.addEventListener("click", () => { clearInterval(timer); set(n); }));
    ScrollTrigger.create({ trigger: "#app", start: "top 60%", end: "bottom 40%", onToggle: (s) => { clearInterval(timer); if (s.isActive) timer = setInterval(() => set((i + 1) % tabs.length), 4000); } });
  })();

  /* ---------- Films preview on hover (pointer) or in view (touch) ---------- */
  const startLoop = (v) => { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); };
  if (fine) $$(".film").forEach((f) => { const v = $("video", f); f.addEventListener("pointerenter", () => startLoop(v)); f.addEventListener("pointerleave", () => v.pause()); });
  else { const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? startLoop(e.target) : e.target.pause())), { threshold: 0.6 }); $$(".film video").forEach((v) => io.observe(v)); }

  /* ---------- Pointer layer ---------- */
  if (fine) {
    const cur = $("#cursor"), cx = gsap.quickTo(cur, "x", { duration: 0.25, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: 0.25, ease: "power3" });
    addEventListener("pointermove", (e) => { cur.classList.add("is-live"); cx(e.clientX); cy(e.clientY); root.style.setProperty("--gx", (e.clientX / innerWidth - 0.5) * 6 + "px"); root.style.setProperty("--gy", (e.clientY / innerHeight - 0.5) * 6 + "px"); });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("a, button, summary, .chip, .mode, .tile, [data-drag], .film, .expert__video"); cur.className = "cursor is-live"; cur.textContent = ""; if (!t) return;
      if (t.matches(".film, .expert__video")) { cur.classList.add("is-play"); cur.textContent = "PLAY"; } else if (t.matches("[data-drag]")) { cur.classList.add("is-drag"); cur.textContent = "DRAG"; } else cur.classList.add("is-link");
    });
    $$("[data-magnetic]").forEach((b) => { b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--mx", (e.clientX - r.left - r.width / 2) * 0.25 + "px"); b.style.setProperty("--my", (e.clientY - r.top - r.height / 2) * 0.35 + "px"); }); b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); }); });
    $$("[data-tilt]").forEach((w) => { const k = $(".khelu", w), rx = gsap.quickTo(k, "rotationY", { duration: 0.8, ease: "power3" }), ry = gsap.quickTo(k, "rotationX", { duration: 0.8, ease: "power3" }); w.addEventListener("pointermove", (e) => { const r = w.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - 0.5) * 18); ry(-((e.clientY - r.top) / r.height - 0.5) * 10); }); w.addEventListener("pointerleave", () => { rx(0); ry(0); }); });
    $$("[data-drag]").forEach((r) => { let down = false, sx = 0, sl = 0, moved = false; r.addEventListener("pointerdown", (e) => { down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; }); addEventListener("pointerup", () => { down = false; }); r.addEventListener("pointermove", (e) => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; r.scrollLeft = sl - d; }); r.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true); });
  }

  /* Re-measure after fonts/images settle and on every resize (laptop → TV and back). */
  addEventListener("load", () => ScrollTrigger.refresh());
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => ScrollTrigger.refresh(), 200); });

  /* ---------- Always (with or without motion): the video dialog with a download link ---------- */
  function initAlways() {
    const modal = $("#modal"); if (!modal) return; const mv = $("video", modal), dl = $("[data-download]", modal);
    const open = (src, wide) => { modal.classList.toggle("modal--wide", !!wide); mv.src = src; dl.href = src; modal.showModal(); mv.play().catch(() => {}); };
    const close = () => { mv.pause(); mv.removeAttribute("src"); mv.load(); modal.close(); };
    $("[data-close]", modal).addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.addEventListener("close", () => mv.pause());
    $$("[data-video]").forEach((b) => b.addEventListener("click", () => open(b.dataset.video, b.hasAttribute("data-wide"))));
  }
  function initStatic() {
    $$(".scene").forEach((s, i) => { s.style.opacity = i === 0 ? 1 : 0; });
    $("#wa").classList.add("is-on");
  }
})();
