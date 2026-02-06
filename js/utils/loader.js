/**
 * loader.js
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

    // 2.0秒かけて深い闇に沈める
    setTimeout(() => {
      if (loader) {
        loader.style.transition = "opacity 1.0s ease-out";
        loader.style.opacity = "0";
      }
      setTimeout(safeComplete, 400);
    }, 2000);
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

    // 8.4秒間で約8回の激しい明滅
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
