let pressStartTime = null;
let longPressTimer = null;
let autoTimer = null;

let isPressing = false;
let hasTransitioned = false;

const LONG_PRESS_DURATION = 5000;   // 5秒
const AUTO_TRANSITION_DURATION = 10000; // 10秒

let transitionCallback = null;

/* ===== 開始 ===== */
function startPress(callback) {
  if (isPressing) return;

  isPressing = true;
  hasTransitioned = false;
  pressStartTime = Date.now();
  transitionCallback = callback;

  // 長押し
  longPressTimer = setTimeout(() => {
    if (isPressing && !hasTransitioned) {
      doTransition();
    }
  }, LONG_PRESS_DURATION);

  // 自動遷移
  autoTimer = setTimeout(() => {
    if (!hasTransitioned) {
      doTransition();
    }
  }, AUTO_TRANSITION_DURATION);
}

/* ===== 終了 ===== */
function endPress() {
  isPressing = false;
  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
}

/* ===== 遷移 ===== */
function doTransition() {
  if (hasTransitioned) return;
  hasTransitioned = true;

  if (transitionCallback) {
    transitionCallback();
  }

  clearTimeout(longPressTimer);
  clearTimeout(autoTimer);
}

/* ===== バインド ===== */
export function bindLongPressEvents(element) {

  const start = e => {
    e.preventDefault();
    startPress(() => {
      console.log("Chapter 2.5 へ移行");
      // location.href = "chapter2_5.html";
    });
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

