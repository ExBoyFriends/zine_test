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
   初期化（初回ロード）
===================== */

// ローダー
const loader = document.getElementById("loader");
initLoader(loader);

// カルーセル
const carousel = initCarousel3D?.();
window.__carousel__ = carousel ?? null;

// ドラッグ
if (carousel) {
  initDragInput(carousel);
} else {
  console.warn("[chapter2] carousel init failed");
}

// DOM
const scene = document.querySelector(".scene");
const fadeout = document.getElementById("fadeout");

// グリッチ初期化
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
   見た目の強制復帰
===================== */

function forceVisibleState() {
  if (scene) {
    scene.style.opacity = "1";
    scene.style.filter = "none";
    scene.classList.remove("fade-out", "exit");
  }

  // 🔑 exit フェードを完全解除（最重要）
  if (fadeout) {
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
  }

  // グリッチ状態を完全解除
  stopGlitch();

  document.body.style.background = "";
  document.documentElement.style.background = "";
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
   強制遷移イベント
===================== */

window.addEventListener("force-exit", goChapter25);

/* =====================
   ページ表示（重要）
   - 初回
   - 戻る（bfcache）
===================== */

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    /* ===== 戻る（bfcache） ===== */

    // ① まず黒画面を完全回避
    forceVisibleState();

    // ② 内部状態リセット
    resetTransitionState?.();
    goChapter25._done = false;

    // ローダー残留対策
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    // カルーセルを安全状態へ
    if (carousel) {
      carousel.setHolding?.(false);
      carousel.setExtraSpeed?.(0);
    }

    // ③ 戻った瞬間、すでに異変
    requestAnimationFrame(() => {
      startGlitch();
      carousel?.setExtraSpeed?.(1.2);
    });

    // ④ 収束
    setTimeout(() => {
      stopGlitch();
      carousel?.setExtraSpeed?.(0);
    }, 1200);

    // ⑤ auto遷移は演出後
    setTimeout(() => {
      startAutoTransition?.(goChapter25);
    }, 1200);

  } else {
    /* ===== 初回ロード ===== */
    startAutoTransition?.(goChapter25);
  }

  // 長押しは毎回再バインド
  if (scene) {
    bindLongPressEvents(scene);
  }
});

