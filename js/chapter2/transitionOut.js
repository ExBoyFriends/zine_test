// transitionOut.js

let startTime = null;
let rafId = null;
let onComplete = null;

// 時間設計（ms）
const TOTAL       = 42000; // ← 全体を長く
const NORMAL_END  = 6000;  // ← かなり早く加速開始
const FADE_START  = 12000; // ← 少し遅れてフェード開始
const FADE_END    = 38000; // ← 遷移直前まで暗転を引っ張る


export function playExitTransition({ onFinish }) {
  const carousel = window.__carousel__;
  const overlay = document.getElementById("fadeout");

  if (!carousel || !overlay) {
    console.warn("transitionOut: missing carousel or overlay");
    onFinish?.();
    return;
  }

  startTime = performance.now();
  onComplete = onFinish;

  function tick(now) {
    const t = now - startTime;

    /* ===== フェード ===== */
    if (t >= FADE_START) {
      const p = Math.min((t - FADE_START) / (FADE_END - FADE_START), 1);
      overlay.style.opacity = p ** 1.6;
    }

    /* ===== 回転加速 ===== */
    if (t >= NORMAL_END) {
      const p = Math.min((t - NORMAL_END) / (FADE_END - NORMAL_END), 1);
      carousel.setExtraSpeed(p ** 2.2 * 1.2);
    }

    /* ===== 完了 ===== */
    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      onComplete?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}
