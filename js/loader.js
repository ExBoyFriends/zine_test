// loader.js

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

    /* ===== ローディング演出を明で止める ===== */
    loader.style.animation = "none";
    loader.style.filter = "brightness(1)";
    loader.style.opacity = "0";

    /* ===== 同期ポイント ===== */
    requestAnimationFrame(() => {
      // loader 演出はここで完全終了
      loader.style.display = "none";

      // ① まだ暗闇のまま初期画面を出す
      onComplete?.();

      // ② 次フレームで闇を抜く（フェード）
      requestAnimationFrame(() => {
        fadeLayer?.classList.add("hide");
      });
    });
  };

  const start = () => {
    // loader 表示
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 暗闇は最初から ON
    fadeLayer?.classList.remove("hide");

    // ローディング表示時間
    setTimeout(() => {
      loader.addEventListener("transitionend", finish, { once: true });

      // 保険（transitionend が来ない場合）
      setTimeout(finish, 1200);
    }, 4000);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}

