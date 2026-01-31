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
import { initGlitchLayer } from "./effects.js";  // グリッチエフェクトの初期化

/* =====================
   初期化
===================== */

// ローダー初期化
const loader = document.getElementById("loader");
initLoader(loader);

// カルーセル生成
const carousel = initCarousel3D();
window.__carousel__ = carousel;

// ドラッグ入力
initDragInput(carousel);

// DOMエレメント
const scene = document.querySelector(".scene");
const glitch = document.querySelector(".glitch-overlay");

// グリッチエフェクト初期化
initGlitchLayer();

/* =====================
   Chapter2 → 2.5
===================== */

function goChapter25() {
  if (goChapter25._done) return;  // 再実行防止
  goChapter25._done = true;

  // 画面遷移
  playExitTransition({
    onFinish: () => {
      location.href = "chapter2_5.html";
    }
  });
}

/* =====================
   長押し演出
===================== */

// 長押し開始時と終了時のエフェクト設定
setHoldEffects({
  glitchStart: () => {
    glitch?.classList.add("glitch-active");
    carousel.setExtraSpeed(1.5);  // 速度を加速
  },
  glitchEnd: () => {
    glitch?.classList.remove("glitch-active");
    carousel.setExtraSpeed(0);  // 速度リセット
  }
});

/* =====================
   強制遷移
===================== */

// 長押し等で強制的に遷移するイベント
window.addEventListener("force-exit", goChapter25);

/* =====================
   ページ表示
===================== */

// ページが表示された際に行う処理
window.addEventListener("pageshow", () => {
  resetTransitionState();  // 遷移状態をリセット
  startAutoTransition(goChapter25);  // 自動遷移開始
  bindLongPressEvents(scene);  // 長押しイベントのバインド
});
