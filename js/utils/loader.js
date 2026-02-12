/**
 * loader.js (配置完了待ち・完全版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

  const finish = () => {
    if (completed) return;
    completed = true;

    // 1. まず暗転させる (1秒かけて真っ暗にする)
    loader.classList.add("swallow-darkness");

    // 2. 暗転が完了した「静寂の暗闇」の中で処理を行う
    setTimeout(() => {
      if (onComplete) {
        // ここで 3D の配置計算（animate）が実行される
        onComplete();
      }

      /* ========================================================
         【ここが重要】
         onComplete() を呼んだ直後ではなく、
         ブラウザが「3Dの配置が終わったな」と描画を更新するまで
         あえて「あと 0.8秒」暗闇を維持します。
         ======================================================== */
      setTimeout(() => {
        // 3. 全てが整ってから「夜明け」を開始
        loader.classList.add("reveal-start");
        
        // JSでの直接指定を minimal にし、CSSの transition を優先させる
        loader.style.opacity = "0";
        if (shadow) shadow.style.opacity = "0";

        // 4. 完全に消えたら要素を削除
        setTimeout(() => {
          loader.style.display = "none";
          if (loader.parentNode) loader.remove();
        }, 3000); // 2.8s の transition 終了後
        
      }, 800); // ← この 0.8秒が「重なり」を闇に葬る魔法の時間

    }, 1200); // 暗転完了（1.0s）に少し余裕を持たせた時間
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    setTimeout(finish, 5200); // 鼓動の時間
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}
