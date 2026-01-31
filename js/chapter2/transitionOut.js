let startTime = null;
let rafId = null;

// ===== 時間設計 =====
const TOTAL        = 18000;
const ACCEL_START  = 500;
const ACCEL_FULL   = 8000;
const FADE_START   = 6000;
const FADE_FULL    = 14000;

export function playExitTransition({ onFinish }) {
  const carousel = window.__carousel__;
  const overlay  = document.getElementById("fadeout");

  if (!carousel || !overlay) {
    onFinish?.();
    return;
  }

  startTime = performance.now();

  function tick(now) {
    const t = now - startTime;

    // 回転加速
    if (t >= ACCEL_START) {
      const p = Math.min(
        (t - ACCEL_START) / (ACCEL_FULL - ACCEL_START),
        1
      );
      const eased = p ** 1.6;
      carousel.setExtraSpeed(0.3 + eased * 7.0);
    }

    // フェード
    if (t >= FADE_START) {
      const p = Math.min(
        (t - FADE_START) / (FADE_FULL - FADE_START),
        1
      );
      const eased =
        p < 0.6 ? p * 0.2 : 0.12 + (p - 0.6) * 2.2;

      overlay.style.opacity = Math.min(eased, 1);
    }

    // 終了
    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      overlay.style.opacity = 1;
      onFinish?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}


