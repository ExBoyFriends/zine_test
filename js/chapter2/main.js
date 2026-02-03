// chapter2/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState,
  setHoldEffects
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import {
  initGlitchLayer,
  startGlitch,
  stopGlitch
} from "./effects.js";

/* =====================
   DOM
===================== */
const scene     = document.querySelector(".scene");
const loader    = document.getElementById("loader");
const fadeLayer = document.getElementById("fadeLayer");

const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/* =====================
   長押し bind（初回のみ）
===================== */
function bindHoldOnce() {
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
}
bindHoldOnce();

/* =====================
   Dots
===================== */
function updateDots(index = 0) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Carousel
===================== */
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  }
});

if (carousel) {
  initDragInput(carousel);
  updateDots(0); // 初期dot保証
}

/* =====================
   Glitch
===================== */
initGlitchLayer?.();

/* =====================
   Chapter2 → 2.5
===================== */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;

  playExitTransition({
    onFinish() {
      location.href = "chapter2_5.html";
    }
  });
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  dotsWrap?.classList.add("visible");
  updateDots(0);
  startAutoTransition?.(goChapter25);
});

/* =====================
   長押し演出
===================== */
setHoldEffects({
  glitchStart() {
    startGlitch();
    carousel?.setExtraSpeed?.(1.5);
  },
  glitchEnd() {
    stopGlitch();
    carousel?.setExtraSpeed?.(0);
  }
});

/* =====================
   強制遷移
===================== */
window.addEventListener("force-exit", goChapter25);

/* =====================
   pageshow（bfcache）
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  resetTransitionState?.();
  goChapter25._done = false;

  stopGlitch();
  carousel?.setHolding?.(false);
  carousel?.setExtraSpeed?.(0);

  fadeLayer?.classList.add("hide");

  dotsWrap?.classList.add("visible");
  updateDots(carousel?.getIndex?.() ?? 0);

  startAutoTransition?.(goChapter25);
  bindHoldOnce();
});
