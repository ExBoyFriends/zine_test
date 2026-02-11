/**
 * loader.js
 * 安定版：8.4s鼓動 → 1.0s暗転 → 2.8s夜明けフェード → 本編開始
 * 初回ロード・戻る・bfcache復帰に対応
 */
export function initLoader(loader, onComplete) {
  if (!loader) return;

  let completed = false;
  let pulseTimer = null;
  let darkTimer = null;
  let hideTimer = null;

  const shadow = document.getElementById("loader-shadow");

  const clearAllTimers = () => {
    clearTimeout(pulseTimer);
    clearTimeout(darkTimer);
    clearTimeout(hideTimer);
  };

  const safeComplete = () => {
    if (completed) return;
    completed = true;
    onComplete?.();
  };

  const finish = () => {
    if (completed) return;
    loader.classList.add("swallow-darkness");
    safeComplete();

    darkTimer = setTimeout(() => {
      loader.classList.add("reveal-start");
      loader.style.transition = "opacity 2.8s cubic-bezier(0.2,1,0.2,1)";
      loader.style.opacity = "0";

      if (shadow) {
        shadow.style.transition = "opacity 2.8s ease-in-out";
        shadow.style.opacity = "0";
      }

      hideTimer = setTimeout(() => {
        loader.style.display = "none";
        loader.remove(); // 物理的に削除して干渉を防ぐ
      }, 2800);
    }, 1000);
  };

  const start = () => {
    // すでに動いている、または要素がない場合は何もしない
    if (!document.body.contains(loader) || pulseTimer) return;

    // 状態をリセットして表示
    clearAllTimers();
    completed = false;
    loader.classList.remove("swallow-darkness", "reveal-start");
    loader.style.opacity = "1";
    loader.style.display = "flex";
    if (shadow) {
      shadow.style.display = "block";
      shadow.style.opacity = "1";
    }
    void loader.offsetWidth;

    // ★ 鼓動演出を 4.2秒に設定
    pulseTimer = setTimeout(finish, 4200); 
  };

  // --- 実行の仕組みを「即時」に変更 ---
  // loadイベントを待つと永遠に終わらなくなるリスクがあるため、
  // ページが表示された瞬間にカウントダウンを開始します。
  start();

 // loader.js の一番下

// 実行のタイミングを「HTMLの解析が終わった直後」にずらす
setTimeout(() => {
  start();
}, 0); 

// 万が一の保険：8秒経っても終わってなければ強制終了
setTimeout(() => {
  if (!completed) finish();
}, 8000);

window.addEventListener("pageshow", (e) => {
  if (document.body.contains(loader)) start();
});

window.addEventListener("pagehide", clearAllTimers);
