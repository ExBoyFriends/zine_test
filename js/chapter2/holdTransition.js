// holdTransition.js
let pressTimer = null;
let holdStart = 0;
let holding = false;

const HOLD_TIME = 3000; // 3秒

export function initHoldTransition({ element, onComplete }) {
  if (!element) {
    console.warn("holdTransition: element not found");
    return;
  }

  element.addEventListener("pointerdown", e => {
    e.preventDefault();
    startPress(onComplete);
  });

  element.addEventListener("pointerup", endPress);
  element.addEventListener("pointercancel", endPress);
}

function startPress(onComplete) {
  if (holding) return;

  holding = true;
  holdStart = performance.now();

  console.log("🔥 startPress");

  pressTimer = requestAnimationFrame(function tick(now) {
    const p = Math.min((now - holdStart) / HOLD_TIME, 1);

    // 🔥 加速（視覚的に分かる値）
    window.__carousel__?.setExtraSpeed(1.5 + p * 6);

    // 🔥 グリッチ可視化（仮）
    document.body.style.filter = `contrast(${1 + p})`;

    if (p >= 1) {
      console.log("🔥 HOLD COMPLETE");
      endPress();
      onComplete?.();
      return;
    }

    pressTimer = requestAnimationFrame(tick);
  });
}

function endPress() {
  if (!holding) return;

  console.log("🛑 endPress");

  holding = false;
  cancelAnimationFrame(pressTimer);
  pressTimer = null;

  document.body.style.filter = "";
  window.__carousel__?.setExtraSpeed(0);
}

