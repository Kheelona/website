/* Kheelona.com homepage mockup (Gate A): the few lines of JavaScript that show the behaviour.
   No library. Everything still reads and works without it. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 0. Gate A preview switch for decision G2 (?contrast=ink).
  if (/[?&]contrast=ink\b/.test(location.search) || location.hash === '#ink') document.documentElement.classList.add('mk-ink');

  // 1. Section reveals (below the fold only).
  if (!reduce && 'IntersectionObserver' in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      // Anything already in view when the page loads is shown as it is, never faded in (CMO M12).
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      else reveal.observe(el);
    });
    document.documentElement.classList.add('js-motion');
  }

  // 2. Sticky buy bar: hidden until the hero CTA has left the screen, and stepping aside while any
  //    inline chilli CTA is on screen (the offer card's own button included), so a phone view never
  //    shows two at once and never shows none while the price is being read (CMO M2; DS gap G-09).
  var bar = document.querySelector('.kh-buybar');
  var heroCta = document.getElementById('hero-cta');
  if (bar && heroCta && 'IntersectionObserver' in window) {
    var visible = new Set(), heroSeen = true;
    var update = function () { bar.classList.toggle('is-hidden', heroSeen || visible.size > 0); };
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === heroCta) heroSeen = e.isIntersecting;
        else if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      update();
    });
    watch.observe(heroCta);
    document.querySelectorAll('main .kh-btn--cta').forEach(function (el) { if (el !== heroCta) watch.observe(el); });
  }

  // 3. Menu drawer: native <dialog>.
  var menu = document.getElementById('menu');
  document.querySelectorAll('[data-open-menu]').forEach(function (b) {
    b.addEventListener('click', function () { menu.showModal(); b.setAttribute('aria-expanded', 'true'); });
  });
  if (menu) {
    menu.addEventListener('close', function () {
      document.querySelectorAll('[data-open-menu]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    });
    menu.addEventListener('click', function (e) { if (e.target === menu) menu.close(); });
    menu.querySelectorAll('[data-close-menu], a').forEach(function (el) {
      el.addEventListener('click', function () { menu.close(); });
    });
  }

  // 4. Films strip: previous and next show where you are and stop at the ends.
  document.querySelectorAll('[data-films]').forEach(function (strip) {
    var wrap = strip.parentElement;
    var prev = wrap.querySelector('[data-films-prev]'), next = wrap.querySelector('[data-films-next]');
    var pos = wrap.querySelector('[data-films-pos]');
    var items = strip.children;
    var state = function () {
      var w = items[0].getBoundingClientRect().width;
      var i = Math.round(strip.scrollLeft / w);
      var max = strip.scrollWidth - strip.clientWidth - 2;
      prev.disabled = strip.scrollLeft <= 2;
      next.disabled = strip.scrollLeft >= max;
      if (pos) pos.textContent = (i + 1) + ' of ' + items.length;
    };
    var step = function (d) { strip.scrollBy({ left: d * items[0].getBoundingClientRect().width, behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    strip.addEventListener('scroll', state, { passive: true });
    state();
  });
})();
