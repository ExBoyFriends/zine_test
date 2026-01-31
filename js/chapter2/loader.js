// loader.js
export function initLoader(loader) {
  if (!loader) return;

  const start = () => {
    // 二重実行防止
    if (loader.dataset.started) return;
    loader.dataset.started = "true";

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";

      setTimeout(() => {
        loader.style.display = "none";
      }, 3500);
    }, 1200);
  };

  // 通常ロード
  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // 🔑 戻る対策（これが重要）
  window.addEventListener("pageshow", start);
}
