/* loader.js */

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    // 👇 完全に闇になった「次のフレーム」で確定
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loader.style.display = "none";
        onComplete?.(); // ← 闇が確定してから呼ぶ
      });
    });
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    setTimeout(() => {
      // フェードアウト開始
      loader.style.opacity = "0";

      // フェード完了検知
      loader.addEventListener("transitionend", finish, { once: true });

      // 保険
      setTimeout(finish, 3000);
    }, 4000);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
