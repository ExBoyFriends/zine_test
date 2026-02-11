// chapter2/main.js

import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js"; // 追加
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
  // 共通の開始処理へ
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

      // 3. Carouselの起動（あれば）
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
   イベントリスナー
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  transitionDone = false;
  window.__carousel__?.stop?.();
});

window.addEventListener("force-exit", () => {
  goChapter25();
});
