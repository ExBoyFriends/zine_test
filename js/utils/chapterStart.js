// utils/chapterStart.js

export function startChapter({ chapter, dots, onStart }) {
  const fadeLayer = document.getElementById("fadeLayer");

  // chapter 表示
  chapter?.classList.add("visible");

  // dots 表示（必要ならCSS側で制御）
  dots?.classList.add("visible");

  // fade 消す
  if (fadeLayer) {
    requestAnimationFrame(() => {
      fadeLayer.classList.add("hide");
    });
  }

  onStart?.();
}

