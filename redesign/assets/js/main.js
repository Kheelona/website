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

  /* ---------- Khelu's real voice: the firmware's recorded cue lines + the device's own earcon tones ---------- */
  const Sound = (() => {
    let ctx = null, out = null, an = null, data = null, cur = null, muted = false; const cache = {};
    const ready = () => !!ctx && !muted;
    const unlock = () => {
      if (ctx) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); an = ctx.createAnalyser(); an.fftSize = 256; data = new Uint8Array(an.frequencyBinCount); out = ctx.createGain(); out.gain.value = 0.8; out.connect(an); an.connect(ctx.destination);
      document.dispatchEvent(new CustomEvent("khelu:sound"));
    };
    const load = (n) => cache[n] || (cache[n] = fetch(`assets/audio/voice/${n}.m4a`).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((b) => ctx.decodeAudioData(b)));
    const stop = () => { try { cur && cur.stop(); } catch (e) {} cur = null; };
    const play = async (n) => { if (!ready()) return 0; try { const buf = await load(n); stop(); const src = ctx.createBufferSource(); src.buffer = buf; src.connect(out); src.start(); cur = src; src.onended = () => { if (cur === src) cur = null; }; return buf.duration; } catch (e) { return 0; } };
    const sfx = async (file, rate = 1) => { if (!ready()) return; try { const buf = await (cache[file] || (cache[file] = fetch(`assets/audio/${file}.m4a`).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)))); const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate; src.connect(out); src.start(); } catch (e) {} };
    // The toy's procedural earcons (firmware cue_tones): conversation start = a short A5 blip; end = E5 → C5.
    const tone = (freqs, len = 0.12) => { if (!ready()) return; let t = ctx.currentTime; freqs.forEach((f) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + len); o.connect(g); g.connect(out); o.start(t); o.stop(t + len + 0.02); t += len * 0.85; }); };
    const level = () => { if (!an || !cur) return 0; an.getByteTimeDomainData(data); let m = 0; for (let i = 0; i < data.length; i++) m = Math.max(m, Math.abs(data[i] - 128)); return m / 128; };
    const setMuted = (m) => { muted = m; if (m) stop(); };
    let vol = 0.8; const nudge = (d) => { vol = Math.max(0.45, Math.min(1, +(vol + d).toFixed(2))); if (out) out.gain.setTargetAtTime(vol, ctx.currentTime, 0.05); return vol; };
    const playing = () => !!cur;
    // Browsers only allow sound after a tap or key press, so the first one anywhere switches Khelu's voice on.
    const first = (e) => { if (e.target && e.target.closest && e.target.closest("[data-sound]")) return; ["pointerdown", "keydown"].forEach((ev) => removeEventListener(ev, first)); unlock(); };
    ["pointerdown", "keydown"].forEach((ev) => addEventListener(ev, first, { passive: true }));
    return { unlock, play, sfx, tone, level, stop, setMuted, nudge, playing, get on() { return ready(); }, get started() { return !!ctx; }, get muted() { return muted; } };
  })();

  /* ---------- Voice waves: the launch film's "vocal rays", out of the speaker in Khelu's tummy (hero only).
     Centred on the light ring from the layout box (not the tilted/breathing transform), slow, and they bend
     softly away from the pointer with eased-in strength, so nothing snaps. ---------- */
  const makeWaves = (canvas, khelu) => {
    const c2 = canvas.getContext("2d"); let W = 0, H = 0, dpr = 1, raf = 0, t = 0, pull = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0, in: false };
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); };
    const COLS = ["255,170,60", "90,169,238", "157,134,238", "95,191,166"];
    const frame = () => {
      t += 1 / 60;
      pull += ((m.in ? 1 : 0) - pull) * 0.04;            // strength eases in and out
      m.x += (m.tx - m.x) * 0.07; m.y += (m.ty - m.y) * 0.07; // the bend follows the pointer slowly
      c2.setTransform(dpr, 0, 0, dpr, 0, 0); c2.clearRect(0, 0, W, H);
      const kw = khelu.offsetWidth, kh = khelu.offsetHeight; if (!kw) { raf = requestAnimationFrame(frame); return; }
      const cx = khelu.offsetLeft + kw * 0.513, cy = khelu.offsetTop + kh * 0.618;   // the light ring's centre
      const inner = kw * 0.17, reach = Math.min(cx - 8, W - cx - 8, kw * 1.9), unit = Math.max(0.8, kw / 400);
      const sigma = 90 * unit;
      c2.lineCap = "round"; c2.lineJoin = "round";
      COLS.forEach((col, i) => {
        const a = (13 + i * 6) * unit, f = (0.014 + i * 0.004) / unit, sp = 0.9 + i * 0.22;
        [-1, 1].forEach((side) => {
          const g = c2.createLinearGradient(cx + side * inner, 0, cx + side * reach, 0);
          g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.18, `rgba(${col},0.85)`); g.addColorStop(0.7, `rgba(${col},0.5)`); g.addColorStop(1, `rgba(${col},0)`);
          c2.strokeStyle = g; c2.lineWidth = (2.4 - i * 0.3) * unit; c2.beginPath();
          for (let d = inner; d <= reach; d += 3) {
            const k = (d - inner) / (reach - inner), env = Math.sin(Math.PI * Math.min(1, k * 1.1));
            const x = cx + side * d; let y = cy + env * a * Math.sin(d * f - t * sp + i * 1.3) + (i - 1.5) * 2.5 * unit;
            if (pull > 0.001) { const dx = x - m.x, dy = y - m.y; const p = Math.exp(-(dx * dx) / (2 * sigma * sigma) - (dy * dy) / (2 * (sigma * 0.8) ** 2)) * pull; y += dy * p * 0.9 + Math.sin(dx * 0.025 - t * 1.6) * p * 5 * unit; }
            d === inner ? c2.moveTo(x, y) : c2.lineTo(x, y);
          }
          c2.stroke();
        });
      });
      raf = requestAnimationFrame(frame);
    };
    size(); addEventListener("resize", size);
    new IntersectionObserver((es) => es.forEach((e) => { cancelAnimationFrame(raf); if (e.isIntersecting) { size(); raf = requestAnimationFrame(frame); } })).observe(canvas);
    if (fine) {
      const zone = canvas.closest(".stage");
      zone.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); const sx = canvas.clientWidth / r.width || 1; m.tx = (e.clientX - r.left) * sx; m.ty = (e.clientY - r.top) * sx; if (!m.in) { m.x = m.tx; m.y = m.ty; } m.in = true; });
      zone.addEventListener("pointerleave", () => { m.in = false; });
    }
  };
  const heroWaves = $('[data-waves="hero"]'); if (heroWaves) makeWaves(heroWaves, $("#hero [data-kheelu]"));

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

  /* ---------- Living Khelu ---------- */
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

  /* ---------- 1 · Hero: headline → "Meet Khelu" → hundreds of questions ---------- */
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
      .to('[data-waves="hero"]', { opacity: 0, duration: 0.14 }, 0.1)
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
    const ripples = $$(".kheelu__ripple", k); const steps = $$("[data-steps] li"); const demo = $("[data-demo]"); const say = $("[data-demo-say]");
    const listen = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((r, i) => listen.fromTo(r, { scale: 0.6, opacity: 0.85 }, { scale: 1.9, opacity: 0, duration: 1.6, ease: "power1.out" }, i * 0.5));
    const zoom = () => { const s = phone() ? 2.2 : 2.6; const H = k.offsetHeight; const cy = k.offsetTop + H / 2; const target = phone() ? stage.offsetHeight * 0.36 : stage.offsetHeight * 0.5; const cx = k.offsetLeft + k.offsetWidth / 2; const tx = phone() ? 0 : Math.min(stage.offsetWidth * 0.16, 260 * R()); return { s, y: target - cy - 0.118 * H * s, x: tx + (stage.offsetWidth / 2 - cx) }; };
    let live = false, greet = () => {};
    const setLive = (on) => { if (on === live) return; live = on; if (on) greet(); demo.classList.toggle("is-live", on); stage.classList.toggle("demo-on", on); $$(".ctrl", k).forEach((c) => (c.tabIndex = on ? 0 : -1)); };
    end(gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true, onUpdate: (st) => {
      const p = st.progress; steps.forEach((s, j) => s.classList.toggle("is-on", p > [0.33, 0.41, 0.49][j]));
      p > 0.49 && p < 0.9 ? listen.play() : listen.pause(); setLive(p > 0.56 && p < 0.86);
    } } })
      .fromTo("[data-nochips] span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.07 }, 0.02)
      .to("[data-nochips] span", { opacity: 0, y: -16, stagger: 0.02, duration: 0.05 }, 0.15)
      .to("[data-try-copy]", { opacity: 0, y: -30, duration: 0.05 }, 0.18)
      .to(k, { scale: () => zoom().s, y: () => zoom().y, x: () => zoom().x, ease: "power2.inOut", duration: 0.12 }, 0.2)
      .to("[data-steps]", { opacity: 1, duration: 0.04 }, 0.3)
      .to("[data-steps]", { opacity: 0, duration: 0.04 }, 0.55)
      .fromTo(demo, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.05 }, 0.56)
      .to(demo, { opacity: 0, y: -16, duration: 0.06, ease: "power1.in" }, 0.84)
      .to(k, { scale: 1, y: 0, x: 0, ease: "sine.inOut", duration: 0.15 }, 0.85));

    // Each button does what it does on the real Khelu, in Khelu's own voice (assets/audio/voice, tools/voice-lines.json).
    const LINES = {
      hello: "Hello, my friend! I’m so happy to talk with you. What would you like to learn today?",
      "power-on": "Power on!", bye: "Bye bye!",
      "story-1": "Once upon a time, a little rabbit named Khelu found a shiny pebble by the river…",
      "story-2": "A tiny cloud wanted to be a rainbow. So it waited for the sun, and, splash! It painted the whole sky.",
      "story-3": "A sleepy moon forgot to go home. The stars giggled, and tucked it in behind the hills.",
      "story-4": "A little seed was scared of the dark soil. Then the rain whispered, “Grow!”, and up it popped, saying hello to the sun.",
    };
    const SHORT = ["story-2", "story-3", "story-4"];
    let on = true, talking = false, telling = false, idx = -1, greeted = false;
    const say1 = (text) => { say.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>'; gsap.delayedCall(0.3, () => { say.textContent = text; }); };
    const voice = (id) => { say1(LINES[id]); Sound.play(id); };
    const burst = () => { gsap.fromTo(ripples, { scale: 0.6, opacity: 0.9 }, { scale: 2, opacity: 0, duration: 1.1, stagger: 0.18, ease: "power1.out" }); gsap.fromTo(body, { scale: 1 }, { scale: 1.015, yoyo: true, repeat: 1, duration: 0.15 }); };
    // Whatever is pressed, on Khelu or in the list, lights up in both places.
    const mark = (c) => {
      $$(".demo__list button").forEach((b) => b.classList.toggle("is-on", b.dataset.ctrl === c));
      $$(".ctrl", k).forEach((b) => { b.classList.toggle("is-on", b.dataset.ctrl === c); if (b.dataset.ctrl === c) { b.classList.remove("is-press"); void b.offsetWidth; b.classList.add("is-press"); } });
    };
    const act = (c) => {
      Sound.unlock(); syncSound(); mark(c);
      if (c === "power") {
        on = !on; talking = telling = false; Sound.stop();
        gsap.to($(".kheelu__img", k), { filter: on ? "brightness(1)" : "brightness(0.8)", duration: 0.4 });
        if (on) { burst(); return voice("power-on"); } return voice("bye");
      }
      if (!on) { Sound.tone([392], 0.16); return say1("I’m switched off. Press Power to wake me."); }
      burst();
      if (c === "wake") {
        talking = !talking; telling = false; Sound.stop();
        if (talking) { Sound.tone([880]); gsap.delayedCall(0.2, () => Sound.play("hello")); return say1(LINES.hello); }
        Sound.tone([659, 523]); return say1("Okay! Press me again when you want to talk.");
      }
      if (c === "play") {
        talking = false; Sound.stop();
        if (telling) { telling = false; return say1("Story paused. Press the story button to hear it again."); }
        telling = true; return voice("story-1");
      }
      if (c === "next" || c === "prev") { talking = false; telling = true; idx = (idx + (c === "next" ? 1 : SHORT.length - 1)) % SHORT.length; Sound.stop(); return voice(SHORT[idx]); }
      if (c === "up" || c === "down") { const v = Sound.nudge(c === "up" ? 0.1 : -0.1); Sound.sfx("tick", 1); return say1(`${c === "up" ? "A little louder" : "A little quieter"}. Volume ${Math.round(v * 100)}%.`); }
    };
    // When the buttons come alive (with sound on), Khelu says hello in its own voice.
    greet = () => { if (greeted || !on || !Sound.on) return; greeted = true; burst(); voice("hello"); };
    const soundBtn = $("[data-sound]"), soundLabel = $("[data-sound-label]");
    const syncSound = () => { if (!soundBtn) return; soundBtn.setAttribute("aria-pressed", String(Sound.on)); soundLabel.textContent = Sound.on ? "Sound on" : "Tap for sound"; };
    soundBtn && soundBtn.addEventListener("click", () => { if (!Sound.started) { Sound.setMuted(false); Sound.unlock(); } else Sound.setMuted(!Sound.muted); syncSound(); if (Sound.on && live) greet(); });
    document.addEventListener("khelu:sound", () => { syncSound(); if (live) greet(); });
    $$("[data-ctrl]", track).forEach((b) => b.addEventListener("click", () => act(b.dataset.ctrl)));
  })();

  /* ---------- 3 · Why is the sky blue: Khelu sits in the sky and talks it through, step by step; then your child answers ---------- */
  (() => {
    const track = $("#asks"); const stage = $(".stage", track); const sky = $("[data-sky]", track); const k = $(".kheelu", sky); const ripples = $$(".kheelu__ripple", k);
    const say = $("[data-say]", track), sayText = $("[data-say-text]", track), sayLabel = $("[data-say-label]", track);
    const child = $("[data-child]", track), childText = $("[data-child-text]", track), childLabel = $("[data-child-label]", track);
    const steps = $$("[data-talk-steps] li", track), done = $("[data-talk-done]", track);
    const beam = $("[data-beam]", sky), bands = $$("[data-bands] path", sky), zig = $("[data-zig]", sky), clouds = $$("[data-clouds] path", sky), air = $("[data-air]", sky);
    const sun = $("[data-sun]", sky), sunCore = $("[data-sun-core]", sky), sunset = $("[data-sunset]", sky);
    // Step 0: your child asks. 1–3: Khelu explains. 4: Khelu asks back, and your child answers with a tap.
    const LINES = [
      null,
      { label: "Khelu", text: "Sunlight looks white, but it’s every colour mixed together.", bub: "--p-butter" },
      { label: "Khelu", text: "When it hits the air, the blue light bounces around the most.", bub: "--p-sky" },
      { label: "Khelu", text: "So everywhere you look, you see blue!", bub: "--p-mint" },
      { label: "Khelu asks back", text: "What colour do you think the sky turns at sunset?", bub: "--p-lilac" },
    ];
    const AT = [0.04, 0.15, 0.36, 0.56, 0.74];
    // Tiny air particles for the blue light to bounce off; they drift away from the pointer.
    const dots = [];
    for (let i = 0; i < 26; i++) { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); const x = 290 + ((i * 53) % 330), y = 60 + ((i * 97) % 250); c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 4 + (i % 4) * 1.6); c.setAttribute("fill", "#ffffff"); c.setAttribute("stroke", "#bcd6ee"); c.setAttribute("stroke-width", "1.5"); air.appendChild(c); dots.push({ c, x, y, qx: gsap.quickTo(c, "x", { duration: 0.6, ease: "power3" }), qy: gsap.quickTo(c, "y", { duration: 0.6, ease: "power3" }) }); }
    [beam, ...bands, zig].forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    gsap.set(dots.map((d) => d.c), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }); gsap.set(clouds, { opacity: 0, x: 90 });

    // The scene itself is scrubbed by the scroll.
    end(gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(sky, { scale: 0.94, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 0.06, ease: "power2.out" }, 0)
      .to(beam, { strokeDashoffset: 0, duration: 0.05, ease: "none" }, 0.15)
      .to(bands, { strokeDashoffset: 0, duration: 0.12, stagger: 0.012, ease: "power1.out" }, 0.19)
      .to(dots.map((d) => d.c), { opacity: 1, scale: 1, duration: 0.05, stagger: 0.002, ease: "back.out(2)" }, 0.36)
      .to(bands.filter((b) => !b.hasAttribute("data-blue")), { opacity: 0.12, duration: 0.06 }, 0.38)
      .to(zig, { strokeDashoffset: 0, duration: 0.12, ease: "none" }, 0.4)
      .to(dots.map((d) => d.c), { attr: { fill: "#cfe6fb", stroke: "#7fbcef" }, duration: 0.08, stagger: 0.002 }, 0.42)
      .to("[data-bluesky]", { opacity: 1, duration: 0.1 }, 0.56)
      .to([zig, beam, ...bands], { opacity: 0, duration: 0.08 }, 0.58)
      .to(dots.map((d) => d.c), { opacity: 0.35, duration: 0.08 }, 0.6)
      .to(clouds, { opacity: 0.95, x: 0, duration: 0.12, stagger: 0.03, ease: "power2.out" }, 0.58));

    // Khelu's lines pop out of Khelu (not scrubbed: each line arrives with a bounce and sound ripples from the tummy).
    let step = -2, answered = false;
    const speak = () => { gsap.fromTo(ripples, { scale: 0.6, opacity: 0.9 }, { scale: 2, opacity: 0, duration: 1.1, stagger: 0.18, ease: "power1.out" }); gsap.fromTo(k, { y: 0 }, { y: -10, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }); };
    const line = (label, text, bub) => {
      sayLabel.textContent = label; say.style.setProperty("--bub", `var(${bub})`);
      if (text) sayText.textContent = text; else sayText.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
      gsap.fromTo(say, { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)", overwrite: true });
      if (text) speak();
    };
    const toSunset = (on) => { gsap.to(sunset, { opacity: on ? 1 : 0, duration: on ? 1.8 : 0.6, ease: "sine.inOut" }); gsap.to(sun, { y: on ? 250 : 0, x: on ? (phone() ? 90 : 200) : 0, duration: on ? 2.2 : 0.6, ease: "sine.inOut" }); gsap.to(sunCore, { attr: { fill: on ? "#ff8a4c" : "#ffc861" }, duration: 1.6 }); gsap.to(clouds, { fill: on ? "#ffd9d0" : "#ffffff", duration: 1.6 }); };
    const ask = () => { answered = false; child.classList.remove("is-answered"); child.classList.add("is-asking"); childLabel.textContent = "Your turn"; childText.textContent = "Tap an answer for your child:"; done.classList.remove("is-on"); toSunset(false); };
    const answer = (c) => {
      answered = true; child.classList.remove("is-asking"); child.classList.add("is-answered"); childLabel.textContent = "Your child"; childText.textContent = `${c}!`;
      gsap.fromTo(child, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
      toSunset(true); done.classList.add("is-on");
      if (c === "Orange") return gsap.delayedCall(0.5, () => line("Khelu", "Yes! At sunset, light travels through lots more air. The blue bounces away, so the oranges and reds reach your eyes.", "--p-peach"));
      gsap.delayedCall(0.5, () => line("Khelu", `${c}? Ooh, good guess! Let’s watch the sun go down and see…`, "--p-pink"));
      gsap.delayedCall(3.2, () => { if (answered && step === 4) line("Khelu", "Look, it turns orange! At sunset, the blue bounces away, so the oranges and reds reach your eyes.", "--p-peach"); });
    };
    const go = (n) => {
      if (n === step) return; const prev = step; step = n;
      steps.forEach((li, i) => { li.classList.toggle("is-on", i + 1 === n); li.classList.toggle("is-done", i + 1 < n); });
      if (n < 0) { gsap.to([child, say], { opacity: 0, y: 10, duration: 0.3, overwrite: true }); return; }
      if (prev < 0) gsap.fromTo(child, { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)", overwrite: true });
      if (n < 4) { answered = false; child.classList.remove("is-asking", "is-answered"); childLabel.textContent = "Your child"; childText.textContent = "Why is the sky blue?"; done.classList.remove("is-on"); if (prev === 4) toSunset(false); }
      if (n === 0) return line("Khelu", "", "--p-sky"); // thinking…
      const L = LINES[n]; line(L.label, L.text, L.bub);
      if (n === 4) ask();
    };
    ScrollTrigger.create({ trigger: track, start: "top top", end: "bottom bottom", onUpdate: (st) => { let n = -1; AT.forEach((t, i) => { if (st.progress >= t) n = i; }); go(n); }, onLeaveBack: () => go(-1) });
    $$("[data-answer]", child).forEach((b) => b.addEventListener("click", () => answer(b.dataset.answer)));
    $("[data-again]", child).addEventListener("click", () => { ask(); line(LINES[4].label, LINES[4].text, LINES[4].bub); });
    // The step list jumps to that point of the conversation.
    $$("[data-goto]", track).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.goto; scrollToY(track.offsetTop + (track.offsetHeight - stage.offsetHeight) * (AT[i] + 0.03)); }));
    if (fine) sky.addEventListener("pointermove", (e) => {
      const r = sky.getBoundingClientRect(); const s = Math.max(640 / r.width, 480 / r.height); // viewBox units per pixel (slice)
      const px = (e.clientX - r.left) * s, py = 480 - (r.bottom - e.clientY) * s; // xMinYMax slice
      dots.forEach((d) => { const dx = d.x - px, dy = d.y - py, dist = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - dist / 120) * 34; d.qx((dx / dist) * f); d.qy((dy / dist) * f); });
    });
    sky.addEventListener("pointerleave", () => dots.forEach((d) => { d.qx(0); d.qy(0); }));
  })();

  /* ---------- 4 · A day at home: rooms change around Khelu as it speaks ---------- */
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

  /* ---------- 5 · Languages: greetings orbit Khelu; the sentence switches language ---------- */
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
    focus(); addEventListener("resize", () => requestAnimationFrame(focus)); ScrollTrigger.addEventListener("refresh", focus);
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
    document.addEventListener("pointerover", (e) => { const t = e.target.closest("a, button, summary, .chip, .mode, [data-drag]"); cur.className = "cursor is-live"; cur.textContent = ""; if (!t) return;
      if (t.matches("[data-drag]")) { cur.classList.add("is-drag"); cur.textContent = "DRAG"; } else cur.classList.add("is-link"); });
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
    const modal = document.getElementById("modal"); const mv = modal.querySelector("video"); 
    const close = () => { mv.pause(); mv.removeAttribute("src"); mv.load(); modal.close(); };
    document.querySelectorAll("[data-video]").forEach((b) => b.addEventListener("click", () => { modal.classList.toggle("modal--wide", b.hasAttribute("data-wide")); mv.src = b.dataset.video; modal.showModal(); mv.play().catch(() => {}); }));
    modal.querySelector("[data-close]").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.addEventListener("close", () => mv.pause());
  }
  function initStatic() {
    document.querySelectorAll(".scene").forEach((s, i) => { s.style.opacity = i === 0 ? 1 : 0; });
    document.getElementById("wa").classList.add("is-on");
  }
})();
