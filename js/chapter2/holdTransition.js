let longPressTimer = null;
let autoTimer = null;
let glitchTimer = null;
let pressRaf = null;

let isPressing = false;
let hasTransitioned = false;
let pressStartTime = 0;

const LONG_PRESS_DURATION = 5000;
const AUTO_TRANSITION_DURATION = 10000;
const GLITCH_TRIGGER = 3000;

let transitionCallback = null;
let onGlitchStart = null;
let onGlitchEnd = null;

export function resetTransitionState() {
  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
  clearTimeout(glitchTimer);
  cancelAnimationFrame(pressRaf);

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

function startPress() {
  if (isPressing || hasTransitioned) return;
  isPressing = true;
  pressStartTime = performance.now();

  const tick = now => {
    if (!isPressing || hasTransitioned) return;

    const t = now - pressStartTime;
    const p = Math.min(t / LONG_PRESS_DURATION, 1);

    // 押してる間ずっと加速（体感重視）
    window.__carousel__?.setExtraSpeed(1.2 + p * 4.5);

    pressRaf = requestAnimationFrame(tick);
  };

  pressRaf = requestAnimationFrame(tick);

  glitchTimer = setTimeout(() => {
    onGlitchStart?.();
  }, GLITCH_TRIGGER);

  longPressTimer = setTimeout(doTransition, LONG_PRESS_DURATION);
}

function endPress() {
  isPressing = false;

  clearTimeout(glitchTimer);
  clearTimeout(longPressTimer);
  cancelAnimationFrame(pressRaf);

  if (!hasTransitioned) {
    window.__carousel__?.setExtraSpeed(0);
    onGlitchEnd?.();
  }
}

function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
  clearTimeout(glitchTimer);
  cancelAnimationFrame(pressRaf);

  onGlitchEnd?.();

  // 🔥 長押し即遷移
  window.dispatchEvent(new Event("force-exit"));
}

export function bindLongPressEvents(element) {
  if (!element) return;

  element.addEventListener("pointerdown", e => {
    e.preventDefault();
    startPress();
  });

  element.addEventListener("pointerup", e => {
    e.preventDefault();
    endPress();
  });

  element.addEventListener("pointercancel", endPress);
}


