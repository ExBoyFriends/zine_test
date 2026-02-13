/**
 * loader.js (暗転・初期化同期最適化版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

  const finish = () => {
    if (completed) return;
    completed = true;

    // 1. まず暗転演出 (暗闇) を開始
    // ここで CSS の swallow-darkness アニメーションが動き出す
    loader.classList.add("swallow-darkness");

    // 2. 暗闇が画面を完全に覆い尽くすまで「しっかり待つ」 (2.0秒)
    // 以前の 1.2秒だと、アニメーションの途中で JS が割り込み、フリーズが見えてしまっていました
    setTimeout(() => {
      
      const chapter = document.querySelector(".chapter");
      if (chapter) {
        console.log("Loader: Activating chapter behind the darkness...");
        chapter.classList.add("active");
        void chapter.offsetWidth; // リフロー強制（暗闇の中で済ませる）
      }

      // 3. 暗闇に包まれた「凪」の状態で、重い初期化処理を実行
      // この時ブラウザがフリーズしても、画面は真っ暗なのでユーザーにはバレません
      console.log("Loader: Executing onComplete in silence...");
      if (onComplete) {
        try {
          onComplete();
        } catch (e) {
          console.error("Loader: Error in onComplete:", e);
        }
      }

      // 4. 計算がすべて終わった後、一呼吸おいてから「幕を開ける」
      // requestAnimationFrame を重ねて、JSの計算が終わったことをブラウザに確信させる
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log("Loader: Revealing start...");
            loader.classList.add("reveal-start");
            loader.style.opacity = "0";
            if (shadow) shadow.style.opacity = "0";

            // 5. 完全に消えたらDOMから削除
            setTimeout(() => {
              loader.remove();
            }, 3000);
          }, 600); // 計算終了後の余韻（カクつき防止のバッファ）
        });
      });

    }, 2000); // 暗闇が完全に定着するまでの待ち時間
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    
    // ★ 修正ポイント: ローディングをもっと長く見せたいという希望に合わせ 7000 (7秒)
    // ここを増やすことでロゴのアニメーション時間を確保します
    setTimeout(finish, 7000); 
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
}
