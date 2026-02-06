/**
 * loader.js
/**
 * loader.js
 * 役割：左上からの劇的なスポットライト演出を制御。
 * 画像は静止。濁った白の光が鋭く明滅し、最後は深い闇へ溶ける演出を管理。
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

    // main.js側のコールバック（本編開始処理）を呼び出す
    if (typeof onComplete === "function") {
      onComplete();
    }
  };

  /**
   * ローディング終了演出
   * 8.4秒後、明滅を止めて画像と光を同時に消し去る
   */
  const finish = () => {
    if (finished) return;

    // 終了フェードアウト：2.0秒かけて重厚に闇へ沈める
    const fadeStyle = "opacity 2.0s cubic-bezier(0.4, 0, 0.2, 1)";

    if (loader) {
      loader.style.transition = fadeStyle;
      loader.style.opacity = "0";
    }

    if (fadeLayer) {
      // CSSアニメーションを即座に停止し、フェードアウトに干渉させない
      fadeLayer.style.animation = "none";
      fadeLayer.style.transition = fadeStyle;
      fadeLayer.style.opacity = "0";
    }

    // 完全に消えきる一歩手前（1.4秒後）で本編を開始させ、滑らかに繋ぐ
    setTimeout(safeComplete, 1400); 
  };

  /**
   * 演出開始
   */
  const start = () => {
    if (finished) return;

    // ローダーを表示
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
    }

    // 光の層の準備（もしCSSで hide が設定されていれば解除）
    if (fadeLayer) {
      fadeLayer.classList.remove("hide");
      // HTML構造に関わらず見えるよう、念のため最前面へ
      fadeLayer.style.zIndex = "10001";
    }

    // 8.4秒間演出をループ。明滅のテンポ（2.2s周期）と合わせ、約4回弱の鼓動
    setTimeout(finish, 8400);
  };

  // ページのロード状況を確認して実行
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // bfcache（戻るボタン）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      safeComplete();
    }
  });
}
