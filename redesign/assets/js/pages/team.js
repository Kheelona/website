/* Team page: the founders circle Khelu, their cards turn over, and a map shows who builds which part of Khelu. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Cards turn over (works without motion too) ---------- */
  $$("[data-fcard]").forEach((card) => {
    const front = $(".fcard__front", card), back = $(".fcard__back", card), open = $(".fcard__front .fcard__turn", card), close = $(".fcard__back .fcard__turn", card);
    back.inert = true;
    const turn = (on) => {
      card.classList.toggle("is-turned", on); open.setAttribute("aria-expanded", String(on));
      front.inert = on; back.inert = !on; (on ? close : open).focus({ preventScroll: true });
    };
    open.addEventListener("click", () => turn(true)); close.addEventListener("click", () => turn(false));
  });

  /* ---------- Who builds which part ---------- */
  const SAY = [
    ["Apoorva leads Kheelona and owns the promise we make to your family.", "var(--p-mint)"],
    ["Aman builds the part your child talks to: how Khelu listens and replies, and the child-safety rules its AI is given. He is also our grievance officer.", "var(--p-peach)"],
    ["Kashyap builds the toy itself: the hardware inside the plush, and how it is powered and charged.", "var(--p-sky)"],
  ];
  const tabs = $$(".th-tab"), dots = $$(".th-dot"), say = $("[data-map-say]"), mapK = $(".th-map__stage .kheelu");
  let part = 0, auto = null, touched = false;
  const pick = (i, user) => {
    if (user) { touched = true; clearInterval(auto); }
    if (i === part && !user) return; part = i;
    tabs.forEach((t, j) => { t.classList.toggle("is-on", j === i); t.setAttribute("aria-selected", String(j === i)); });
    dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
    say.style.setProperty("--say", SAY[i][1]);
    if (reduced) { say.textContent = SAY[i][0]; return; }
    gsap.timeline().to(say, { opacity: 0, y: -8, duration: 0.18 }).add(() => (say.textContent = SAY[i][0])).to(say, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
    gsap.fromTo(mapK, { y: 0 }, { y: -10, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
  };
  [...tabs, ...dots].forEach((b) => b.addEventListener("click", () => pick(+b.dataset.part, true)));
  // Arrow keys move between the tabs.
  tabs.forEach((t, j) => t.addEventListener("keydown", (e) => { const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (!d) return; e.preventDefault(); const n = (j + d + tabs.length) % tabs.length; tabs[n].focus(); pick(n, true); }));

  if (reduced) return;

  // Until someone taps, the map walks through the three founders while it's on screen.
  ScrollTrigger.create({ trigger: ".th-map", start: "top 60%", end: "bottom 30%", onToggle: (st) => { clearInterval(auto); if (st.isActive && !touched) auto = setInterval(() => pick((part + 1) % 3), 3600); } });

  /* ---------- Hero: the founders circle Khelu; the circle leans with the pointer ---------- */
  const orbit = $("[data-orbit]"), faces = $$("[data-face]", orbit);
  let a = 0, mx = 0, my = 0, on = true;
  const spin = () => {
    if (!on) return; a += 0.0035;
    const w = orbit.clientWidth, rx = w * 0.4, ry = w * 0.36;
    faces.forEach((f, i) => {
      const t = a + (i / faces.length) * Math.PI * 2, s = Math.sin(t);
      const depth = (s + 1) / 2; // 0 = behind Khelu, 1 = in front
      gsap.set(f, { x: Math.cos(t) * rx + mx * (0.5 + depth), y: s * ry * 0.55 + my * (0.5 + depth) - w * 0.04, scale: 0.78 + depth * 0.3, zIndex: depth > 0.45 ? 3 : 1, opacity: 0.75 + depth * 0.25 });
    });
  };
  gsap.from(faces, { scale: 0, opacity: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.8)", delay: 0.4 });
  gsap.ticker.add(spin);
  ScrollTrigger.create({ trigger: orbit, start: "top bottom", end: "bottom top", onToggle: (st) => (on = st.isActive) });
  if (fine) orbit.closest(".th-hero").addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth - 0.5) * 30; my = (e.clientY / innerHeight - 0.5) * 20; });

  /* ---------- Why: the red lines strike through screen, camera and browsing ---------- */
  ScrollTrigger.create({ trigger: ".th-nos", start: "top 85%", once: true, onEnter: () => $(".th-nos").classList.add("is-in") });

  /* ---------- Founder cards rise with a little turn ---------- */
  gsap.from(".fcard__photo img", { scale: 1.2, duration: 1.4, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".th-cards", start: "top 85%", once: true } });
})();
