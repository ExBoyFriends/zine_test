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

/* =====================
   bfcache 対応
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // hold / auto 状態をリセット
  resetTransitionState();

  // ★ これが致命的に足りなかった
  goChapter25._done = false;

  // ★ 自動遷移を必ず再スタート
  startAutoTransition(goChapter25);
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
      import("./holdTransition.js").then(m => {
        m.markExited();
      });
      location.href = "../HTML/chapter2_5.html";
    }
  });
}

// ★ 初期化
goChapter25._done = false;

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  chapter?.classList.add("visible");

  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }

  dotsWrap?.classList.add("visible");

  startAutoTransition(goChapter25);
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

