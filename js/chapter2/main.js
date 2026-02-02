//chapter2/main.js

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
const fadeout = document.getElementById("fadeout");
const loader  = document.getElementById("loader");

const dotsWrap = document.querySelector(".dots");
const dots = document.querySelectorAll(".dot");

// 長押し bind 管理（多重防止）
let longPressBound = false;

/* =====================
   Dots update（chapter1準拠）
===================== */

function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Carousel 初期化
===================== */

const carousel = initCarousel3D({
  onIndexChange: index => {
    updateDots(index);
  }
});

window.__carousel__ = carousel ?? null;

// ドラッグ
if (carousel) {
  initDragInput(carousel);
} else {
  console.warn("[chapter2] carousel init failed");
}

/* =====================
   Loader 完了
===================== */

initLoader(loader, () => {
  // loader を確実に消す
  if (loader) {
    loader.classList.add("hide");
    loader.style.display = "none";
  }

  // dots 表示（chapter1と同じ役割）
  dotsWrap?.classList.add("visible");

  // 自動遷移スタート
  startAutoTransition?.(goChapter25);
});

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
   見た目の強制復帰（bfcache用）
===================== */

function forceVisibleState() {
  // 出口フェード解除
  if (fadeout) {
    fadeout.classList.remove("active");
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
  }

  // グリッチ完全停止
  stopGlitch();

  // body 保険
  document.body.classList.remove("fade-out");
  document.body.style.opacity = "1";
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
   ページ表示（初回 / bfcache）
===================== */

window.addEventListener("pageshow", e => {
  if (e.persisted) {
    /* ===== 戻る（bfcache） ===== */

    // ① 見た目即復帰
    forceVisibleState();

    // ② 内部状態リセット
    resetTransitionState?.();
    goChapter25._done = false;

    // loader 残留対策
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    // carousel 安全状態
    if (carousel) {
      carousel.setHolding?.(false);
      carousel.setExtraSpeed?.(0);
    }

    // ③ 一瞬の復帰演出
    requestAnimationFrame(() => {
      startGlitch();
      carousel?.setExtraSpeed?.(1.2);
    });

    // ④ 収束
    setTimeout(() => {
      stopGlitch();
      carousel?.setExtraSpeed?.(0);
    }, 1200);

    // ⑤ auto 遷移（bfcache 時のみ）
    setTimeout(() => {
      startAutoTransition?.(goChapter25);
    }, 1200);
  }

  // 長押しイベントは一度だけ bind
  if (!longPressBound && scene) {
    bindLongPressEvents(scene);
    longPressBound = true;
  }
});

