// utils/chapterStart.js

export function startChapter({ chapter, dots, onStart }) {
  const fadeLayer = document.getElementById("fadeLayer");

  // chapter 表示
  if (chapter) {
    chapter.style.opacity = "1";
    chapter.style.pointerEvents = "auto";
  }

  // dots 表示
  if (dots) {
    dots.style.opacity = "1";
  }

  // fade 消す
  if (fadeLayer) {
    requestAnimationFrame(() => {
      fadeLayer.classList.add("hide");
    });
  }

  onStart?.();
}
