import { startGlitch, stopGlitch } from "./effects.js";

let longPressTimer = null;
let glitchTimer = null;
let accelTimer = null;
let autoTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 3000;
const AUTO_TRANSITION_DURATION = 10000;
const GLITCH_TRIGGER = 700;
const FINAL_ACCEL_TRIGGER = 1700;

// 回転スピード
const BASE_HOLD_SPEED = 0.8;
const GLITCH_SPEED = 3.5;
const PRE_EXIT_MAX = 8;
const EXIT_SPEED = 10;

// 外部API
export function resetTransitionState() {
  clearAllTimers();
  isPressing = false;
  hasTransitioned = false;
}

export function startAutoTransition(callback) {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (hasTransitioned) return;
    hasTransitioned = true;
    callback();
  }, AUTO_TRANSITION_DURATION);
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

  ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
    element.addEventListener(type, endPress);
  });
}

// 内部処理
function startPress() {
  if (isPressing || hasTransitioned) return;
  isPressing = true;

  window.__carousel__?.setHolding(true);
  window.__carousel__?.setExtraSpeed(BASE_HOLD_SPEED);

  glitchTimer = setTimeout(() => {
    if (!isPressing || hasTransitioned) return;
    startGlitch();
    window.__carousel__?.setExtraSpeed(GLITCH_SPEED);
  }, GLITCH_TRIGGER);

  accelTimer = setTimeout(() => {
    if (!isPressing || hasTransitioned) return;
    window.__carousel__?.setExtraSpeed(PRE_EXIT_MAX);
  }, FINAL_ACCEL_TRIGGER);

  longPressTimer = setTimeout(() => {
    if (hasTransitioned) return;
    hasTransitioned = true;

    // 🔥 遷移中にさらに加速
    window.__carousel__?.setExtraSpeed(EXIT_SPEED);

    window.dispatchEvent(new Event("force-exit"));
  }, LONG_PRESS_DURATION);
}

function endPress() {
  if (!isPressing || hasTransitioned) return;

  isPressing = false;
  clearAllTimers();

  stopGlitch();
  window.__carousel__?.setHolding(false);
  window.__carousel__?.setExtraSpeed(0);
}

function clearAllTimers() {
  clearTimeout(longPressTimer);
  clearTimeout(glitchTimer);
  clearTimeout(accelTimer);
  clearTimeout(autoTimer);
}

