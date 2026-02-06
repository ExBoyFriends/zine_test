
/**
 * loader.js
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) loader.style.display = "none";
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // CSSの「闇が満ちる」演出(2.0s)に合わせて待機
    setTimeout(() => {
      if (loader) {
        // 真っ黒になった世界をスッと引く（本編へ）
        loader.style.transition = "opacity 1.0s ease-out";
        loader.style.opacity = "0";
      }

      // ローダーが完全に消えきる少し前に本編準備完了
      setTimeout(safeComplete, 500);
    }, 2000); // 2秒かけて真っ暗にする
  };

  const start = () => {
    finished = false; 
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.classList.remove("swallow-darkness");
    }
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
