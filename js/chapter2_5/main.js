// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

/* ===================== DOM ===================== */
const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* ===================== dots ===================== */
function updateDots(index = 0) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===================== Loader 完了 ===================== */
initLoader(loader, () => {
  state.index = 0;  // 初期化

  startChapter({
    chapter,
    dots,
    onStart() {
      // 初回表示は showPage でページとドットを同期
      showPage(state.index);
      updateDots(state.index);

      // インタラクションを初期化
      initTapInteraction();
    }
  });
});

/* ===================== pageshow（bfcache復帰） ===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // 現在のページ状態で同期
  showPage(state.index);
  updateDots(state.index);
});


