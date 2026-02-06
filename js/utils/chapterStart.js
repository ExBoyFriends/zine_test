// utils/chapterStart.js

export function startChapter({ chapter, dots, onStart }) {
  // 1. 本編とドットを表示（CSS側の 2.8s transition が発動する）
  chapter?.classList.add("visible");
  dots?.classList.add("visible");

  // 2. 準備完了を通知
  onStart?.();
}
