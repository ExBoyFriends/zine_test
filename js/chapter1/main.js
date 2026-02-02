// main.js

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
const pages   = document.querySelectorAll(".page");

/* =====================
   設定値（Chapter1 / 2_5 共通）
===================== */
const DOT_DELAY = 3800;

/* =====================
   Chapter1 Start Logic
===================== */
function startChapter1() {
  // 世界を出す（初回フェード）
  chapter.classList.add("visible");

  // 初期ページ
  pages[0]?.classList.add("active");

  // 初期ドット状態
  document.querySelectorAll(".dot")[0]?.classList.add("active");

  // dots 表示を遅らせる
  setTimeout(() => {
    dots?.classList.add("visible");
  }, DOT_DELAY);
}

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  // 初期ページ描画
  showPage(state.index);
  initTapInteraction();

  // Chapter 開始
  startChapter1();
});

/* =====================
   Init
===================== */

// carousel は「操作」だけ担当（初期表示を触らない）
const carousel = initCarousel(wrapper, pages);

// last page
initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);
