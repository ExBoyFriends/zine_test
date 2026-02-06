/**
 * loader.js
 * 役割：鋭い闇の明滅演出。最後は画面を完全に飲み込み、本編へ繋ぐ。
 * 戻るボタン（bfcache）での再訪時も演出を再実行する。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    // 本編を裏側で配置・起動（闇が満ちる前に呼ぶ）
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // ★闇が広がり始めたらすぐに裏側で本編をスタンバイ
    setTimeout(safeComplete, 200); 

    // 完全に闇が満ちた(2.0s後)タイミングで「夜明け」を開始
    setTimeout(() => {
      if (loader) {
        // 1.5秒かけて、霧が晴れるようにゆっくりと本編を露出させる
        loader.style.transition = "opacity 1.5s ease-in-out";
        loader.style.opacity = "0";
      }
      
      // フェード完了後、物理的に非表示にする
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 1500); 
    }, 2000); 
  };

  const start = () => {
    finished = false; // フラグのリセット

    if (loader) {
      loader.classList.remove("swallow-darkness");
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.transition = "none"; // 前回の状態をリセット
    }
    if (fadeLayer) {
      fadeLayer.style.display = "block";
    }

    // 8.4秒間の演出。終了後に暗転へ
    setTimeout(finish, 8400);
  };

  // ページロード時の初回実行
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ★戻るボタン（bfcache）対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      start(); 
    }
  });
}
