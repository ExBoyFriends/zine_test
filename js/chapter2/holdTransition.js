// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false;
let exited = false;
let timer = null;

const AUTO_DELAY = 8000;

export function resetTransitionState() {
  pressing = false;
  exited = false;
  clearTimeout(timer);
  timer = null;
}

export function startAutoTransition(onExit) {
  clearTimeout(timer);
  
  timer = setTimeout(() => {
    if (exited) return;

    exited = true;
    window.__carousel__?.startAuto();
    onExit?.();
  }, AUTO_DELAY);
}


export function bindLongPressEvents(el) {
  if (!el) return;

  el.addEventListener("pointerdown", e => {
    el.setPointerCapture?.(e.pointerId);
    startPress();
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach(t =>
    el.addEventListener(t, endPress)
  );
}

function startPress() {
  if (pressing || exited) return;

  pressing = true;
  window.__carousel__?.startHold();

  setTimeout(() => {
    if (!pressing || exited) return;
    startGlitch();
  }, 700);
}

function endPress() {
  if (!pressing) return;
  
  pressing = false;
  stopGlitch();
  window.__carousel__?.endHold();
}

/* =========================
   bfcache 対策（最重要）
========================= */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
});
