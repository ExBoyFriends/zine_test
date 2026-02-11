//chapter2/transitionOut.js

let startTime = null;
let rafId = null;

// carousel3d.js の演出に合わせる
const TOTAL       = 3000; // 暗転開始からページ移動までの総時間（短くして勢いを出す）
const FADE_START  = 0;    // goChapter25 が呼ばれた瞬間からフェード開始
const FADE_FULL   = 2500; // 2.5秒で真っ暗に

export function playExitTransition({ onFinish }) {
  const overlay = document.getElementById("fadeout");
  if (!overlay) {
    onFinish?.();
    return;
  }

  cancelAnimationFrame(rafId);
  startTime = performance.now();

  overlay.classList.remove("active");
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "auto"; // 操作不能にする

  function tick(now) {
    const t = now - startTime;

    // 不透明度を上げていく（carousel3d は裏で爆走中）
    const p = Math.min(t / FADE_FULL, 1);
    const eased = p * p; // 徐々に暗く
    overlay.style.opacity = eased;

    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      overlay.classList.add("active");
      onFinish?.(); // location.href 実行
      return;
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}
