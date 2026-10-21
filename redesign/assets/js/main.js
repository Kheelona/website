/* Kheelona redesign v3: the motion layer.
 * Chapters are CSS sticky "tracks"; ScrollTrigger progress scrubs a timeline per chapter.
 * Transform/opacity only. Reduced motion → everything static. Pointer effects on fine pointers only.
 * Sizes in JS scale with the root font size (rem), so a 4K TV gets the same composition as a laptop. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const R = () => parseFloat(getComputedStyle(root).fontSize) / 16; // rem scale
  const phone = () => innerWidth < 700;

  initModal();
  if (reduced || !window.gsap) { root.classList.add("reduced"); initStatic(); return; }
  root.classList.add("motion");
  gsap.registerPlugin(ScrollTrigger);
  const end = (tl) => tl.to({}, { duration: 0.001 }, 0.999); // every chapter timeline spans exactly 0→1

  /* ---------- Smooth scroll (desktop) ---------- */
  let lenis = null;
  if (fine && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.8 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: "smooth" }));
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const t = $(a.getAttribute("href")); if (!t) return; e.preventDefault(); scrollToY(t.getBoundingClientRect().top + scrollY - 90 * R()); }));
  // Every demo can be skipped: jump to the end of its track.
  $$("[data-skip]").forEach((b) => b.addEventListener("click", () => { const t = $(b.dataset.skip); scrollToY(t.offsetTop + t.offsetHeight - innerHeight * 0.4); }));

  /* ---------- Living Kheelu ---------- */
  $$("[data-kheelu]").forEach((k) => {
    const body = $(".kheelu__body", k); const lids = $$(".kheelu__lid", k);
    const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true }).to(body, { scaleY: 1.014, scaleX: 0.996, y: -4, rotation: 0.8, duration: 2.2, ease: "sine.inOut" });
    let timer;
    const blink = () => { gsap.timeline().to(lids, { scaleY: 1, duration: 0.07 }).to(lids, { scaleY: 0, duration: 0.12 }); timer = setTimeout(blink, 2600 + Math.random() * 3200); };
    ScrollTrigger.create({ trigger: k, start: "top bottom", end: "bottom top", onToggle: (s) => { clearTimeout(timer); if (s.isActive) { idle.play(); timer = setTimeout(blink, 900); } else idle.pause(); } });
  });

  /* ---------- Nav: solid once scrolled, hides on the way down ---------- */
  const nav = $("#nav");
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { const y = s.scroll(); nav.classList.toggle("is-solid", y > 20); nav.classList.toggle("is-hidden", s.direction === 1 && y > 600); } });

  /* ---------- Reveals ---------- */
  ScrollTrigger.batch(".reveal", { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }) });

  /* ---------- 1 · Hero: headline → "Meet Kheelu" → hundreds of questions ---------- */
  (() => {
    const track = $("#hero"); const A = $("[data-hero-a]"), B = $("[data-hero-b]"), C = $("[data-hero-caption]"); const stage = $(".hero__stage", track); const field = $("[data-qfield]");
    const colors = ["#f59ab8", "#f2a65a", "#e9b84a", "#5fbfa6", "#5aa9ee", "#9d86ee"]; const qs = [];
    for (let i = 0; i < 24; i++) {
      const outer = document.createElement("span"); outer.className = "qmark"; const a = (i / 24) * Math.PI * 2 + Math.random() * 0.3; const r = 0.3 + Math.random() * 0.18;
      outer.style.left = 50 + Math.cos(a) * r * 100 + "%"; outer.style.top = 50 + Math.sin(a) * r * 80 + "%"; outer.style.setProperty("--c", colors[i % 6]);
      const inner = document.createElement("span"); inner.textContent = "?"; inner.style.display = "inline-block"; inner.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;
      outer.appendChild(inner); field.appendChild(outer); qs.push({ outer, inner, a });
    }
    const Q = qs.map((q) => q.outer);
    end(gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .to(A, { y: -50, opacity: 0, duration: 0.14 }, 0.1)
      .fromTo(B, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14 }, 0.2)
      .to(stage, { scale: 1.06, duration: 0.3, ease: "power1.inOut" }, 0.15)
      .to(B, { y: -40, opacity: 0, duration: 0.12 }, 0.5)
      .fromTo(Q, { opacity: 0, scale: 0.2, x: (i) => -Math.cos(qs[i].a) * 140 * R(), y: (i) => -Math.sin(qs[i].a) * 140 * R() }, { opacity: 1, scale: 1, x: 0, y: 0, stagger: { each: 0.008, from: "random" }, ease: "back.out(1.6)", duration: 0.2 }, 0.52)
      .fromTo(C, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.6)
      .to(Q, { y: (i) => (-30 - (i % 5) * 14) * R(), duration: 0.3, ease: "none" }, 0.72));
    if (fine) {
      const movers = qs.map((q) => ({ el: q.inner, x: gsap.quickTo(q.inner, "x", { duration: 0.6, ease: "power3" }), y: gsap.quickTo(q.inner, "y", { duration: 0.6, ease: "power3" }) }));
      track.addEventListener("pointermove", (e) => { const rad = 160 * R(); movers.forEach((m) => { const r = m.el.getBoundingClientRect(); const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY; const d = Math.hypot(dx, dy); const f = d < rad ? (rad - d) / rad : 0; m.x((dx / (d || 1)) * f * 70 * R()); m.y((dy / (d || 1)) * f * 70 * R()); }); });
    }
  })();

  /* ---------- Statement: words fill in as you read (dim state only near the section) ---------- */
  $$("[data-words]").forEach((p) => {
    const wrap = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((w) => { if (!w.trim()) return f.append(w); const s = document.createElement("span"); s.className = "w"; s.textContent = w; f.append(s); }); n.replaceWith(f); }
      else if (n.nodeType === 1) wrap(n);
    });
    wrap(p);
    gsap.fromTo($$(".w", p), { opacity: 0.18 }, { opacity: 1, stagger: 0.15, ease: "none", immediateRender: false, scrollTrigger: { trigger: p, start: "top bottom", end: "bottom 50%", scrub: 0.5 } });
  });

  /* ---------- 2 · Try it: zoom into the tummy, then the real buttons are clickable ---------- */
  (() => {
    const track = $("#how"); const stage = $(".stage", track); const k = $("[data-try-kheelu]"); const body = $(".kheelu__body", k);
    const ring = $("[data-ring]", k); const ripples = $$(".kheelu__ripple", k); const steps = $$("[data-steps] li"); const demo = $("[data-demo]"); const say = $("[data-demo-say]"); const vol = $$("[data-vol] i");
    const listen = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((r, i) => listen.fromTo(r, { scale: 0.6, opacity: 0.85 }, { scale: 1.9, opacity: 0, duration: 1.6, ease: "power1.out" }, i * 0.5));
    const zoom = () => { const s = phone() ? 2.2 : 2.6; const H = k.offsetHeight; const cy = k.offsetTop + H / 2; const target = phone() ? stage.offsetHeight * 0.36 : stage.offsetHeight * 0.5; const cx = k.offsetLeft + k.offsetWidth / 2; const tx = phone() ? 0 : Math.min(stage.offsetWidth * 0.16, 260 * R()); return { s, y: target - cy - 0.118 * H * s, x: tx + (stage.offsetWidth / 2 - cx) }; };
    let live = false;
    const setLive = (on) => { if (on === live) return; live = on; demo.classList.toggle("is-live", on); stage.classList.toggle("demo-on", on); $$(".ctrl", k).forEach((c) => (c.tabIndex = on ? 0 : -1)); };
    end(gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true, onUpdate: (st) => {
      const p = st.progress; steps.forEach((s, j) => s.classList.toggle("is-on", p > [0.33, 0.41, 0.49][j]));
      p > 0.49 && p < 0.97 ? listen.play() : listen.pause(); setLive(p > 0.56 && p < 0.96);
    } } })
      .fromTo("[data-nochips] span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.07 }, 0.02)
      .to("[data-nochips] span", { opacity: 0, y: -16, stagger: 0.02, duration: 0.05 }, 0.15)
      .to("[data-try-copy]", { opacity: 0, y: -30, duration: 0.05 }, 0.18)
      .to(k, { scale: () => zoom().s, y: () => zoom().y, x: () => zoom().x, ease: "power2.inOut", duration: 0.12 }, 0.2)
      .to("[data-steps]", { opacity: 1, duration: 0.04 }, 0.3)
      .fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.41)
      .to("[data-steps]", { opacity: 0, duration: 0.04 }, 0.55)
      .fromTo(demo, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.05 }, 0.56)
      .to(demo, { opacity: 0, duration: 0.03 }, 0.95)
      .to(k, { scale: 1, y: 0, x: 0, ease: "power2.inOut", duration: 0.04 }, 0.95));

    // The demo: each real button does what it does on Kheelu.
    let level = 3, on = true, story = 0;
    const stories = ["the moon who said hello", "the rabbit who counted stars", "the kite that wanted to fly"];
    const speak = (text) => { say.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; gsap.delayedCall(0.45, () => { say.textContent = text; }); };
    const burst = () => { gsap.fromTo(ripples, { scale: 0.6, opacity: 0.9 }, { scale: 2, opacity: 0, duration: 1.1, stagger: 0.18, ease: "power1.out" }); gsap.fromTo(body, { scale: 1 }, { scale: 1.02, yoyo: true, repeat: 1, duration: 0.15 }); };
    const showVol = () => vol.forEach((v, i) => v.classList.toggle("is-on", i < level));
    showVol();
    const act = (c) => {
      $$(".demo__list button").forEach((b) => b.classList.toggle("is-on", b.dataset.ctrl === c));
      if (c === "power") { on = !on; gsap.to(ring, { opacity: on ? 1 : 0, duration: 0.3 }); gsap.to($(".kheelu__img", k), { filter: on ? "brightness(1)" : "brightness(0.82)", duration: 0.4 }); return speak(on ? "Hello again! Press the wake-up button to talk." : "Bye for now! (Kheelu is off.)"); }
      if (!on) return speak("I’m off. Press power to wake me.");
      burst();
      if (c === "wake") speak("Hi! I’m listening. What would you like to know?");
      if (c === "play") speak(`Story time! Once upon a time, there was ${stories[story]}…`);
      if (c === "next") { story = (story + 1) % stories.length; speak(`Next story: ${stories[story]}.`); }
      if (c === "prev") { story = (story + stories.length - 1) % stories.length; speak(`Going back: ${stories[story]}.`); }
      if (c === "up" || c === "down") { level = Math.max(1, Math.min(6, level + (c === "up" ? 1 : -1))); showVol(); speak(c === "up" ? "A little louder!" : "A little quieter."); }
    };
    $$("[data-ctrl]", track).forEach((b) => b.addEventListener("click", () => act(b.dataset.ctrl)));
  })();

  /* ---------- 3 · A real conversation: Kheelu explains as the sky draws itself ---------- */
  (() => {
    const track = $("#asks"); const rays = $$("[data-rays] path", track); const scatter = $("[data-scatter]", track); const bub = $$("[data-thread] .bubble", track); const ask = $(".thread .ask", track);
    rays.forEach((r) => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
    const dots = []; for (let i = 0; i < 46; i++) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); const t = Math.random(); c.setAttribute("cx", 120 + t * 400); c.setAttribute("cy", 120 + t * 230 + (Math.random() - 0.5) * 30); c.setAttribute("r", 3 + Math.random() * 3); c.style.opacity = 0; scatter.appendChild(c); dots.push(c); }
    const pop = (el, at) => tl.fromTo(el, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "back.out(1.8)" }, at);
    const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 } });
    pop(bub[0], 0.04);
    tl.to(rays, { strokeDashoffset: 0, stagger: 0.015, duration: 0.14, ease: "none" }, 0.12); pop(bub[1], 0.16);
    tl.to(dots, { opacity: 0.9, duration: 0.04, stagger: 0.002 }, 0.32).to(dots, { x: () => (Math.random() - 0.5) * 260, y: () => -Math.random() * 220, duration: 0.2, stagger: 0.002, ease: "power2.out" }, 0.34)
      .to(rays.filter((_, i) => i !== 4), { opacity: 0.12, duration: 0.08 }, 0.36); pop(bub[2], 0.36);
    tl.to("[data-qmark]", { opacity: 0, duration: 0.06 }, 0.5).to(".sky", { background: "linear-gradient(#7fbff3, #cfe6fb 70%, #e7f3e6)", duration: 0.1 }, 0.5); pop(bub[3], 0.52);
    tl.to("[data-sunset]", { opacity: 0.5, duration: 0.12 }, 0.68); pop(bub[4], 0.68);
    tl.fromTo([ask, ".thread .note"], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06 }, 0.82);
    end(tl);
  })();

  /* ---------- 4 · A day at home: rooms change around Kheelu as it speaks ---------- */
  (() => {
    const track = $("#day"); const scenes = $$(".scene", track); const dots = $$("[data-home-progress] i", track);
    const time = $("[data-home-time]"), line = $("[data-home-line]"), mode = $("[data-home-mode]"), say = $("[data-home-say]"), bubble = $("[data-home-bubble]");
    const k = $("[data-home-kheelu]"); const ripples = $$(".kheelu__ripple", k); gsap.set($("[data-ring]", k), { opacity: 1 });
    const DAY = [
      ["7:40 am · Breakfast", "The first <span class=mark>why</span> of the day.", "AI mode · on home Wi‑Fi", "What do you think makes toast crunchy?"],
      ["4:15 pm · After school", "It remembers <span class=mark>yesterday.</span>", "Picks up where you stopped", "Shall we find out how rockets land?"],
      ["6:30 pm · While you cook", "Something to think about. <span class=mark>Not a cartoon.</span>", "AI mode · on home Wi‑Fi", "How many spoons can you count?"],
      ["Sunday · At Nani’s", "Stories and jingles. <span class=mark>No Wi‑Fi.</span>", "Story mode · works offline", "Once upon a time, a little rabbit asked the moon a question…"],
      ["8:30 pm · Bedtime", "One last story. <span class=mark>Lights low.</span>", "Story mode · works offline", "Goodnight! What shall we dream about?"],
    ];
    const talk = gsap.timeline({ repeat: -1 }); ripples.forEach((r, i) => talk.fromTo(r, { scale: 0.6, opacity: 0.8 }, { scale: 1.8, opacity: 0, duration: 1.4, ease: "power1.out" }, i * 0.7));
    let cur = 0;
    const show = (i) => {
      if (i === cur) return; const dir = i > cur ? 1 : -1; const prev = cur; cur = i;
      gsap.to(scenes[prev], { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.inOut" });
      gsap.fromTo(scenes[i], { opacity: 0, scale: 1.06, xPercent: 3 * dir }, { opacity: 1, scale: 1, xPercent: 0, duration: 0.9, ease: "power3.out" });
      gsap.timeline().to(k, { y: -38 * R(), duration: 0.25, ease: "power2.out" }).to(k, { y: 0, duration: 0.45, ease: "bounce.out" });
      const [t, l, m, s] = DAY[i];
      gsap.timeline().to([time, line, mode], { opacity: 0, y: -12, duration: 0.2, stagger: 0.03 }).add(() => { time.textContent = t; line.innerHTML = l; mode.textContent = m; }).to([time, line, mode], { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
      gsap.timeline().to(bubble, { opacity: 0, scale: 0.85, duration: 0.18, transformOrigin: "10% 100%" }).add(() => { say.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; }).to(bubble, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }).add(() => { say.textContent = s; }, "+=0.5");
      dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
    };
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => show(Math.min(DAY.length - 1, Math.floor(st.progress * DAY.length * 0.999))), onToggle: (st) => (st.isActive ? talk.play() : talk.pause()) });
  })();

  /* ---------- 5 · Languages: greetings orbit Kheelu; the sentence switches language ---------- */
  (() => {
    const track = $("#languages"); const holder = $("[data-chips]", track); const chips = $$(".chip", holder); const [en, hi] = $$("[data-swap]", track);
    const grid = phone(); if (grid) { holder.classList.add("chips--grid"); $(".chapter-copy", track).appendChild(holder); }
    const k = $(".langs__orbit .kheelu", track);
    const place = (rot) => { if (grid) return; const kr = k.getBoundingClientRect(), sr = $(".stage", track).getBoundingClientRect(); const cx = kr.left - sr.left + kr.width / 2, cy = kr.top - sr.top + kr.height / 2; const rx = Math.min(innerWidth * 0.3, 420 * R()), ry = Math.min(innerHeight * 0.3, 230 * R());
      chips.forEach((c, i) => { const a = (i / chips.length) * Math.PI * 2 + rot; c.style.left = cx + Math.cos(a) * rx + "px"; c.style.top = cy + Math.sin(a) * ry + "px"; c.style.zIndex = Math.sin(a) > 0 ? 6 : 1; }); };
    requestAnimationFrame(() => place(0));
    gsap.fromTo(chips, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, stagger: 0.05, ease: "back.out(2)", scrollTrigger: { trigger: track, start: "top 70%", end: "top top", scrub: 0.6 } });
    ScrollTrigger.create({ trigger: track, start: "top bottom", end: "bottom top", onUpdate: (st) => place(st.progress * Math.PI * 0.8) });
    gsap.timeline({ scrollTrigger: { trigger: track, start: "35% bottom", end: "65% bottom", scrub: 0.6 } }).to(en, { opacity: 0, y: -10 }).fromTo(hi, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, "<0.3");
    addEventListener("resize", () => place(0));
  })();

  /* ---------- 6 · Memory: the path draws itself ---------- */
  (() => {
    const board = $("[data-memory]"); const path = $("[data-mem-path]", board); const svg = path.ownerSVGElement; const ns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(ns, "defs"), cp = document.createElementNS(ns, "clipPath"), rect = document.createElementNS(ns, "rect"); cp.id = "memclip";
    rect.setAttribute("x", 0); rect.setAttribute("y", -50); rect.setAttribute("height", 500); rect.setAttribute("width", 0); cp.appendChild(rect); defs.appendChild(cp); svg.prepend(defs); path.setAttribute("clip-path", "url(#memclip)");
    const [y, t] = $$(".mem-card", board);
    gsap.timeline({ scrollTrigger: { trigger: board, start: "top 85%", end: "bottom 55%", scrub: 0.6 } }).from(y, { opacity: 0, y: 30, duration: 0.2 }).to(rect, { attr: { width: 660 }, duration: 0.6, ease: "none" }).from(t, { opacity: 0, y: 30, scale: 0.94, duration: 0.25 }, ">-0.1");
  })();

  /* ---------- 7 · Bedtime stars ---------- */
  const sky = $("[data-stars]"); for (let i = 0; i < 42; i++) { const s = document.createElement("i"); s.className = "star"; s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 70 + "%"; s.style.animationDelay = Math.random() * 3 + "s"; sky.appendChild(s); }

  /* ---------- 8 · Parent app ---------- */
  (() => {
    const track = $("#app"); const items = $$("[data-app-list] li", track); const shots = $$("[data-app-screens] img", track); let cur = 0;
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => {
      const i = Math.min(items.length - 1, Math.floor(st.progress * items.length * 0.999)); if (i === cur) return;
      gsap.to(shots[cur], { opacity: 0, y: -24, duration: 0.5 }); gsap.fromTo(shots[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      items.forEach((it, j) => it.classList.toggle("is-on", j === i)); cur = i;
    } });
  })();

  /* ---------- 9 · Safety: cards stack; the one underneath settles back ---------- */
  (() => {
    const cards = $$("[data-stack] .scard");
    cards.forEach((c, i) => {
      gsap.from($(".scard__ico", c), { scale: 0.4, rotation: -20, opacity: 0, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: c, start: "top 85%", once: true } });
      if (i < cards.length - 1) gsap.timeline({ scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top 30%", scrub: true } }).to(c, { scale: 0.94, ease: "none" }, 0).to([...c.children], { opacity: 0, ease: "none" }, 0);
    });
  })();

  /* ---------- Privacy: one promise at a time, the way the launch film tells it ---------- */
  (() => {
    const track = $("#privacy"); if (!track) return;
    const steps = $$("[data-pv] li", track), dots = $$("[data-pv-dots] i", track), tags = $$("[data-pv-tags] .pv__tag", track), hl = $("[data-pv-hl]", track);
    // Rows on the privacy-centre screenshot (% from top, height): title, (none), (none), keep-chats + voice switch, download + delete.
    const ROWS = [[9, 7], null, null, [21.6, 13.6], [35.6, 13.4]];
    let cur = -1;
    const go = (i) => {
      if (i === cur) return; cur = i;
      steps.forEach((el, j) => el.classList.toggle("is-on", j === i)); dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
      tags.forEach((t) => t.classList.toggle("is-on", +t.dataset.step === i));
      const r = ROWS[i]; hl.classList.toggle("is-red", i === 4);
      if (r) gsap.to(hl, { top: r[0] + "%", height: r[1] + "%", opacity: 1, duration: 0.6, ease: "power3.out" }); else gsap.to(hl, { opacity: 0, duration: 0.3 });
    };
    go(0);
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => go(Math.min(steps.length - 1, Math.floor(st.progress * steps.length * 0.999))) });
    gsap.from($(".pv__badge", track), { scale: 0.4, rotation: -25, opacity: 0, duration: 0.8, ease: "back.out(2.2)", scrollTrigger: { trigger: track, start: "top 70%", once: true } });
    gsap.from($(".pv__phone", track), { y: 80, rotation: 4, scrollTrigger: { trigger: track, start: "top bottom", end: "top top", scrub: 0.6 } });
  })();

  /* ---------- Backed by: cards rise in, one after another ---------- */
  gsap.from("[data-backed] .backed__card", { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: "[data-backed]", start: "top 85%", once: true } });

  /* ---------- Real families: scroll moves the reel sideways; the card in the middle grows and plays ---------- */
  (() => {
    const track = $("#films"); const reel = $("[data-reel]", track); if (!reel) return;
    const items = $$(".reel__item", reel); const bar = $("[data-reel-bar]", track);
    const dist = () => Math.max(0, reel.scrollWidth - innerWidth);
    let playing = null;
    const focus = () => {
      const mid = innerWidth / 2; let best = null, bestD = 1e9;
      items.forEach((it) => { const r = it.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); const k = Math.max(0, 1 - d / (innerWidth * 0.6));
        gsap.set(it, { scale: 0.86 + 0.14 * k }); if (d < bestD) { bestD = d; best = it; } });
      items.forEach((it) => it.classList.toggle("is-center", it === best));
      const v = best && best.matches(".film") ? $("video", best) : null;
      if (v !== playing) { if (playing) playing.pause(); playing = v; if (v) { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); } }
    };
    gsap.to(reel, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => { bar.style.transform = `scaleX(${st.progress})`; focus(); }, onLeave: () => playing && playing.pause(), onLeaveBack: () => playing && playing.pause() } });
    focus();
  })();

  /* ---------- Films: preview on hover (touch: in view) ---------- */
  const startLoop = (v) => { if (!v.src) v.src = v.dataset.loop; v.play().catch(() => {}); };
  if (fine) $$(".film__play").forEach((f) => { const v = $("video", f); f.addEventListener("pointerenter", () => startLoop(v)); f.addEventListener("pointerleave", () => v.pause()); });
  else { const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? startLoop(e.target) : e.target.pause())), { threshold: 0.6 }); $$(".film__play video").forEach((v) => io.observe(v)); }

  /* ---------- CTA bar + WhatsApp: the bar's button reports "hero" in the hero, "sticky-bar" after ---------- */
  const heroCta = $("#hero-cta"), wa = $("#wa");
  ScrollTrigger.create({ trigger: "#hero", start: "bottom 60%", onEnter: () => { heroCta.dataset.phCaptureAttributeCta = "sticky-bar"; wa.classList.add("is-on"); }, onLeaveBack: () => { heroCta.dataset.phCaptureAttributeCta = "hero"; wa.classList.remove("is-on"); } });

  /* ---------- Pointer layer ---------- */
  if (fine) {
    const cur = $("#cursor"); const cx = gsap.quickTo(cur, "x", { duration: 0.25, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: 0.25, ease: "power3" });
    addEventListener("pointermove", (e) => { cur.classList.add("is-live"); cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", (e) => { const t = e.target.closest("a, button, summary, .chip, .mode, [data-drag], .film__play, .expert__video"); cur.className = "cursor is-live"; cur.textContent = ""; if (!t) return;
      if (t.matches(".film__play, .expert__video")) { cur.classList.add("is-play"); cur.textContent = "PLAY"; } else if (t.matches("[data-drag]")) { cur.classList.add("is-drag"); cur.textContent = "DRAG"; } else cur.classList.add("is-link"); });
    $$("[data-magnetic]").forEach((b) => { b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--mx", (e.clientX - r.left - r.width / 2) * 0.25 + "px"); b.style.setProperty("--my", (e.clientY - r.top - r.height / 2) * 0.35 + "px"); }); b.addEventListener("pointerleave", () => { b.style.setProperty("--mx", "0rem"); b.style.setProperty("--my", "0rem"); }); });
    $$("[data-tilt]").forEach((w) => { const k = $(".kheelu", w); const rx = gsap.quickTo(k, "rotationY", { duration: 0.8, ease: "power3" }), ry = gsap.quickTo(k, "rotationX", { duration: 0.8, ease: "power3" });
      w.addEventListener("pointermove", (e) => { const r = w.getBoundingClientRect(); rx(((e.clientX - r.left) / r.width - 0.5) * 18); ry(-((e.clientY - r.top) / r.height - 0.5) * 10); }); w.addEventListener("pointerleave", () => { rx(0); ry(0); }); });
    addEventListener("pointermove", (e) => { root.style.setProperty("--gx", (e.clientX / innerWidth - 0.5) * 6 + "px"); root.style.setProperty("--gy", (e.clientY / innerHeight - 0.5) * 6 + "px"); });
    $$("[data-drag]").forEach((r) => { let down = false, sx = 0, sl = 0, moved = false; r.addEventListener("pointerdown", (e) => { down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; }); addEventListener("pointerup", () => (down = false)); r.addEventListener("pointermove", (e) => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) moved = true; r.scrollLeft = sl - d; }); r.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true); });
  }
  addEventListener("load", () => ScrollTrigger.refresh());
  let rw = innerWidth; addEventListener("resize", () => { if (Math.abs(innerWidth - rw) > 80) { rw = innerWidth; ScrollTrigger.refresh(); } });

  /* ---------- Video dialog (shared with the static fallback) ---------- */
  function initModal() {
    const modal = document.getElementById("modal"); const mv = modal.querySelector("video"); const dl = modal.querySelector("[data-dl]");
    const close = () => { mv.pause(); mv.removeAttribute("src"); mv.load(); modal.close(); };
    document.querySelectorAll("[data-video]").forEach((b) => b.addEventListener("click", () => { modal.classList.toggle("modal--wide", b.hasAttribute("data-wide")); mv.src = b.dataset.video; dl.href = b.dataset.video; modal.showModal(); mv.play().catch(() => {}); }));
    modal.querySelector("[data-close]").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.addEventListener("close", () => mv.pause());
  }
  function initStatic() {
    document.querySelectorAll(".scene").forEach((s, i) => { s.style.opacity = i === 0 ? 1 : 0; });
    document.getElementById("wa").classList.add("is-on");
  }
})();
