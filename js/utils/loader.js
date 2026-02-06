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
    if (loader) loader.style.display = "none";
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    // 1. 闇を巨大化させ、完全に塗りつぶす
    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // 2. 塗りつぶしが完了したタイミング（1.2秒後）
    setTimeout(() => {
      // カクつきを避けるため、一気に opacity 変化へ
      if (loader) {
        loader.style.transition = "opacity 0.7s cubic-bezier(0.2, 1, 0.3, 1)";
        loader.style.opacity = "0";
      }

      // 3. ローダーが消える途中（0.4s後）で、背後の準備を整える
      setTimeout(safeComplete, 400);
    }, 1200);
  };

  const start = () => {
    finished = false; 

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.classList.remove("swallow-darkness");
      loader.style.transition = "none";
    }
    if (fadeLayer) {
      // 初期化：ローディング中の設定に戻す
      fadeLayer.style.display = "block";
      fadeLayer.style.mixBlendMode = "multiply";
    }

    // 8.4秒間の演出
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // 戻るボタン（bfcache）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      start(); 
    }
  });
}
