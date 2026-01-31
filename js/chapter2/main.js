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
import { initGlitchLayer } from "./effects.js";

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
const glitch = document.querySelector(".glitch-overlay");

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
   長押し演出フック
===================== */

setHoldEffects({
  glitchStart: () => {
    glitch?.classList.add("glitch-active");
    carousel?.setExtraSpeed?.(1.5);
  },
  glitchEnd: () => {
    glitch?.classList.remove("glitch-active");
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
  // 🔥 戻る（bfcache復帰）の場合
  if (e.persisted) {
    // 遷移・長押し状態を完全リセット
    resetTransitionState?.();
    goChapter25._done = false;

    // ローダーが残ってたら強制排除
    if (loader) {
      loader.classList.add("hide");
      loader.style.display = "none";
    }

    // グリッチ残留対策
    glitch?.classList.remove("glitch-active");

    // カルーセル状態リセット
    carousel?.setHolding?.(false);
    carousel?.setExtraSpeed?.(0);
  }

  // 🔁 毎回必ず再セット
  startAutoTransition?.(goChapter25);

  if (scene) {
    bindLongPressEvents(scene);
  }
});
