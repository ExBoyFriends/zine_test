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

const carousel = initCarousel3D();
initDragInput(carousel);

const scene = document.querySelector(".scene");
const glitch = document.querySelector(".glitch-overlay");

/* =====================
   Chapter2 → 2.5
===================== */

const goChapter25 = () => {
  playExitTransition({
    onComplete: () => {
      location.href = "chapter2_5.html";
    }
  });
};

/* =====================
   長押し演出
===================== */

setHoldEffects({
  glitchStart: () => {
    glitch.classList.add("glitch-active");
    carousel.setExtraSpeed(1.4);
  },
  glitchEnd: () => {
    glitch.classList.remove("glitch-active");
    carousel.setExtraSpeed(0);
  }
});

/* =====================
   ページ表示時
===================== */

window.addEventListener("pageshow", () => {
  resetTransitionState();
  startAutoTransition(goChapter25);
  bindLongPressEvents(scene);
});


