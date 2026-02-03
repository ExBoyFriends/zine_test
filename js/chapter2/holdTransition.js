// chapter2/holdTransition.js
import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false;
let committed = false;

let glitchTimer = null;
let accelTimer = null;
let exitTimer = null;

const GLITCH_TIME = 700;
const COMMIT_TIME = 1500;
const EXIT_TIME   = 3000;

export function resetTransitionState() {
  pressing = false;
  committed = false;
  clearAll();
}

export function bindLongPressEvents(el) {
  if (!el) return;

  el.addEventListener("pointerdown", e => {
    el.setPointerCapture?.(e.pointerId);
    startPress();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(t =>
    el.addEventListener(t, endPress)
  );
}

function startPress() {
  if (pressing) return;
  pressing = true;

  window.__carousel__?.setExtraSpeed(1);

  glitchTimer = setTimeout(() => {
    if (!pressing) return;
    startGlitch();
    window.__carousel__?.setExtraSpeed(4);
  }, GLITCH_TIME);

  accelTimer = setTimeout(() => {
    if (!pressing) return;
    committed = true;
    window.__carousel__?.setExtraSpeed(8);
  }, COMMIT_TIME);

  exitTimer = setTimeout(() => {
    if (!pressing) return;
    window.dispatchEvent(new Event("force-exit"));
  }, EXIT_TIME);
}

function endPress() {
  if (!pressing) return;
  pressing = false;

  clearAll();
  stopGlitch();

  // commit前なら減速して通常へ
  if (!committed) {
    window.__carousel__?.setExtraSpeed(0);
  }
}

function clearAll() {
  clearTimeout(glitchTimer);
  clearTimeout(accelTimer);
  clearTimeout(exitTimer);
}

