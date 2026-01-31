let longPressTimer = null;
let autoTimer = null;
let glitchTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 3000; // 3秒で即遷移
const AUTO_TRANSITION_DURATION = 10000;
const GLITCH_TRIGGER = 800; // 0.8秒で異変開始

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

  element.addEventListener("pointerdown", startPress);
  element.addEventListener("pointerup", endPress);
  element.addEventListener("pointercancel", endPress);
}

/* =====================
   内部処理
===================== */

function startPress(e) {
  e.preventDefault();
  if (isPressing || hasTransitioned) return;

  isPressing = true;
  console.log("🔥 startPress");

  // 押した瞬間から違和感
  window.__carousel__?.setExtraSpeed(0.8);

  glitchTimer = setTimeout(() => {
    if (!hasTransitioned) {
      console.log("⚡ glitch start");
      onGlitchStart?.();
      window.__carousel__?.setExtraSpeed(2.5);
    }
  }, GLITCH_TRIGGER);

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

  onGlitchEnd?.();
  window.__carousel__?.setExtraSpeed(0);
}

function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
  clearTimeout(glitchTimer);

  // 🔥 main.js に通知
  window.dispatchEvent(new Event("force-exit"));
}
