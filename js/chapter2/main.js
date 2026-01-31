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

// カルーセル生成
const carousel = initCarousel3D();

// 🔥 超重要：全体共有（長押し・遷移・加速がここを見る）
window.__carousel__ = carousel;

// ドラッグ入力
initDragInput(carousel);

// DOM
const scene = document.querySelector(".scene");
const glitch = document.querySelector(".glitch-overlay");

/* =====================
   Chapter2 → 2.5 遷移
===================== */

function goChapter25() {
  // 二重遷移防止
  if (goChapter25._done) return;
  goChapter25._done = true;

  playExitTransition({
    onFinish: () => {
      location.href = "chapter2_5.html";
    }
  });
}

/* =====================
   長押し中の演出
===================== */

setHoldEffects({
  glitchStart: () => {
    // 🔥 視覚的に「押してる感」
    glitch?.classList.add("glitch-active");

    // 🔥 押してる最中も少し加速
    carousel.setExtraSpeed(1.5);
  },

  glitchEnd: () => {
    glitch?.classList.remove("glitch-active");

    // 🔥 離したら戻す
    carousel.setExtraSpeed(0);
  }
});

/* =====================
   長押し → 即遷移（holdTransition 側から呼ばれる）
===================== */

window.addEventListener("force-exit", () => {
  goChapter25();
});

/* =====================
   ページ表示時
===================== */

window.addEventListener("pageshow", () => {
  // 状態リセット
  resetTransitionState();

  // 🔥 放置でも遷移
  startAutoTransition(goChapter25);

  // 🔥 長押しイベント接続
  bindLongPressEvents(scene);
});

