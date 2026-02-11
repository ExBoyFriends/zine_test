// utils/chapterStart.js
export function startChapter({ chapter, dots, onStart }) {
  chapter?.classList.add("visible");
  dots?.classList.add("visible");

  // 2フレーム待つ
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      onStart?.();
    });
  });
}
