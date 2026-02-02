/* loader.js */

export function initLoader(loader, onComplete) {
  if (!loader) {
    onComplete?.();
    return;
  }

  const fadeLayer = document.getElementById("fadeLayer");
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    // 完全に闇が確定した「次の描画」で処理
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // loader は即消す（演出終了）
        loader.style.display = "none";

        // 闇 → フェードイン開始
        fadeLayer?.classList.add("hide");

        // ここで初期画面を出してOK
        onComplete?.();
      });
    });
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 暗闇は最初からON
    fadeLayer?.classList.remove("hide");

    // ローディング表示時間
    setTimeout(() => {
      // loader 演出をフェードアウト
      loader.style.opacity = "0";

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
