// utils/autoSlide.js

export function initAutoSlide({
  delay = 5000,
  lastOpenDelay = 5000,
  lastTransitionDelay = 3000,
  getIndex,
  total,
  goNext,
  onLastOpen,
  onLastTransition
}) {

  let timer = null;
  let lastStage = 0; // 0=通常, 1=最後ページopen後

  const clear = () => {
    if (timer) clearTimeout(timer);
  };

  const schedule = (ms) => {
    clear();
    timer = setTimeout(tick, ms);
  };

  const tick = () => {
    const index = getIndex();

    // 最後のページ
    if (index === total - 1) {

      if (lastStage === 0) {
        lastStage = 1;
        onLastOpen?.();
        schedule(lastTransitionDelay);
      } else {
        onLastTransition?.();
      }

    } else {
      goNext?.();
      schedule(delay);
    }
  };

  // 開始
  schedule(delay);
}
