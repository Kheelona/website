/* /safety — small extras on top of main.js and pages.js: the evening photo drifts as you scroll, the "never" slashes
 * draw in once the bento is in view, and the privacy screen rings its "Save voice recordings" row.
 * Transform/opacity/stroke only; with reduced motion nothing here runs and everything shows in its final state. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap;
  if (reduced) return;

  const img = document.querySelector("[data-sf-parallax]");
  if (img && window.ScrollTrigger) {
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
  }

  const once = (els, cls = "is-in") => {
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add(cls)); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } }), { rootMargin: "0px 0px -20% 0px" });
    els.forEach((e) => io.observe(e));
  };
  once([...document.querySelectorAll(".sf-bento, .sf-privacy")]);
})();
