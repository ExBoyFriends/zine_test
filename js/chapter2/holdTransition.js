// holdTransition.js
let longPressTimer = null;
let autoTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 5000;
const AUTO_TRANSITION_DURATION = 10000;

let transitionCallback = null;

export function resetTransitionState() {
  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
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

function startPress() {
  if (isPressing || hasTransitioned) return;
  isPressing = true;

  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (isPressing && !hasTransitioned) doTransition();
  }, LONG_PRESS_DURATION);
}

function endPress() {
  isPressing = false;
  clearTimeout(longPressTimer);
}

function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);

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

