/*  loader.js */

export function initLoader(loader, onComplete) {
  let finished = false;
  let animId = null;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  const safeComplete = () => {
    if (finished) return;
    finished = true;

    if (loader) loader.style.display = "none";
    cancelAnimationFrame(animId);

    fadeLayer?.classList.add("hide");
    fadeLayer.style.pointerEvents = "none";

    onComplete?.();
  };

  // 画像点滅ループ
  const blink = () => {
    if (finished) return;
    const img = loader.querySelector("img");
    if (!img) return;

    img.style.opacity = img.style.opacity === "1" ? "0.2" : "1";
    animId = requestAnimationFrame(() => setTimeout(blink, 150)); // 150ms周期
  };

  const finish = () => {
    if (finished) return;

    // fadeLayer をフェードアウト
    if (fadeLayer) {
      fadeLayer.classList.add("hide");
      fadeLayer.style.pointerEvents = "none";
    }

    safeComplete();
  };

  const start = () => {
    if (finished) return;

    // ローディング表示
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // fadeLayer 表示
    fadeLayer?.classList.remove("hide");

    blink(); // 点滅開始

    // ローディング表示時間（例：2.5秒）
    setTimeout(finish, 2500);
  };

  // ページロード完了時
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache 復帰時
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;

    if (loader) {
      loader.style.display = "none";
      loader.style.opacity = "0";
    }

    fadeLayer?.classList.add("hide");
    safeComplete();
  });
}
