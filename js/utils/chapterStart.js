// utils/chapterStart.js

export function startChapter({ chapter, dots, onStart }) {
  // 1. まず「本編の枠」と「ドット」を visible にする
  // これにより CSS の transition が開始される
  chapter?.classList.add("visible");
  dots?.classList.add("visible");

  // 2. ★重要★ 
  // クラスをつけた直後はブラウザが描画（レンダリング）に忙しいので、
  // ほんの少しだけ待ってから JavaScript の初期化 (onStart) を実行する
  setTimeout(() => {
    requestAnimationFrame(() => {
      console.log("chapterStart: Rendering settled, starting JS logic...");
      onStart?.();
    });
  }, 150); // 0.15秒の隙間を作るだけで、描画の詰まりが劇的に解消されます
}
