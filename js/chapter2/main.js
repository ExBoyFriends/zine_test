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
  // --- 1. 計算だけを先に済ませる ---
  if (carousel) {
    carousel.start(); 
  }

  // --- 2. 幕が開く「直前」に姿を現すように予約する ---
  setTimeout(() => {
    chapter?.classList.add("visible");
    dotsWrap?.classList.add("visible");
    
    const backCyl = document.querySelector(".cylinder-back");
    if (backCyl) backCyl.style.visibility = "visible";
  }, 1000); 

  // 自動遷移の予約（ここを initLoader の中に入れる）
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

