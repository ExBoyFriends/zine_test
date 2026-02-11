// utils/autoPoemSlide.js

export function initAutoPoemSlide({
  openDelay = 3000,
  showDelay = 3000,
  getIndex,
  total,
  openText,
  closeText,
  goNext,
  goLast
}) {

  let timer = null;
  let stage = 0; 
  // 0 = 待機
  // 1 = テキスト表示中

  function clear() {
    if (timer) clearTimeout(timer);
  }

  function schedule(ms) {
    clear();
    timer = setTimeout(tick, ms);
  }

  function tick() {

    const index = getIndex();

    // 最後ページで閉じた後
    if (index === total - 1 && stage === 1) {
      closeText();
      goLast?.();
      return;
    }

    if (stage === 0) {
      openText();
      stage = 1;
      schedule(showDelay);
    } else {
      closeText();
      stage = 0;
      goNext();
      schedule(openDelay);
    }
  }

  schedule(openDelay);
}
