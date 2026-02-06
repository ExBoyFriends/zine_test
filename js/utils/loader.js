/**
 * loader.js
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
      // 1. 暗闇の侵食開始（1.0sで真っ暗に）
      loader.classList.add("swallow-darkness");
    }

    // 裏側で本編を準備（ここはそのまま）
    setTimeout(safeComplete, 200); 

    // 2. 鼓動のテンポに合わせて「1.0s後」に夜明けを開始
    setTimeout(() => {
      if (loader) {
        // CSS側で設定した transition: opacity 2.5s が効きます
        loader.style.opacity = "0";
      }
      
      // 3. 2.5sかけてゆっくりフェードが終わるのを待つ
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 2500); 
    }, 1000); // ここを1.0sに短縮
  };

  const start = () => {
    finished = false; 
    if (loader) {
      loader.classList.remove("swallow-darkness");
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.transition = "none";
    }
    if (fadeLayer) fadeLayer.style.display = "block";
    
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
