/**
 * loader.js
 * 役割：8.4秒間のサイレン風・光演出と、本編へのスムーズなリレー
 */
export function initLoader(loader, onComplete) {
  let finished = false;

  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  // 本編へ移行する最終処理
  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) loader.style.display = "none";
    if (typeof onComplete === "function") onComplete();
  };

  // 終了演出：光をゆっくり消しながら本編を準備
  const finish = () => {
    if (finished) return;

    // ローダー画像をゆっくり消す（1.5秒の余韻）
    if (loader) {
      loader.style.transition = "opacity 1.5s ease";
      loader.style.opacity = "0";
    }

    // 光の鼓動を止め、静かに透明へ戻す（1.8秒の長い余韻）
    if (fadeLayer) {
      fadeLayer.style.animation = "none";
      fadeLayer.style.transition = "opacity 1.8s ease";
      fadeLayer.style.opacity = "0";
    }

    // フェードアウトの完了を見届けてから本編開始
    setTimeout(safeComplete, 1200); 
  };

  const start = () => {
    if (finished) return;
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }
    // 8.4秒間、世界観に浸らせる
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache（戻るボタン）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) safeComplete();
  });
}
