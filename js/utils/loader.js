//loader.js

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
      loader.classList.add("swallow-darkness");
    }

    // 闇が広がり始めた直後(0.2s)に裏で本編を配置
    setTimeout(safeComplete, 200); 

    // 完全に闇が満ちた(2.0s)タイミングで、夜明けのフェードを開始
    setTimeout(() => {
      if (loader) {
        // ここがご質問の「1.5秒かけてフェード」の設定です
        loader.style.transition = "opacity 1.5s ease-in-out";
        loader.style.opacity = "0";
      }
      
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 1500); 
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
    if (fadeLayer) fadeLayer.style.display = "block";
    setTimeout(finish, 8400);
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
