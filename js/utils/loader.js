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
    if (loader) loader.classList.add("swallow-darkness");

    setTimeout(safeComplete, 200); 

    // 1.0秒後（真っ暗になった瞬間）
    setTimeout(() => {
      if (loader) {
        if (fadeLayer) fadeLayer.style.display = 'none';

        // 鼓動に合わせるため、出だしを速く、後半を極めて遅くしたイージング
        loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
        loader.style.opacity = "0";
      }
      
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 2800); 
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
