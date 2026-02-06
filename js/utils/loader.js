/**
 * loader.js
 * 役割：1.0sの鋭い暗転から、2.5sの贅沢な夜明けを演出する。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  const safeComplete = () => {
    if (finished) return;
    finished = true;
    if (typeof onComplete === "function") onComplete();
  };

  const finish = () => {
    if (finished) return;

    if (loader) {
      // 1.0s の暗転アニメーション開始
      loader.classList.add("swallow-darkness");
    }

    // 闇が広がり始めたらすぐに裏側で本編を準備
    setTimeout(safeComplete, 200); 

    // 暗転が完了する「1.0秒後」に夜明けを開始
    setTimeout(() => {
      if (loader) {
        // JSから transition と opacity を強制指定して
        // 2.5秒のゆっくりしたフェードアウトを確実に実行させる
        loader.style.transition = "opacity 2.5s ease-in-out";
        loader.style.opacity = "0";
      }
      
      // フェードが完全に終わる 2.5s 後に要素を消去
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 2500); 
    }, 1000); 
  };

  const start = () => {
    finished = false; 
    if (loader) {
      loader.classList.remove("swallow-darkness");
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.transition = "none";
    }
    if (fadeLayer) {
      fadeLayer.style.display = "block";
    }
    
    // 8.4秒間のローディング演出
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
