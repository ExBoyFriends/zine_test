let longPressTimer = null;
let autoTimer = null;
let glitchTimer = null;
let accelTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 3000;
const AUTO_TRANSITION_DURATION = 10000;
const GLITCH_TRIGGER = 800;
const FINAL_ACCEL_TRIGGER = 1800;

let onGlitchStart = null;
let onGlitchEnd = null;

/* =====================
   外部API
===================== */

export function resetTransitionState() {
  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
  clearTimeout(glitchTimer);
  clearTimeout(accelTimer);

  isPressing = false;
  hasTransitioned = false;
}

export function startAutoTransition(callback) {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (!hasTransitioned) {
      hasTransitioned = true;
      callback();
    }
  }, AUTO_TRANSITION_DURATION);
}

export function setHoldEffects({ glitchStart, glitchEnd }) {
  onGlitchStart = glitchStart;
  onGlitchEnd = glitchEnd;
}

export function bindLongPressEvents(element) {
  if (!element) return;

  element.addEventListener("pointerdown", e => {
    element.setPointerCapture?.(e.pointerId);

    window.__startDragCheck__?.(e);
    startPress();
  });

  element.addEventListener("pointermove", e => {
    window.__moveDragCheck__?.(e);
  });

  element.addEventListener("pointerup", e => {
    window.__endDragCheck__?.();
    endPress();
  });

  element.addEventListener("pointercancel", () => {
    window.__endDragCheck__?.();
    endPress();
  });

  element.addEventListener("pointerleave", () => {
    window.__endDragCheck__?.();
    endPress();
  });
}


/* =====================
   内部処理
===================== */

function startPress() {
  if (isPressing || hasTransitioned) return;
  isPressing = true;

  window.__carousel__?.setExtraSpeed(0.8);
  window.__carousel__?.setHolding(true);

  glitchTimer = setTimeout(() => {
    if (!hasTransitioned && isPressing) {
      onGlitchStart?.();
      window.__carousel__?.setExtraSpeed(2.5);
    }
  }, GLITCH_TRIGGER);

  accelTimer = setTimeout(() => {
    if (!hasTransitioned && isPressing) {
      window.__carousel__?.setExtraSpeed(5.5);
    }
  }, FINAL_ACCEL_TRIGGER);

  longPressTimer = setTimeout(() => {
    if (hasTransitioned) return;
    hasTransitioned = true;
    window.dispatchEvent(new Event("force-exit"));
  }, LONG_PRESS_DURATION);
}

function endPress() {
  if (!isPressing || hasTransitioned) return;

  isPressing = false;

  window.__carousel__?.setHolding(false); 

  clearTimeout(glitchTimer);
  clearTimeout(longPressTimer);
  clearTimeout(accelTimer);

  onGlitchEnd?.();
  window.__carousel__?.setExtraSpeed(0);
}
