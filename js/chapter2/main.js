import { initLoader } from "./loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";

/* =====================
   初期化
===================== */
const loader = document.getElementById("loader");
initLoader(loader);

const carousel = initCarousel3D();
initDragInput(carousel);

// transitionOut から参照できるように
window.__carousel__ = carousel;

/* =====================
   Chapter2 → 2.5
===================== */
const scene = document.querySelector(".scene");

const goChapter25 = () => {
  playExitTransition({
    onFinish: () => {
      location.href = "chapter2_5.html";
    }
  });
};

/* =====================
   ページ表示時
===================== */
window.addEventListener("pageshow", () => {
  resetTransitionState();
  startAutoTransition(goChapter25);
  bindLongPressEvents(scene);
});


