/* Live previews: ?theme=dark switches to the Bedtime theme; inside a page, report the height to it. */
(function () {
  var m = /[?&]theme=(dark|light)/.exec(location.search);
  if (m) document.documentElement.setAttribute('data-theme', m[1]);
  if (window.parent === window) return;
  function send() {
    try { parent.postMessage({ khHeight: Math.ceil(document.documentElement.scrollHeight) }, '*'); } catch (e) {}
  }
  window.addEventListener('load', function () { send(); setTimeout(send, 400); setTimeout(send, 1500); });
  if (window.ResizeObserver) new ResizeObserver(send).observe(document.documentElement);
})();
