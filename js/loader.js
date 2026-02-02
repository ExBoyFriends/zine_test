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

    // 闇が確定した次の描画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // loader 演出はここで完全終了
        loader.style.display = "none";

        // 闇 → フェードイン開始
        fadeLayer?.classList.add("hide");

        // 🔑 fadeLayer のフェードが少し進んでから初期画面を出す
        // （暗闇と初期フェードの二重感を消す）
        setTimeout(() => {
          onComplete?.();
        }, 120); // ← fadeLayer 0.2s に対してちょい早め
      });
    });
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 暗闇は最初から ON
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
