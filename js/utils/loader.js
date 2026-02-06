/**
 * loader.js
 * 役割：忍び寄る闇の演出。最後は画面を完全に飲み込み、本編へ繋ぐ。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) {
      loader.style.display = "none";
    }
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  const finish = () => {
    if (finished) return;

    // 1. 闇が広がり、画面を完全に飲み込む演出を開始
    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // 2. 画面が真っ暗になったタイミング（1.2秒後）でフェードアウト
    setTimeout(() => {
      if (loader) {
        loader.style.transition = "opacity 0.8s ease-out";
        loader.style.opacity = "0";
      }
      // 3. ローダーが消えきる直前に本編を背後で開始（0.4秒後に実行）
      setTimeout(safeComplete, 400);
    }, 1200);
  };

  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // 8.4秒間演出をループ。その後、闇を広げて終了
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) safeComplete();
  });
}
