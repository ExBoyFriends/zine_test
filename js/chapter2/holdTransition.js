// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

/* =====================
   内部状態
===================== */

let isPressing = false;
let exited = false;
let committed = false;

let pressStartTime = 0;
let autoStartTime = 0;
let rafId = null;

let glitchTimer = null;

/* =====================
   時間定義
===================== */

const AUTO_TOTAL_TIME = 20000;   // 自動遷移まで 20秒
const FINAL_TIME      = 2000;    // 最後の2秒
const GLITCH_TIME     = 700;     // グリッチ開始

/* =====================
   外部 API
===================== */

export function resetTransitionState() {
  isPressing = false;
  exited = false;
  committed = false;

  clearTimeout(glitchTimer);
  cancelAnimationFrame(rafId);
  rafId = null;

  pressStartTime = 0;
  autoStartTime = performance.now();
}

export function startAutoTransition(onExit) {
  autoStartTime = performance.now();

  function tick(now) {
    if (exited) return;

    const elapsed = now - autoStartTime;

    if (elapsed >= AUTO_TOTAL_TIME) {
      exited = true;
      window.__carousel__?.forceCommit();
      onExit?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
}

export function bindLongPressEvents(element) {
  if (!element) return;

  element.addEventListener("pointerdown", e => {
    element.setPointerCapture?.(e.pointerId);
    startPress();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
    element.addEventListener(type, endPress);
  });
}

/* =====================
   内部処理
===================== */

function startPress() {
  if (isPressing || exited || committed) return;

  isPressing = true;
  pressStartTime = performance.now();

  window.__carousel__?.startHold();

  glitchTimer = setTimeout(() => {
    if (!isPressing || committed) return;
    startGlitch();
  }, GLITCH_TIME);
}

function endPress() {
  if (!isPressing || exited || committed) return;

  isPressing = false;
  clearTimeout(glitchTimer);

  stopGlitch();
  window.__carousel__?.endHold();
}

/* =====================
   強制遷移（carousel 側から）
===================== */

window.addEventListener("force-exit", () => {
  if (exited) return;
  exited = true;
});
