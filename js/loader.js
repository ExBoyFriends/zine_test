//loader.js

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

    // siren を「明」で止める
    loader.style.animation = "none";
    loader.style.filter = "brightness(1)";

    // loader 自体を消す
    loader.style.opacity = "0";

    // 次の描画で切り替え
    requestAnimationFrame(() => {
      loader.style.display = "none";

      // 闇を一瞬で抜く
      fadeLayer?.classList.add("hide");

      // 初期画面確定
      onComplete?.();
    });
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 暗闇は最初から ON
    fadeLayer?.classList.remove("hide");

    // ローディング時間
    setTimeout(() => {
      loader.addEventListener("transitionend", finish, { once: true });

      // 念のため
      setTimeout(finish, 1200);
    }, 4000);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
