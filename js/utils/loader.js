/**
 * loader.js
 
 * 役割：忍び寄る闇の演出。最後は画面を完全に飲み込み、本編へ繋ぐ。
 * 戻るボタン（bfcache）での再訪時も演出を再実行する。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (loader) loader.style.display = "none";
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // 闇が広がりきった直後（1.0秒後）にフェードアウト開始
    setTimeout(() => {
      if (fadeLayer) {
        // 残像防止のためレイヤーを物理的に隠す
        fadeLayer.style.display = "none";
      }

      if (loader) {
        loader.style.transition = "opacity 0.6s ease-out";
        loader.style.opacity = "0";
      }

      // ローダーが完全に消えきる直前に背後で本編（背景アニメ）を起動
      setTimeout(safeComplete, 200); 
    }, 1000); 
  };

  const start = () => {
    finished = false; // フラグのリセット

    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.classList.remove("swallow-darkness");
      loader.style.transition = "none"; // 前回のtransitionをクリア
    }
    if (fadeLayer) {
      fadeLayer.style.display = "block";
    }

    // 8.4秒間の演出。終了後にfinishへ
    setTimeout(finish, 8400);
  };

  // ページロード時
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ★戻るボタン（bfcache）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      start(); // 戻ってきたときも、再び闇の演出から始める
    }
  });
}
