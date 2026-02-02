//chapter2/main.js

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
const scene   = document.querySelector(".scene");
const fadeout = document.getElementById("fadeout");
const loader  = document.getElementById("loader");

// 長押し bind 管理（★多重防止）
let longPressBound = false;

/* =====================
   Loader 完了
===================== */

initLoader(loader, () => {
  // loader を確実に消す
  loader.classList.add("hide");
  loader.style.display = "none";

  // 初回フェードイン
  requestAnimationFrame(() => {
    scene?.classList.add("visible");
  });

  // ★ auto 遷移は「初回ロードはここだけ」
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
   見た目の強制復帰（★最重要）
===================== */

function forceVisibleState() {
  // scene
  if (scene) {
    scene.style.opacity = "1";
    scene.style.filter = "none";
    scene.classList.remove("fade-out", "exit");
  }

  // fadeout
  if (fadeout) {
    fadeout.classList.remove("active");
    fadeout.style.opacity = "0";
    fadeout.style.pointerEvents = "none";
  }

  // body
  document.body.classList.remove("fade-out");
  document.body.style.opacity = "1";

  // glitch 停止
  stopGlitch();

  // 背景保険
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

    // ① 即・黒画面解除
    forceVisibleState();

    // ② 内部状態リセット
    resetTransitionState?.();
    goChapter25._done = false;

    // loader 残留対策
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    // carousel を安全状態へ
    if (carousel) {
      carousel.setHolding?.(false);
      carousel.setExtraSpeed?.(0);
    }

    // ③ 復帰演出
    requestAnimationFrame(() => {
      startGlitch();
      carousel?.setExtraSpeed?.(1.2);
    });

    // ④ 収束
    setTimeout(() => {
      stopGlitch();
      carousel?.setExtraSpeed?.(0);
    }, 1200);

    // ⑤ auto 遷移（★bfcache の時だけ）
    setTimeout(() => {
      startAutoTransition?.(goChapter25);
    }, 1200);
  }

  // ★ 長押しイベントは一度だけ bind
  if (!longPressBound && scene) {
    bindLongPressEvents(scene);
    longPressBound = true;
  }
});


