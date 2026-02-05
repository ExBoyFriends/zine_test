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
import { fadeOutAndGo, fadeInStart } from "../utils/fade.js";
import { initGlitchLayer } from "./effects.js";

/* =====================
   bfcache 対応
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  startAutoTransition(goChapter25);
});

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
  // インデックスを反転させる (0->4, 1->3, 2->2, 3->1, 4->0)
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

/* =====================
   Chapter2 → 2.5
===================== */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;
  
  fadeOutAndGo(() => {
    location.href = "../HTML/chapter2_5.html";
  });
}
goChapter25._done = false;


/* =====================
   Loader 完了 chapter2専用
===================== */
initLoader(loader, () => {
  chapter?.classList.add("visible");
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
  dotsWrap?.classList.add("visible");
   // 冒頭フェードイン
  fadeInStart();

  // 自動遷移開始
  startAutoTransition(goChapter25);
});


/* =====================
   Carousel
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
   強制 exit（長押し完遂）
===================== */
window.addEventListener("force-exit", () => {
  goChapter25();
});
