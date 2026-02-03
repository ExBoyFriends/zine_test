// chapter1/main.js

import { initBase } from "../base.js";
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
const pages   = document.querySelectorAll(".page");

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  startChapter({
    chapter,
    dots,
    onStart() {
      // 初期ページ
      pages[0]?.classList.add("active");

      // 初期ドット状態
      document.querySelectorAll(".dot")[0]?.classList.add("active");

      // 表示ロジック
      showPage(state.index);
      initTapInteraction();
    }
  });
});

/* =====================
   Init（既存ロジック）
===================== */

// carousel は操作のみ担当
const carousel = initCarousel(wrapper, pages);

// last page
initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);
