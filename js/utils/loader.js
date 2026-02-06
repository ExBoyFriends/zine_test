/**
 * loader.js
 * 役割：8.4sの鼓動後、1.0sで右下から暗転し、
 * その後2.8sかけて右下へ引き波のように消えていく夜明けを制御。
 */
export function initLoader(loader, onComplete) {
  let finished = false;
  const fadeLayer = document.getElementById("fadeLayer");

  // 本編開始のトリガー（暗転が始まった直後に呼ぶ）
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

    // 200ms後に本編準備（カード表示など）を開始
    setTimeout(safeComplete, 200); 

    // 1.0秒後：真っ暗になった瞬間
    setTimeout(() => {
      if (loader) {
        // [修正ポイント] 
        // 1. reveal-startを付与して「引き」のアニメを開始
        loader.classList.add("reveal-start");
        
        // 2. loader全体をじわじわ消す
        loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
        loader.style.opacity = "0";

        // [カクつき・残像対策] 
        // 影の計算（blurとradial-gradient）をこの瞬間に裏側で殺す
        if (fadeLayer) {
           // 0.1秒だけ待ってから、影の描画計算をOFFにする
           setTimeout(() => {
             fadeLayer.style.visibility = "hidden"; 
           }, 100);
        }
      }
      
      // 全体が消え去るタイミング
      setTimeout(() => {
        if (loader) loader.style.display = "none";
      }, 2800); 
    }, 1000); 
  };

  // ローダーの初期化と開始
  const start = () => {
    finished = false; 
    if (loader) {
      // 状態をリセット
      loader.classList.remove("swallow-darkness", "reveal-start");
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.transition = "none";
    }
    if (fadeLayer) {
      fadeLayer.style.display = "block";
    }
    
    // 8.4秒間のローディング鼓動演出ののち、終了プロセス（finish）へ
    setTimeout(finish, 8400);
  };

  // ページ読み込み完了時に実行
  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }

  // ブラウザの戻るボタン対策
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) start();
  });
}
