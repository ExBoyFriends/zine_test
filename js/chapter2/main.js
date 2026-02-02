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
const fadeLayer = document.getElementById("fadeLayer");
const scene     = document.querySelector(".scene");

/* =====================
   初期化
===================== */

// カルーセル
const carousel = initCarousel3D?.();
window.__carousel__ = carousel ?? null;

if (carousel) {
  initDragInput(carousel);
}

// グリッチ
initGlitchLayer?.();

/* =====================
   初回ロード（入口フェード）
===================== */
initLoader(loader, () => {
  requestAnimationFrame(() => {
    fadeLayer?.classList.add("hidden");
  });

  startAutoTransition?.(goChapter25);
});

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
   長押し演出フック
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

/* =====================
   強制遷移
===================== */
window.addEventListener("force-exit", goChapter25);

/* =====================
   pageshow（bfcache 対策）
===================== */
window.addEventListener("pageshow", e => {
  if (e.persisted) {
    fadeLayer?.classList.add("hidden");

    resetTransitionState?.();
    goChapter25._done = false;

    carousel?.setHolding?.(false);
    carousel?.setExtraSpeed?.(0);

    startAutoTransition?.(goChapter25);
  }

  bindLongPressEvents(scene);
});

