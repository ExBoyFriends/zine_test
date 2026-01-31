export function initLoader(loader) {
  if (!loader) return;

  const start = () => {
    // 🔑 戻ってきた時は必ず初期化
    loader.style.display = "block";
    loader.style.opacity = "1";
    loader.style.pointerEvents = "auto";

    // フラグは毎回リセット
    loader.dataset.started = "";

    // 少し遅らせてから消す
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";

      setTimeout(() => {
        loader.style.display = "none";
        loader.dataset.started = "true";
      }, 3500);
    }, 1200);
  };

  // 初回ロード
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // 🔑 戻る対応（必須）
  window.addEventListener("pageshow", start);
}

