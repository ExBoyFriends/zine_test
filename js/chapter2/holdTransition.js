let longPressTimer = null;
let autoTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 5000;    // 長押し5秒
const AUTO_TRANSITION_DURATION = 1000; // 自動10秒

let transitionCallback = null;

/* =====================
   自動遷移開始
===================== */
export function startAutoTransition(callback) {
  transitionCallback = callback;

  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (!hasTransitioned) {
      doTransition();
    }
  }, AUTO_TRANSITION_DURATION);
}

/* =====================
   長押し開始
===================== */
function startPress(callback) {
  if (isPressing || hasTransitioned) return;

  isPressing = true;
  transitionCallback = callback;

  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (isPressing && !hasTransitioned) {
      doTransition();
    }
  }, LONG_PRESS_DURATION);
}

/* =====================
   長押し終了
===================== */
function endPress() {
  isPressing = false;
  clearTimeout(longPressTimer);
}

/* =====================
   遷移実行
===================== */
function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);

  transitionCallback?.();
}

/* =====================
   イベントバインド
===================== */
export function bindLongPressEvents(element, callback) {
  if (!element) return;

  const start = e => {
    e.preventDefault();
    startPress(callback);
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

