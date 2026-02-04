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
      // 表示同期
      showPage(state.index);  // 最初のページを表示
      updateDots(state.index);  // ドットを更新
      initTapInteraction();  // インタラクションを初期化
    }
  });
});

/* ===================== pageshow（bfcache） ===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // ページが再表示されるときに、現在の状態でページとドットを更新
  showPage(state.index);
  updateDots(state.index);
});
