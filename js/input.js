// Normalised horizontal steering: -1 (hard left) … 0 (straight) … +1 (hard right)
const Input = (() => {
  const DEAD_ZONE = 0.08;  // fraction of half-width treated as centre
  let _steer = 0;
  let _canvas = null;

  function _normalise(clientX, clientY) {
    const rect = _canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // Only steer when pointer is in the bottom half
    if (y < rect.height / 2) { _steer = 0; return; }
    const half = rect.width / 2;
    let raw = (x - half) / half;          // -1 … +1
    raw = Math.max(-1, Math.min(1, raw));
    if (Math.abs(raw) < DEAD_ZONE) raw = 0;
    _steer = raw;
  }

  function init(canvas) {
    _canvas = canvas;

    canvas.addEventListener("mousemove", e => _normalise(e.clientX, e.clientY));
    canvas.addEventListener("mouseleave", () => { _steer = 0; });

    canvas.addEventListener("touchstart",  _onTouch, { passive: true });
    canvas.addEventListener("touchmove",   _onTouch, { passive: true });
    canvas.addEventListener("touchend",    () => { _steer = 0; }, { passive: true });
    canvas.addEventListener("touchcancel", () => { _steer = 0; }, { passive: true });
  }

  function _onTouch(e) {
    const t = e.touches[0];
    if (t) _normalise(t.clientX, t.clientY);
  }

  return { init, get steer() { return _steer; } };
})();
