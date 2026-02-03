// chapter2_5/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { startChapter } from "../chapterStart.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

/* =====================
   DOM
===================== */
const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* =====================
   dot 初期化
===================== */
function updateDots(index = 0) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  startChapter({
    chapter,
    dots,
    onStart() {
      // 表示同期
      showPage(state.index);
      updateDots(state.index);

      // interaction
      initTapInteraction();
    }
  });
});

/* =====================
   pageshow（bfcache）
===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  showPage(state.index);
  updateDots(state.index);
});
