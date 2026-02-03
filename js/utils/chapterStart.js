/* utils/chapterStart.js*/

/* =====================
   共通フェード設定
===================== */

// 世界フェードの体感時間（全章共通）
export const CHAPTER_FADE_DURATION = 2800;

// UI（dotsなど）を出すまでの余韻
export const DOT_DELAY = CHAPTER_FADE_DURATION + 1000;

/* =====================
   Chapter Start 共通処理
===================== */

export function startChapter({
  chapter,
  dots = null,
  onStart = () => {},
}) {
  // 世界を出す（初回フェード）
  chapter?.classList.add("visible");

  // 章ごとの差分処理
  onStart();

  // UI 表示を遅らせる
  if (dots) {
    setTimeout(() => {
      dots.classList.add("visible");
    }, DOT_DELAY);
  }
}
