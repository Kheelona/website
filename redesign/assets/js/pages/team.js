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

  if (reduced) return;


  /* ---------- Why: the red lines strike through screen, camera and browsing ---------- */
  ScrollTrigger.create({ trigger: ".th-nos", start: "top 85%", once: true, onEnter: () => $(".th-nos").classList.add("is-in") });

  /* ---------- Founder cards rise with a little turn ---------- */
  gsap.from(".fcard__photo img", { scale: 1.2, duration: 1.4, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: ".th-cards", start: "top 85%", once: true } });
})();
