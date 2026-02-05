// utils/chapterStart.js


export function startChapter({ chapter, dots, onStart }) {
  // 1. 本編のコンテナやドットを表示状態にする（透明度などのフラグ）
  chapter?.classList.add("visible");
  dots?.classList.add("visible");

  // 2. フェードレイヤーをここで勝手に消さない（fade.js に任せるため削除）
  // 以前の requestAnimationFrame(() => { ... hide }) は削除します。

  // 3. 準備が整ったことを通知して、次に進む
  onStart?.();
}
