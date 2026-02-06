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
    
    // 1. 【暗転開始】右下から楕円が中央へ広がり、画面を飲み込む
    if (loader) {
      loader.classList.add("swallow-darkness");
    }

    // わずかに遅らせて本編の準備（カード等の描画）を裏で開始
    setTimeout(safeComplete, 200); 

    // 2. 【1.0秒後：真っ暗な瞬間】夜明け（引き波）を開始
    setTimeout(() => {
      if (loader) {
        // 右下へ引き返すアニメーションを起動
        loader.classList.add("reveal-start");
        
        // ローダー全体の透明度も下げていく
        loader.style.transition = "opacity 2.8s cubic-bezier(0.2, 1, 0.2, 1)";
        loader.style.opacity = "0";
      }
      
      // 3. 【3.8秒後（1.0+2.8s）】すべてが明けきったら要素を完全に消去
      setTimeout(() => {
        if (loader) {
          loader.style.display = "none";
        }
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
