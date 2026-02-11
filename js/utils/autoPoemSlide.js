// utils/autoPoemSlide.js

export function initAutoPoemSlide({
  openDelay = 3000,
  showDelay = 3000,
  resumeDelay = 5000,
  getIndex,
  total,
  openText,
  closeText,
  goNext,
  goLast
}) {

  let timer = null;
  let resumeTimer = null;
  let stage = 0;
  let paused = false;

  function clear() {
    if (timer) clearTimeout(timer);
  }

  function schedule(ms) {
    if (paused) return;
    clear();
    timer = setTimeout(tick, ms);
  }

  function tick() {
    if (paused) return;

    const index = getIndex();

    // 最終ページ処理
    if (index === total - 1 && stage === 1) {
      closeText();
      goLast?.();
      return;
    }

    if (stage === 0) {
      openText();
      stage = 1;
      schedule(showDelay);
    } 
    else {
      closeText();
      stage = 0;
      goNext();
      schedule(openDelay);
    }
  }

  function pause() {
    paused = true;
    clear();

    if (resumeTimer) clearTimeout(resumeTimer);

    resumeTimer = setTimeout(() => {
      resume();
    }, resumeDelay);
  }

  function resume() {
    paused = false;
    stage = 0; // 状態を安定リセット
    schedule(openDelay);
  }

  schedule(openDelay);

  return { pause };
}
