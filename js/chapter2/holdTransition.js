// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false;
let exited = false;
let timer = null;
let holding = false;

const AUTO_DELAY = 8000;
const HOLD_DELAY = 350; // ★ ドラッグ猶予

export function resetTransitionState() {
  pressing = false;
  holding = false;
  exited = false;
  clearTimeout(timer);
  timer = null;
}

export function startAutoTransition(onExit) {
  clearTimeout(timer);

  timer = setTimeout(() => {
    if (exited) return;
    window.__carousel__?.startAuto();
    onExit?.();
  }, AUTO_DELAY);
}

export function markExited() {
  exited = true;
}

export function bindLongPressEvents(el) {
  if (!el) return;

  el.addEventListener("pointerdown", () => {
    if (exited) return;

    pressing = true;
    holding = false;

    // ★ 一定時間ドラッグされなかったら hold 開始
    timer = setTimeout(() => {
      if (!pressing || exited) return;

      holding = true;
      window.__carousel__?.startHold();

      // 視覚効果はさらに遅らせる
      setTimeout(() => {
        if (holding && pressing) {
          startGlitch();
        }
      }, 400);

    }, HOLD_DELAY);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach(t =>
    el.addEventListener(t, endPress)
  );
}

function endPress() {
  if (!pressing) return;

  pressing = false;
  clearTimeout(timer);

  if (holding) {
    stopGlitch();
    window.__carousel__?.endHold();
  }

  holding = false;
}

/* ===== bfcache ===== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
});

