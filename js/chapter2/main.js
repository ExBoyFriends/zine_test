// chapter2/main.js
import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { initCarousel3D } from "./carousel3d.js";
import { initDragInput } from "./inputDrag.js";
import {
  bindLongPressEvents,
  startAutoTransition,
  resetTransitionState
} from "./holdTransition.js";
import { playExitTransition } from "./transitionOut.js";
import { initGlitchLayer } from "./effects.js";

const chapter  = document.querySelector(".chapter");
const loader   = document.getElementById("loader");
const dotsWrap = document.querySelector(".dots");
const dots     = [...document.querySelectorAll(".dot")];

/**
 * インデックスに合わせてドットの表示を更新
 */
function updateDots(index = 0) {
  const COUNT = dots.length;
  // カルーセルの回転方向（右回り/左回り）に合わせて反転が必要な場合の処理
  const reversedIndex = (COUNT - 1) - index;
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === reversedIndex);
  });
}

/**
 * 次のチャプターへ遷移
 */
function goChapter25() {
  if (goChapter25._done) return;
  goChapter25._done = true;
  playExitTransition({
    onFinish() {
      location.href = "../HTML/chapter2_5.html";
    }
  });
}
goChapter25._done = false;

// 1. カルーセルの初期化
const carousel = initCarousel3D({
  onIndexChange(index) {
    updateDots(index);
  },
  onExit() {
    goChapter25();
  }
});

// 2. グローバル登録と入力イベントのバインド
if (carousel) {
  window.__carousel__ = carousel;
  initDragInput(carousel);
  // 初期位置のドットをセット
  updateDots(0);
}

// 3. ローダー完了後のシーケンス
initLoader(loader, () => {
  if (carousel) {
    carousel.start(); // 3D計算開始
  }

  // 3-2. 配置が確定するわずかな時間の後、フェードイン
  // 100msだと「計算中」にフェードが始まってしまうので
  // 300ms〜400ms 程度確保し、描画が安定してから visible にします
 setTimeout(() => {
    chapter?.classList.add("visible");
    dotsWrap?.classList.add("visible");
  }, 350); // ここを 350 に変更

  // 3-3. 一定時間操作がない場合の自動遷移タイマー開始
  startAutoTransition(goChapter25);
});

// 4. その他のレイヤー初期化
initGlitchLayer?.();

// 5. ブラウザの「戻る」ボタン（bfcache）対策
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  resetTransitionState();
  goChapter25._done = false;
  // 停止している可能性があるので一度止めてから再開できるように備える
  window.__carousel__?.stop?.();
});

// デバッグ・強制遷移用
window.addEventListener("force-exit", () => {
  goChapter25();
});
