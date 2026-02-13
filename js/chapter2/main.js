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

const chapter = document.querySelector(".chapter");
const loader  = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots    = [...document.querySelectorAll(".dot")];

/**
 * ドットの更新
 */
function updateDots(index = 0) {
  const COUNT = dots.length;
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

/**
 * 次のチャプターへの遷移
 */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;
  playExitTransition({
    onFinish() {
      // 完全に消す（CPU負荷ゼロ）
      chapter?.classList.remove("visible", "active");
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

// カルーセルの初期化
const carousel = initCarousel3D({
  onIndexChange(index) { updateDots(index); },
  onExit() { goChapter25(); }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

/**
 * ローダー完了時の処理
 */
initLoader(loader, () => {
  if (carousel && chapter) {
    // 1. 存在を有効化（display: block/flex）
    chapter.classList.add("active");
    
    carousel.reset(0.22);
    carousel.start();

    // 2. 1フレーム待ってからフェードイン（opacity）
    requestAnimationFrame(() => {
      chapter.classList.add("visible");
      dotsWrap?.classList.add("visible");
    });
    
    startAutoTransition(goChapter25);
  }
});

initGlitchLayer?.();

/**
 * ブラウザの「戻る」ボタン対応（bfcache対応）
 */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  // 状態のリセット
  resetTransitionState();
  goChapter25._done = false;
  
  // 見た目と描画のリセット
  if (chapter) {
    chapter.classList.add("active"); // display復活
    chapter.style.opacity = "1";
    requestAnimationFrame(() => chapter.classList.add("visible"));
  }

  // カルーセルの再始動
  if (window.__carousel__) {
    window.__carousel__.stop();
    window.__carousel__.reset(0.22);
    window.__carousel__.start();
  }

  if (dotsWrap) {
    dotsWrap.classList.add("visible");
    dotsWrap.style.opacity = "1";
  }
  
  // オーバーレイ（フェードアウト用）を消す
  const overlay = document.getElementById("fadeout");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.classList.remove("active");
  }

  // 自動遷移タイマーを再始動
  startAutoTransition(goChapter25);
});

bindLongPressEvents(document.body);

  // 自動遷移タイマーを再始動
  startAutoTransition(goChapter25);
});

bindLongPressEvents(document.body);
