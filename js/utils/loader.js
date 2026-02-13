/**
 * loader.js (アニメーション保護・非同期実行版)
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  const shadow = document.getElementById("loader-shadow");

  const finish = () => {
    if (completed) return;
    completed = true;

    // 1. 暗転アニメ開始
    loader.classList.add("swallow-darkness");

    // 2. 暗闇が広がりきるのを待つ
    setTimeout(() => {
      const chapter = document.querySelector(".chapter");
      if (chapter) {
        chapter.classList.add("active");
        void chapter.offsetWidth;
      }

      // 【根本解決のポイント】
      // すぐに onComplete を呼ばず、ブラウザが「一息つく」隙間を強制的に作る。
      // setTimeout(..., 0) や Promise を使うことで、
      // 描画（アニメーション）の隙間に処理をねじ込みます。
      
      console.log("Loader: Processing heavy tasks in chunks...");
      
      const runHeavyTasks = async () => {
        // 画像のデコードや初期化を「非同期」で実行させる
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (onComplete) {
          try {
            onComplete();
          } catch (e) {
            console.error(e);
          }
        }
        
        // 3. 全ての計算が終わってから、さらに一瞬待って幕を開ける
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log("Loader: Revealing start...");
            loader.classList.add("reveal-start");
            loader.style.opacity = "0";
            if (shadow) shadow.style.opacity = "0";

            setTimeout(() => {
              loader.remove();
            }, 3000);
          }, 800);
        });
      };

      runHeavyTasks();
    }, 2000); 
  };

  const start = () => {
    if (!document.body.contains(loader)) return;
    setTimeout(finish, 6500); 
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
}
