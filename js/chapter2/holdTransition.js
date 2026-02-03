// chapter2/holdTransition.js

import { startGlitch, stopGlitch } from "./effects.js";

let isPressing = false;
let exited = false;
let rafId = null;

const AUTO_TOTAL_TIME = 20000;
const GLITCH_TIME = 700;

export function resetTransitionState() {
  isPressing = false;
  exited = false;
  cancelAnimationFrame(rafId);
  rafId = null;
}

export function startAutoTransition(onExit) {
  const start = performance.now();

  window.__carousel__?.startAutoPhase();

  function tick(now) {
    if (exited) return;

    if (now - start >= AUTO_TOTAL_TIME) {
      exited = true;
      onExit?.();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
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
  if (isPressing || exited) return;
  isPressing = true;

  window.__carousel__?.startHold();

  setTimeout(() => {
    if (!isPressing) return;
    startGlitch();
  }, GLITCH_TIME);
}

function endPress() {
  if (!isPressing || exited) return;

  isPressing = false;
  stopGlitch();
  window.__carousel__?.endHold();
}

