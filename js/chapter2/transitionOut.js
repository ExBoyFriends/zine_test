let startTime = null;
let rafId = null;
let onFinish = null;

// 時間設計
const TOTAL      = 42000;
const ACCEL_START = 3000;
const FADE_START  = 9000;
const FADE_END    = 38000;

export function playExitTransition({ onFinish: callback }) {
  const carousel = window.__carousel__;
  const overlay = document.getElementById("fadeout");

  if (!carousel || !overlay) {
    callback?.();
    return;
  }

  startTime = performance.now();
  onFinish = callback;

  function tick(now) {
    const t = now - startTime;

    /* ===== 加速 ===== */
    if (t >= ACCEL_START) {
      const p = Math.min((t - ACCEL_START) / (FADE_END - ACCEL_START), 1);
      const accel = p ** 0.7; // ← 体感早め
      carousel.setExtraSpeed(1.5 + accel * 6.0);
    }

    /* ===== フェード ===== */
    if (t >= FADE_START) {
      const p = Math.min((t - FADE_START) / (FADE_END - FADE_START), 1);
      const eased =
        p < 0.5
          ? p * 0.6
          : 0.3 + (p - 0.5) * 1.4;

      overlay.style.opacity = Math.min(eased, 1);
    }

    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      onFinish?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}

