// transitionOut.js
let startTime = null;
let rafId = null;
let onFinish = null;

// 時間設計（ms）
const TOTAL = 30000;
const NORMAL_END = 10000;   // 通常回転
const FADE_START = 10000;   // フェード開始
const FADE_ACCEL = 23000;   // 加速が目立ち始める
const FADE_END = 30000;     // 完全暗転

export function startTransitionOut({ carousel, overlay, callback }) {
  startTime = performance.now();
  onFinish = callback;

  function tick(now) {
    const t = now - startTime;

    // =====================
    // フェード制御
    // =====================
    if (t >= FADE_START) {
      const fadeProgress = Math.min(
        (t - FADE_START) / (FADE_END - FADE_START),
        1
      );

      // 後半ほど変化が重くなるカーブ
      const eased = fadeProgress ** 1.6;
      overlay.style.opacity = eased;
    }

    // =====================
    // 回転加速制御
    // =====================
    if (t >= NORMAL_END) {
      const accelProgress = Math.min(
        (t - NORMAL_END) / (FADE_END - NORMAL_END),
        1
      );

      // ジワ→急 になりすぎない皮肉的カーブ
      const accel = accelProgress ** 2.2;
      carousel.setExtraSpeed(accel * 1.2);
    }

    // =====================
    // 完了
    // =====================
    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      onFinish?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}

