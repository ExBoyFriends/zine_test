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

const loader    = document.getElementById("loader");
const scene     = document.querySelector(".scene");
const fadeLayer = document.getElementById("fadeLayer");
const fadeout   = document.getElementById("fadeout");

/* =====================
   初回フェード開始
===================== */

function startInitialFade() {
  requestAnimationFrame(() => {
    scene?.classList.add("visible");
    fadeLayer?.classList.add("hidden");
  });
}

/* =====================
   loader
===================== */

initLoader(loader, () => {
  startInitialFade();
  startAutoTransition?.(goChapter25);
});

/* =====================
   Carousel
===================== */

const carousel = initCarousel3D?.();
window.__carousel__ = carousel ?? null;

if (carousel) {
  initDragInput(carousel);
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
    onFinish: () => {
      location.href = "chapter2_5.html";
    }
  });
}

/* =====================
   bfcache 復帰対策
===================== */

function forceVisibleState() {
  scene?.classList.add("visible");
  fadeLayer?.classList.add("hidden");

  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
  }

  stopGlitch();
}

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    forceVisibleState();
    resetTransitionState?.();
    goChapter25._done = false;

    setTimeout(() => {
      startAutoTransition?.(goChapter25);
    }, 800);
  }

  if (scene) {
    bindLongPressEvents(scene);
  }
});

/* =====================
   Hold Effects
===================== */

setHoldEffects({
  glitchStart: () => {
    startGlitch();
    carousel?.setExtraSpeed?.(1.5);
  },
  glitchEnd: () => {
    stopGlitch();
    carousel?.setExtraSpeed?.(0);
  }
});

window.addEventListener("force-exit", goChapter25);
