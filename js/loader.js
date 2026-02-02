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

  // loader は即消す
  loader.style.display = "none";

  // 同じフレームで闇を抜ける
  fadeLayer?.classList.add("hide");

  // 次フレームで初期画面を確定
  requestAnimationFrame(() => {
    onComplete?.();
  });
};

  const start = () => {
    loader.style.display = "block";
    loader.style.opacity = "1";

    // 暗闇は最初から ON
    fadeLayer?.classList.remove("hide");

    // ローディング表示時間
   setTimeout(() => {
  // siren を止めて明るさ固定
  loader.style.animation = "none";
  loader.style.filter = "brightness(1)";

  // loader 演出をフェードアウト
  loader.style.opacity = "0";

  loader.addEventListener("transitionend", finish, { once: true });

  setTimeout(finish, 3000);
}, 4000);

  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}
