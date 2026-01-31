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

let transitionCallback = null;
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
  transitionCallback = callback;

  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (!hasTransitioned) doTransition();
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
    startPress(e);
  });

  element.addEventListener("pointerup", endPress);
  element.addEventListener("pointercancel", endPress);
  element.addEventListener("pointerleave", endPress);
}

/* =====================
   内部処理
===================== */

function startPress(e) {
  e.preventDefault();
  if (isPressing || hasTransitioned) return;

  isPressing = true;
  console.log("🔥 startPress");

  // 押した瞬間：軽い違和感
  window.__carousel__?.setExtraSpeed(0.8);

  // 0.8秒：異変（グリッチ）
  glitchTimer = setTimeout(() => {
    if (!hasTransitioned && isPressing) {
      console.log("⚡ glitch start");
      onGlitchStart?.();
      window.__carousel__?.setExtraSpeed(2.5);
    }
  }, GLITCH_TRIGGER);

  // 1.8秒：後半の狂気加速
  accelTimer = setTimeout(() => {
    if (!hasTransitioned && isPressing) {
      console.log("🌀 final accel");
      window.__carousel__?.setExtraSpeed(5.5);
    }
  }, FINAL_ACCEL_TRIGGER);

  // 3秒：強制遷移
  longPressTimer = setTimeout(() => {
    console.log("🔥 HOLD COMPLETE");
    doTransition();
  }, LONG_PRESS_DURATION);
}

function endPress() {
  if (!isPressing || hasTransitioned) return;

  console.log("🛑 endPress");
  isPressing = false;

  clearTimeout(glitchTimer);
  clearTimeout(longPressTimer);
  clearTimeout(accelTimer);

  onGlitchEnd?.();
  window.__carousel__?.setExtraSpeed(0);
}

function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
  clearTimeout(glitchTimer);
  clearTimeout(accelTimer);

  window.dispatchEvent(new Event("force-exit"));
}
