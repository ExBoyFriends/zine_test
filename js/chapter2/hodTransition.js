let longPressTimer = null;
let autoTransitionTimer = null;
let longPressStartTime = null;
let autoTransitionStartTime = null;

let isLongPress = false;
let isAutoTransition = false;

let transitionCallback = null; // 2.5章への移行コールバック

const LONG_PRESS_DURATION = 5000; // 長押しで移行までの時間（5秒）
const AUTO_TRANSITION_DURATION = 10000; // 自動移行の時間（10秒）

// 長押し判定開始
export function startLongPress(callback) {
  transitionCallback = callback;
  isLongPress = false;
  longPressStartTime = Date.now();

  // 長押しタイマー開始
  longPressTimer = setTimeout(() => {
    isLongPress = true;
    transitionToChapter2_5();
  }, LONG_PRESS_DURATION);

  // 自動移行タイマー開始
  autoTransitionStartTime = Date.now();
  autoTransitionTimer = setTimeout(() => {
    if (!isLongPress) {
      transitionToChapter2_5();
    }
  }, AUTO_TRANSITION_DURATION);
}

// 長押しが終了した場合の処理
export function endLongPress() {
  clearTimeout(longPressTimer);
  clearTimeout(autoTransitionTimer);

  // 長押しが終了した時は移行をキャンセル
  if (!isLongPress && Date.now() - longPressStartTime < LONG_PRESS_DURATION) {
    resetTransitionTimers();
  }
}

// 長押しまたは自動移行で2.5章へ移行する
function transitionToChapter2_5() {
  if (transitionCallback) {
    transitionCallback();
  }
  resetTransitionTimers();
}

// タイマーリセット
function resetTransitionTimers() {
  clearTimeout(longPressTimer);
  clearTimeout(autoTransitionTimer);
  longPressStartTime = null;
  autoTransitionStartTime = null;
  isLongPress = false;
  isAutoTransition = false;
}

// タッチやドラッグ操作を通じて長押し判定をする
export function bindLongPressEvents(element) {
  element.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startLongPress(() => console.log('2.5章への移行')); // 2.5章移行のコールバック
  });

  element.addEventListener('touchend', (e) => {
    e.preventDefault();
    endLongPress();
  });

  element.addEventListener('mousedown', (e) => {
    startLongPress(() => console.log('2.5章への移行')); // 2.5章移行のコールバック
  });

  element.addEventListener('mouseup', (e) => {
    endLongPress();
  });
}
