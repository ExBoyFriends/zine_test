// transitionOut.js

export function playExitTransition({
  duration = 4200,   // 全体を少し長めに
  onComplete
} = {}) {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "#000";
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);

  const startTime = performance.now();

  // 前半ほぼ停止 → 後半ゆっくり沈む
  function easeHeavyFade(t) {
    if (t < 0.6) {
      // 60%まではほぼ変化しない
      return t * 0.08;
    }

    // 後半：重力がかかるように沈む
    const x = (t - 0.6) / 0.4; // 0〜1
    return 0.08 + (1 - Math.pow(1 - x, 1.6)) * 0.92;
  }

  function tick(now) {
    const raw = Math.min((now - startTime) / duration, 1);
    const eased = easeHeavyFade(raw);

    overlay.style.opacity = eased.toFixed(3);

    if (raw < 1) {
      requestAnimationFrame(tick);
    } else {
      // 完全に暗くなってから遷移
      setTimeout(() => {
        onComplete?.();
      }, 200);
    }
  }

  requestAnimationFrame(tick);
}
