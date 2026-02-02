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

    /* ローディング演出を「明」で止める */
    loader.style.animation = "none";
  //  loader.style.filter = "brightness(1)";
    loader.style.opacity = "0";

    requestAnimationFrame(() => {
      // loader 完全終了
      loader.style.display = "none";

      // 闇フェード開始
      fadeLayer?.classList.add("hide");

      // ★ 闇が少し残っている瞬間に画像フェード開始
      setTimeout(() => {
        onComplete?.();
      }, 60);   ///////////////////////////////////////////////////////
    });
  };

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";
    fadeLayer?.classList.remove("hide");

    setTimeout(() => {
      loader.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 1200);
    }, 4000);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
