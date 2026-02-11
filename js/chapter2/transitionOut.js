//chapter2/transitionOut.js

let startTime = null;
let rafId = null;

// carousel3d.js の AUTO_FINAL(6000ms) に同期
const TOTAL       = 6500; 
const FADE_START  = 4000; 
const FADE_FULL   = 6000; 

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
  overlay.style.pointerEvents = "auto";

  function tick(now) {
    const t = now - startTime;

    // フェード処理のみ（加速はcarousel3d側で自動実行中）
    if (t >= FADE_START) {
      const p = Math.min((t - FADE_START) / (FADE_FULL - FADE_START), 1);
      const eased = p * p; // 指数加速の終端に合わせるため加速気味のフェード
      overlay.style.opacity = Math.min(eased, 1);
    }

    if (t >= TOTAL) {
      cancelAnimationFrame(rafId);
      overlay.classList.add("active");
      onFinish?.();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}
