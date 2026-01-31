import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState,
  setHoldEffects
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";

/* =====================
   初期化
===================== */

const loader = document.getElementById("loader");
initLoader(loader);

// カルーセル生成
const carousel = initCarousel3D();
window.__carousel__ = carousel;

// ドラッグ入力
initDragInput(carousel);

// DOM
const scene  = document.querySelector(".scene");
const glitch = document.querySelector(".glitch-overlay");

/* =====================
   Chapter2 → 2.5
===================== */

function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;

  playExitTransition({
    onFinish: () => {
      location.href = "chapter2_5.html";
    }
  });
}

/* =====================
   長押し演出
===================== */

setHoldEffects({
  glitchStart: () => {
    glitch?.classList.add("glitch-active");
    carousel.setExtraSpeed(1.5);
  },
  glitchEnd: () => {
    glitch?.classList.remove("glitch-active");
    carousel.setExtraSpeed(0);
  }
});

/* =====================
   強制遷移
===================== */

window.addEventListener("force-exit", goChapter25);

/* =====================
   ページ表示
===================== */

window.addEventListener("pageshow", () => {
  resetTransitionState();
  startAutoTransition(goChapter25);
  bindLongPressEvents(scene);
});
