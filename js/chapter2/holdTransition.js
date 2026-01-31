// holdTransition.js

let longPressTimer = null;
let autoTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 5000;       // 5秒
const AUTO_TRANSITION_DURATION = 10000; // 10秒

/* ===== 遷移 ===== */
function doTransition(callback) {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);

  callback?.();
}

/* ===== 開始 ===== */
function startPress(callback) {
  if (isPressing) return;

  isPressing = true;
  hasTransitioned = false;

  // 長押し
  longPressTimer = setTimeout(() => {
    if (isPressing) {
      doTransition(callback);
    }
  }, LONG_PRESS_DURATION);

  // 自動遷移（触ってなくても）
  autoTimer = setTimeout(() => {
    doTransition(callback);
  }, AUTO_TRANSITION_DURATION);
}

/* ===== 終了 ===== */
function endPress() {
  isPressing = false;
  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
}

/* ===== 公開API ===== */
export function bindLongPressEvents(element, onTransition) {

  const start = e => {
    e.preventDefault();
    startPress(onTransition);
  };

  const end = e => {
    e.preventDefault();
    endPress();
  };

  element.addEventListener("touchstart", start, { passive: false });
  element.addEventListener("touchend", end, { passive: false });
  element.addEventListener("mousedown", start);
  element.addEventListener("mouseup", end);
}

