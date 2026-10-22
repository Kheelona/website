/* Team page, fold 1: the three founders at one round table, in real-time 3D. This is the boot: it stays tiny so the
 * page paints at once with a still of the scene (the poster, .t3__poster). Three.js and the scene (team3d-scene.js)
 * are fetched once the page has loaded and the browser is idle, and start when the section is near the screen and
 * either the visitor scrolls, taps, moves the pointer or presses a key, or a short idle wait has passed.
 * No WebGL, or prefers-reduced-motion → the scene folds away and the founder cards below show instead. */
const sec = document.querySelector("[data-t3]");
if (sec) boot();

function boot() {
  const off = () => { sec.classList.add("t3-off"); document.documentElement.classList.remove("t3-live"); };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !window.gsap || !window.ScrollTrigger || !("WebGLRenderingContext" in window)) { off(); return; }
  document.documentElement.classList.add("t3-live");
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  let near = false, asked = false, scene = null, started = false;
  const go = () => {
    if (started || !near || !asked) return;
    started = true;
    (scene || (scene = import("./team3d-scene.js"))).then((m) => m.start(sec)).catch((e) => { console.warn("team3d:", e); off(); });
  };
  const ask = () => { asked = true; EVENTS.forEach((ev) => removeEventListener(ev, ask, OPTS)); go(); };
  const EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "keydown", fine ? "pointermove" : "touchmove"], OPTS = { passive: true, capture: true };
  EVENTS.forEach((ev) => addEventListener(ev, ask, OPTS));
  new IntersectionObserver(([e]) => { near = e.isIntersecting; go(); }, { rootMargin: "50% 0px" }).observe(sec);

  // After load, when idle: fetch the scene (it downloads and compiles off the main thread), then start after a short
  // wait even without any input, so the table comes alive for a visitor who only looks.
  const idle = (fn, timeout) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200));
  const afterLoad = () => idle(() => {
    if (near && !scene) scene = import("./team3d-scene.js");
    setTimeout(() => idle(ask, 1500), fine ? 400 : 2500);
  }, 2000);
  if (document.readyState === "complete") afterLoad(); else addEventListener("load", afterLoad, { once: true });
}
