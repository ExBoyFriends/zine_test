//chapter2_5/main.js

import { initLoader } from "../loader.js";
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
   設定値（Chapter1 / 2_5 共通）
===================== */
const DOT_DELAY = 3800;

/* =====================
   Chapter2_5 Start Logic
===================== */
function startChapter25() {
  // 世界を出す（初回フェード）
  chapter.classList.add("visible");

  // 初期ページ
  showPage(state.index);
  initTapInteraction();

  // dots 表示を遅らせる
  setTimeout(() => {
    dots?.classList.add("visible");
  }, DOT_DELAY);
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  startChapter25();
});

