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
const scene   = document.querySelector(".scene");
const loader  = document.getElementById("loader");
const fadeLayer = document.getElementById("fadeLayer");

const dotsWrap = document.querySelector(".dots");
const dots = [...document.querySelectorAll(".dot")];

/* =====================
   長押し bind（初回ロード用）
===================== */
if (scene && !scene.__holdBound) {
  bindLongPressEvents(scene);
  scene.__holdBound = true;
}

/* =====================
   Dots update
===================== */
function updateDots(index) {
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
  window.__carousel__ = carousel;
  initDragInput(carousel);
  updateDots(0);
}

/* =====================
   Glitch 初期化
===================== */
initGlitchLayer?.();

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  dotsWrap?.classList.add("visible");
  startAutoTransition?.(goChapter25);
});

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
  startAutoTransition?.(goChapter25);
});


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

  fadeLayer?.classList.add("hide");   // ★ 闇は即開く
  dotsWrap?.classList.add("visible");
  startAutoTransition?.(goChapter25);

  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
});
