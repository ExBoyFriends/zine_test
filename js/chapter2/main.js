// chapter2/main.js

import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import { initGlitchLayer } from "./effects.js";

/* =====================
   DOM
===================== */
const scene    = document.querySelector(".scene");
const chapter  = document.querySelector(".chapter");
const loader   = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/* =====================
   Dots
===================== */
function updateDots(index = 0) {
  const COUNT = dots.length;
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

/* =====================
   Chapter2 → 2.5 自動遷移
===================== */
let transitionDone = false;
function goChapter25() {
  if (transitionDone) return;
  transitionDone = true;

  // ※ carousel3d.js 側で mode = "exit" になり、加速が始まっている状態で呼ばれます
  playExitTransition({
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}

/* =====================
   Loader & 初期化
===================== */
initLoader(loader, () => {
  startChapter({
    chapter,
    dots: dotsWrap,
    onStart() {
      // 1. 3Dシーンのイベント設定
      if (scene && !scene.__holdBound) {
        bindLongPressEvents(scene);
        scene.__holdBound = true;
      }

      // 2. 自動遷移のタイマー開始
      startAutoTransition(goChapter25);

      // 3. Carouselの起動
      if (window.__carousel__ && window.__carousel__.start) {
        window.__carousel__.start();
      }
    }
  });
});

/* =====================
   Carousel 3D
===================== */
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  },
  onExit() {
    goChapter25();
  }
});

if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

/* =====================
   Glitch 初期化
===================== */
initGlitchLayer?.();

/* =====================
   イベントリスナー（戻ってきた時の処理）
===================== */
window.addEventListener("pageshow", e => {
  // ブラウザの「戻る」で来た場合のみ実行
  if (!e.persisted) return;

  // 1. 各種フラグを「未完了」に戻す
  resetTransitionState();
  transitionDone = false;

  // 2. カルーセルの状態をリセット
  // carousel3d.js 側の pageshow イベントで baseSpeed = 16 がセットされ、
  // ここで再始動することで「高速からの急減速」が描画されます
  if (window.__carousel__) {
    window.__carousel__.stop?.();
    window.__carousel__.start?.();
  }

  // 3. 【最重要】止まっていた「自動遷移タイマー」を最初からやり直す
  startAutoTransition(goChapter25);
});

window.addEventListener("force-exit", () => {
  goChapter25();
});
