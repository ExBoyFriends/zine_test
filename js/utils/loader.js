/*  loader.js */

export function initLoader(loader, onComplete) {
  let finished = false;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  const safeComplete = () => {
    if (finished) return;
    finished = true;

    if (loader) loader.style.display = "none";
    onComplete?.();
  };
///////////////////////////////////////////////////////////////
  const finish = () => {
  if (finished) return;

  if (fadeLayer) {
    // 動きは止めるが、真っ黒な状態(opacity:1)をキープする
    fadeLayer.style.animation = "none";
    fadeLayer.style.opacity = "1"; 
  }
  
  if (loader) loader.style.display = "none";
  
  safeComplete(); // これで main.js の処理が始まる
};

  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
      fadeLayer.style.opacity = "1";
    }

    // 9.4秒後に本編へ
    setTimeout(finish, 5400);/////////////////////////////////////////////////
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    if (loader) loader.style.display = "none";
    if (fadeLayer) {
      fadeLayer.style.animation = "none";
      fadeLayer.classList.add("hide");
    }
    safeComplete();
  });
}
