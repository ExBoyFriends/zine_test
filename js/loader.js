/* =====================
   loader.js (GLOBAL)
===================== */

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const finish = () => {
    loader.style.display = "none";
    onComplete?.();
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    setTimeout(() => {
      requestAnimationFrame(() => {
        loader.style.opacity = "0";
      });

      // transitionend（通常ルート）
      loader.addEventListener("transitionend", finish, { once: true });

      // 保険（発火しなかった場合）
      setTimeout(finish, 4000);
    }, 1200);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
