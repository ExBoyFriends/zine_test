let startTime = null;
let rafId = null;
let onFinish = null;

// ===== 時間設計（体感重視）=====
const TOTAL        = 18000; // 全体
const ACCEL_START  = 500;   // すぐ違和感
const ACCEL_FULL   = 8000;  // 最大加速到達
const FADE_START   = 6000;  // フェード開始
const FADE_FULL    = 14000; // 完全ブラック

export function playExitTransition({ onFinish: callback }) {
  const carousel = window.__carousel__;
  const overlay  = document.getElementById("fadeout");

  if (!carousel || !overlay) {
    callback?.();
    return;
  }

  startTime = performance.now();
  onFinish = callback;

  function tick(now) {
    const t = now - startTime;

    /* =====================
       回転加速（連続・同方向）
    ===================== */

    if (t >= ACCEL_START) {
      const p = Math.min(
        (t - ACCEL_START) / (ACCEL_FULL - ACCEL_START),
        1
      );

      // イーズ：最初ゆっくり → 後半暴走
      const eased = p ** 1.6;

      // 🔥 BASE(-0.2) に「足す」だけ
      const speed = 0.3 + eased * 7.0;
      carousel.setExtraSpeed(speed);
    }

    /* =====================
       フェード（後半一気）
    ===================== */

    if (t >= FADE_START) {
      const p = Math.min(
        (t - FADE_START) / (FADE_FULL - FADE_START),
        1
      );

      // 前半ほぼ変化なし → 後半ドン
      const eased =
        p < 0.6
          ? p * 0.2
          : 0.12 + (p - 0.6) * 2.2;

      overlay.style.opacity = Math.min(eased, 1);
    }

    /* =====================
       終了
    ===================== */

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

