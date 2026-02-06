/**
 * loader.js
 /**
 * loader.js
 * 役割：左上からの劇的なスポットライト演出を制御。
 * 画像は静止。光の明滅周期と、終了時のスムーズなフェードアウトを管理。
 */
export function initLoader(loader, onComplete) {
  let finished = false;

  // 光の層（fadeLayer）の取得
  const fadeLayer =
    document.getElementById("fadeLayer") ||
    document.getElementById("fadeout") ||
    null;

  /**
   * 本編を開始する最終処理
   */
  const safeComplete = () => {
    if (finished) return;
    finished = true;

    if (loader) {
      loader.style.display = "none";
    }

    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * 終了演出
   * 画像と光を、2.5秒かけて深い余韻とともにフェードアウト
   */
  const finish = () => {
    if (finished) return;

    // 終了時はさらに重厚なイージングで闇に沈める
    const fadeStyle = "opacity 2.5s cubic-bezier(0.2, 0, 0.2, 1)";

    if (loader) {
      loader.style.transition = fadeStyle;
      loader.style.opacity = "0";
    }

    if (fadeLayer) {
      fadeLayer.style.animation = "none";
      fadeLayer.style.transition = fadeStyle;
      fadeLayer.style.opacity = "0";
    }

    // フェードが完了する前に、本編の表示（fadeIn）を開始させる
    setTimeout(safeComplete, 1800); 
  };

  /**
   * 演出開始
   */
  const start = () => {
    if (finished) return;

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
    }

    // 8.4秒間（約3回分の脈動）を堪能させてから終了
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ブラウザの戻るボタン対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      safeComplete();
    }
  });
}
