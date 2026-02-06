// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* ===================== Loader 完了 ===================== */
/* ===================== Loader 完了 ===================== */
initLoader(loader, () => {
  state.index = 0; 

  // 背景の負荷を Chapter 2.5 用に最適化
  const bg = document.querySelector('.background');
  if (bg) {
    // 速度を極限まで落とす（CSS側で --bg-speed: var(...) の設定が必要）
    bg.style.setProperty('--bg-speed', '60s');
    
    // もしこれでも重い場合は、下の行のコメントを外してアニメーションを完全に止める
    // bg.style.animation = 'none';
  }

  // 本編の準備を開始
  startChapter({
    chapter,
    dots,
    onStart() {
      showPage(state.index);
      initTapInteraction();
    }
  });
}); // ← ここで initLoader を閉じる

/* ===================== bfcache 対策 ===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});
