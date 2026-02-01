import { startGlitch, stopGlitch } from "./effects.js";

/* =====================
   内部状態
===================== */

let isPressing = false;
let exited = false;

let startTime = 0;              // ページ表示からの絶対時間
let rafId = null;

let longPressTimer = null;
let glitchTimer = null;
let accelTimer = null;

/* =====================
   外部エフェクトフック
===================== */

let effects = {};

export function setHoldEffects(e) {
  effects = e || {};
}

/* =====================
   時間定義
===================== */

const LONG_PRESS_DURATION = 3000;
const AUTO_TRANSITION_DURATION = 10000;
const GLITCH_TRIGGER = 700;
const FINAL_ACCEL_TRIGGER = 1700;

/* =====================
   回転スピード
===================== */

const BASE_HOLD_SPEED = 0.8;
const GLITCH_SPEED = 3.5;
const PRE_EXIT_MAX = 8;
const EXIT_SPEED = 10;

/* =====================
   外部API
===================== */

export function resetTransitionState() {
  clearAllTimers();
  isPressing = false;
  exited = false;
  startTime = performance.now();
  cancelAnimationFrame(rafId);
  rafId = null;
}

export function startAutoTransition(callback) {
  cancelAnimationFrame(rafId);
  startTime = performance.now();

  function tick(now) {
    if (exited) return;

    const elapsed = now - startTime;

    // ⏱ 絶対時間で必ず遷移
    if (elapsed >= AUTO_TRANSITION_DURATION) {
      exited = true;
      callback();
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

/* =====================
   内部処理
===================== */

function startPress() {
  if (isPressing || exited) return;
  isPressing = true;

  window.__carousel__?.setHolding(true);
  window.__carousel__?.setExtraSpeed(BASE_HOLD_SPEED);

  // グリッチ開始
  glitchTimer = setTimeout(() => {
    if (!isPressing || exited) return;

    startGlitch();
    effects.glitchStart?.();
    window.__carousel__?.setExtraSpeed(GLITCH_SPEED);
  }, GLITCH_TRIGGER);

  // 最終加速
  accelTimer = setTimeout(() => {
    if (!isPressing || exited) return;
    window.__carousel__?.setExtraSpeed(PRE_EXIT_MAX);
  }, FINAL_ACCEL_TRIGGER);

  // 🚀 長押しスキップ（時間より早い場合のみ）
  longPressTimer = setTimeout(() => {
    if (exited) return;

    exited = true;
    window.__carousel__?.setExtraSpeed(EXIT_SPEED);
    window.dispatchEvent(new Event("force-exit"));
  }, LONG_PRESS_DURATION);
}

function endPress() {
  if (!isPressing || exited) return;

  isPressing = false;
  clearPressTimers();

  stopGlitch();
  effects.glitchEnd?.();

  // 🔑 holding 解除のみ（速度は保持）
  window.__carousel__?.setHolding(false);
}

/* =====================
   タイマー管理
===================== */

function clearPressTimers() {
  clearTimeout(longPressTimer);
  clearTimeout(glitchTimer);
  clearTimeout(accelTimer);
}

function clearAllTimers() {
  clearPressTimers();
  cancelAnimationFrame(rafId);
}


