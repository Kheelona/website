/* Kheelona.com homepage mockup (Gate A): the few lines of JavaScript that show the behaviour.
   No library. Everything still reads and works without it. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  //    A page without a hero CTA (product page, articles) shows the bar from first paint (strategy §3.4).
  if (bar && 'IntersectionObserver' in window) {
    var visible = new Set(), heroSeen = !!heroCta;
    var update = function () { bar.classList.toggle('is-hidden', heroSeen || visible.size > 0); };
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.target === heroCta) heroSeen = e.isIntersecting;
        else if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      update();
    });
    if (heroCta) watch.observe(heroCta);
    document.querySelectorAll('main .kh-btn--cta').forEach(function (el) { if (el !== heroCta) watch.observe(el); });
    update();
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
    // One step is a tile plus the gap; on a laptop three show at once, so the position reads "1–3 of 7".
    var pitch = function () { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : items[0].offsetWidth; };
    var state = function () {
      var p = pitch();
      var max = strip.scrollWidth - strip.clientWidth - 2;
      var shown = Math.max(1, Math.round((strip.clientWidth + p - items[0].offsetWidth) / p));
      var i = strip.scrollLeft >= max ? items.length - shown : Math.round(strip.scrollLeft / p);
      prev.disabled = strip.scrollLeft <= 2;
      next.disabled = strip.scrollLeft >= max;
      if (pos) pos.textContent = (shown > 1 ? (i + 1) + '–' + (i + shown) : (i + 1)) + ' of ' + items.length;
    };
    var step = function (d) { strip.scrollBy({ left: d * pitch(), behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    strip.addEventListener('scroll', state, { passive: true });
    state();
  });

  // 5. Films: a tap swaps the poster for the film with native controls and plays it with sound.
  //    One film at a time; it pauses when scrolled out of view and the poster comes back when it ends.
  var playing = null;
  var stopFilm = function () {
    if (!playing) return;
    var p = playing; playing = null;
    p.video.pause(); p.video.remove(); p.btn.hidden = false;
  };
  var away = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.intersectionRatio < 0.5) e.target.pause(); });
  }, { threshold: 0.5 }) : null;
  document.querySelectorAll('.mk-film__play').forEach(function (btn) {
    btn.addEventListener('click', function () {
      stopFilm();
      var frame = btn.parentElement;
      var v = document.createElement('video');
      v.src = btn.getAttribute('data-film');
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.poster = frame.querySelector('img').currentSrc;
      v.setAttribute('aria-label', btn.getAttribute('aria-label').replace(/^Play: /, ''));
      frame.appendChild(v);
      btn.hidden = true;
      playing = { video: v, btn: btn };
      if (away) away.observe(v);
      v.addEventListener('ended', function () {
        if (playing && playing.video === v) { stopFilm(); btn.focus(); }
      });
      var started = v.play();
      if (started && started.catch) started.catch(function () {});
      v.focus();
    });
  });

  // 6. Gate A review tool (mockup only): try each headline option in the hero. #h1-3 opens option 3.
  var data = document.getElementById('mk-h1-options'), sheet = document.getElementById('mk-h1');
  var opts = [];
  try { opts = JSON.parse(data ? data.textContent : '[]'); } catch (e) {}
  var pill = document.querySelector('[data-open-h1]');
  if (!opts.length || !sheet || !sheet.showModal) { if (pill) pill.hidden = true; return; }
  var h1 = document.getElementById('hero-title');
  var lead = h1.parentElement.querySelector('.kh-heading__lead');
  var list = sheet.querySelector('[data-h1-list]');
  var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
  var apply = function (i) {
    var o = opts[i], t = esc(o.h1), hand = esc(o.hand || ''), at = hand ? t.lastIndexOf(hand) : -1;
    h1.innerHTML = at < 0 ? t : t.slice(0, at) + '<span class="kh-hand">' + hand + '</span>' + t.slice(at + hand.length);
    if (lead) lead.textContent = o.subline;
    pill.querySelector('[data-h1-n]').textContent = (i + 1) + '/' + opts.length;
    try { localStorage.setItem('mk-h1', String(i)); } catch (e) {}
  };
  opts.forEach(function (o, i) {
    var row = document.createElement('div');
    row.className = 'kh-radio';
    row.innerHTML = '<input class="kh-radio__input" type="radio" name="mk-h1" id="mk-h1-' + i + '" value="' + i + '">' +
      '<label class="kh-radio__label" for="mk-h1-' + i + '"><span class="kh-radio__dot"></span><span class="kh-check__text">' +
      '<strong>' + (i + 1) + '. ' + esc(o.h1) + '</strong><span class="kh-check__hint">' + esc(o.subline) + '</span>' +
      '<span class="kh-check__hint"><em>' + (o.recommended ? 'Our pick. ' : '') + esc(o.why) + '</em></span></span></label>';
    list.appendChild(row);
  });
  var start = -1, m = /^#h1-(\d)$/.exec(location.hash);
  if (m) start = +m[1] - 1;
  if (start < 0 || start >= opts.length) { try { start = parseInt(localStorage.getItem('mk-h1'), 10); } catch (e) { start = NaN; } }
  if (!(start >= 0 && start < opts.length)) start = Math.max(0, opts.findIndex(function (o) { return o.recommended; }));
  list.querySelector('#mk-h1-' + start).checked = true;
  apply(start);
  list.addEventListener('change', function (e) { apply(+e.target.value); });
  pill.addEventListener('click', function () { sheet.showModal(); });
  sheet.querySelector('[data-close-h1]').addEventListener('click', function () { sheet.close(); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
})();
