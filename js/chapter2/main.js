// chapter2/main.js
import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import { initGlitchLayer } from "./effects.js";

const chapter  = document.querySelector(".chapter");
const loader   = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/**
 * インデックスに合わせてドットの表示を更新
 */
function updateDots(index = 0) {
  const COUNT = dots.length;
  // カルーセルの回転方向（右回り/左回り）に合わせて反転が必要な場合の処理
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

/**
 * 次のチャプターへ遷移
 */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;
  playExitTransition({
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

// 1. カルーセルの初期化
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  },
  onExit() {
    goChapter25();
  }
});

// 2. グローバル登録と入力イベントのバインド
if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  // 初期位置のドットをセット
  updateDots(0);
}

// 3. ローダー完了後のシーケンス
initLoader(loader, () => {
  // main.js の中で cylinder を再取得するか、carousel から取得できるようにします
  const cylinder = document.querySelector(".main-cylinder");

  if (carousel && cylinder) {
    // 1. まず座標計算を1回実行（この時 cylinder は opacity 0 なので見えません）
    carousel.reset(0.22); 
    carousel.start();
    
    // 2. ブラウザに「今の座標（transform）を即座に適用して」と強制命令（リフロー）
    // これにより CSS の初期値との「ジャンプ」を防ぎます
    void cylinder.offsetWidth; 


    requestAnimationFrame(() => {
      chapter?.classList.add("visible");
      cylinder.classList.add("cylinder-ready"); // ここで初めて表示！
      dotsWrap?.classList.add("visible");
    });
  } 

  startAutoTransition(goChapter25);
});

// 4. その他のレイヤー初期化
initGlitchLayer?.();

// 5. ブラウザの「戻る」ボタン（bfcache）対策
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  // 停止している可能性があるので一度止めてから再開できるように備える
  window.__carousel__?.stop?.();
});

// デバッグ・強制遷移用
window.addEventListener("force-exit", () => {
  goChapter25();
});
