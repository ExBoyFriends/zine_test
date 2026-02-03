// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let pressing = false;
let glitchTimer = null;

export function resetTransitionState() {
  pressing = false;
  clearTimeout(glitchTimer);
}

export function bindLongPressEvents(el) {
  if (!el) return;

  el.addEventListener("pointerdown", e => {
    el.setPointerCapture?.(e.pointerId);
    startPress();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(type =>
    el.addEventListener(type, endPress)
  );
}

function startPress() {
  if (pressing) return;
  if (!window.__carousel__?.isFreePhase()) return;

  pressing = true;
  window.__carousel__?.startHold();

  glitchTimer = setTimeout(() => {
    if (!pressing) return;
    startGlitch();
  }, 700);
}

function endPress() {
  if (!pressing) return;

  pressing = false;
  clearTimeout(glitchTimer);

  stopGlitch();
  window.__carousel__?.endHold();
}
