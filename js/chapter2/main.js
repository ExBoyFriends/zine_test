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
import { fadeOutAndGo, fadeInStart } from "../utils/fade.js";

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
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;

  // 独自 exit アニメーションで遷移
  playExitTransition({
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

/* =====================
   Loader & 初期化
===================== */
initLoader(loader, () => {
  // 1. 3Dシーンのイベント設定
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }

  // 2. 【重要修正】3Dの配置計算が完了するのを待ってから表示を開始する
  // 50ms待機させることで、JS側の animate() が最低1回走り、
  // 正しい位置（奥側）に配置された状態で「visible」になります。
  setTimeout(() => {
    // ここで初めて 3D シーンとドットを表示（CSSの transition 2.8s が発動）
    chapter?.classList.add("visible");
    dotsWrap?.classList.add("visible");

    // 3. 黒い幕（fadeLayer）をじわ〜っと開ける
    fadeInStart(1500); 
  }, 50);

  // 4. 自動遷移のタイマー開始
  startAutoTransition(goChapter25);
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
   bfcache / 戻ったとき
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  window.__carousel__?.stop?.();
});

/* =====================
   強制 exit（長押し完遂）
===================== */
window.addEventListener("force-exit", () => {
  goChapter25();
});

