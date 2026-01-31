let longPressTimer = null;
let autoTimer = null;
let glitchTimer = null;

let isPressing = false;
let hasTransitioned = false;

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

  // 👉 押した瞬間に反応を出す
  window.__carousel__?.setExtraSpeed(0.2);

  glitchTimer = setTimeout(() => {
    if (isPressing && !hasTransitioned) {
      onGlitchStart?.();
    }
  }, GLITCH_TRIGGER);

  longPressTimer = setTimeout(() => {
    if (isPressing && !hasTransitioned) doTransition();
  }, LONG_PRESS_DURATION);
}


function endPress() {
  isPressing = false;

  clearTimeout(glitchTimer);
  clearTimeout(longPressTimer);

  // 遷移してなければ戻す
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


  transitionCallback?.();
}

export function bindLongPressEvents(element) {
  if (!element) return;

  element.addEventListener("touchstart", e => {
    e.preventDefault();
    startPress();
  }, { passive: false });

  element.addEventListener("touchend", e => {
    e.preventDefault();
    endPress();
  }, { passive: false });

  element.addEventListener("mousedown", startPress);
  element.addEventListener("mouseup", endPress);
}


