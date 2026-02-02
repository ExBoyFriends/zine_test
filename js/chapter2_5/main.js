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
// CSS のフェードと体感を揃える
const FADE_DURATION = 2800;
const DOT_DELAY     = FADE_DURATION + 1000;

/* =====================
   Chapter Start Logic
===================== */
function startChapter() {
  // 世界を出す（初回フェード）
  chapter.classList.add("visible");

  // 初期ページ表示
  showPage(state.index);
  initTapInteraction();

  // dots 表示をフェード後に
  setTimeout(() => {
    dots?.classList.add("visible");
  }, DOT_DELAY);
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  startChapter();
});

