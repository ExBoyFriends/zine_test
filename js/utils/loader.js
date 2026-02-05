/*  loader.js */
export function initLoader(loader, onComplete) {
  let finished = false;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  // すべての幕を閉じて本編へ渡す
  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) loader.style.display = "none";
    onComplete?.();
  };

  // 終了演出：光をゆっくり消しながら本編を準備
  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.style.transition = "opacity 1.2s ease";
      loader.style.opacity = "0";
    }

    if (fadeLayer) {
      fadeLayer.style.animation = "none"; // 鼓動を止める
      fadeLayer.style.transition = "opacity 1.5s ease";
      fadeLayer.style.opacity = "0"; // 静かに闇へ
    }

    // 1秒待ってから本編の fadeInStart を呼び出す
    setTimeout(safeComplete, 1000);
  };

  const start = () => {
    if (finished) return;
    if (loader) loader.style.display = "flex";
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }
    // 5.4秒間、光の鼓動を見せる
    setTimeout(finish, 5400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    safeComplete();
  });
}
