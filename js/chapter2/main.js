// chapter2/main.js
import "../base.js";
import { initLoader } from "../loader.js";
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
   bfcache 対応
===================== */
window.addEventListener("pageshow", e => {
  if (e.persisted) {
    resetTransitionState();
  }
});

/* =====================
   DOM
===================== */
const scene    = document.querySelector(".scene");
const chapter  = document.querySelector(".chapter"); // ★ 追加
const loader   = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/* =====================
   Dots
===================== */
function updateDots(index = 0) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Chapter2 → 2.5
===================== */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;

  playExitTransition({
    onFinish() {
      location.href = "../chapter2_5/index.html";
    }
  });
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {

  // ★ 世界を表示（これが無かった）
  chapter?.classList.add("visible");

  // ---- 長押し bind（1回だけ） ----
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }

  // ---- dots 表示 ----
  dotsWrap?.classList.add("visible");

  // ---- 自動遷移（放置対策） ----
  startAutoTransition(() => {
    goChapter25();
  });
});

/* =====================
   Carousel
===================== */
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  }
});

if (carousel) {
  // holdTransition / transitionOut 用
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

