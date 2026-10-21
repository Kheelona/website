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

  /* ---------- Why: the red lines strike through screen, camera and browsing ---------- */
  ScrollTrigger.create({ trigger: ".th-nos", start: "top 85%", once: true, onEnter: () => $(".th-nos").classList.add("is-in") });

  /* ---------- Founder cards rise with a little turn ---------- */
  gsap.from(".fcard__photo img", { scale: 1.2, duration: 1.4, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".th-cards", start: "top 85%", once: true } });
})();
