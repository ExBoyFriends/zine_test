/* =====================
   loader.js (GLOBAL)
===================== */

export function initLoader(loader, onComplete) {
  if (!loader) {
    if (onComplete) onComplete();
    return;
  }

  const start = () => {
    // 念のため初期状態を保証
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 少し待ってからフェードアウト
    setTimeout(() => {
      requestAnimationFrame(() => {
        loader.style.opacity = "0";
      });

      loader.addEventListener(
        "transitionend",
        () => {
          loader.style.display = "none";
          if (typeof onComplete === "function") {
            onComplete();
          }
        },
        { once: true }
      );
    }, 1200);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
