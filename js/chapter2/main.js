import { initBase } from "../base.js";
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
const fadeout = document.getElementById("fadeout");

const dotsWrap = document.querySelector(".dots");
const dots = [...document.querySelectorAll(".dot")];

/* =====================
   Base 初期化（必須）
===================== */
initBase();

/* =====================
   長押し bind（初回ロード用）
===================== */
if (scene && !scene.__holdBound) {
  bindLongPressEvents(scene);
  scene.__holdBound = true;
}

/* =====================
   Dots update（chapter1準拠）
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
  updateDots(0); // 初期ドット
}

/* =====================
   Glitch 初期化
===================== */
initGlitchLayer?.();

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  loader?.classList.add("hide");
  loader && (loader.style.display = "none");

  /* ★ 修正ポイント：
     dots は loader 完了と同時に必ず表示 */
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
   pageshow（bfcache 対策）
===================== */
window.addEventListener("pageshow", e => {
  if (e.persisted) {
    resetTransitionState?.();
    goChapter25._done = false;

    fadeout?.classList.remove("active");
    stopGlitch();

    carousel?.setHolding?.(false);
    carousel?.setExtraSpeed?.(0);

    dotsWrap?.classList.add("visible"); // ← 復帰時も必ず表示
    startAutoTransition?.(goChapter25);
  }

  // 念のため（多重 bind 防止）
  if (scene && !scene.__holdBound) {
    bindLongPressEvents(scene);
    scene.__holdBound = true;
  }
});

