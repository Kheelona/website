/* Fits each live preview to its column and sizes it to its content. */
(function () {
  var frames = [].slice.call(document.querySelectorAll('.frame'));
  function fit(box) {
    var iframe = box.querySelector('iframe');
    var w = +box.getAttribute('data-w'), h = +box.getAttribute('data-h');
    var s = box.hasAttribute('data-fill') ? box.parentNode.clientWidth / w : Math.min(1, box.parentNode.clientWidth / w);
    iframe.style.width = w + 'px';
    iframe.style.height = h + 'px';
    iframe.style.transform = 'scale(' + s + ')';
    box.style.height = Math.ceil(h * s) + 'px';
  }
  window.addEventListener('message', function (e) {
    if (!e.data || !e.data.khHeight) return;
    frames.forEach(function (box) {
      var f = box.querySelector('iframe');
      if (f.contentWindow === e.source) { box.setAttribute('data-h', Math.max(80, e.data.khHeight)); fit(box); }
    });
  });
  window.addEventListener('resize', function () { frames.forEach(fit); });
  frames.forEach(fit);
  [].slice.call(document.querySelectorAll('[data-theme-switch]')).forEach(function (sw) {
    sw.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      [].slice.call(sw.querySelectorAll('button')).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      frames.forEach(function (box) {
        var f = box.querySelector('iframe');
        f.src = f.getAttribute('data-src') + (b.value === 'dark' ? '?theme=dark' : '');
      });
    });
  });
})();
