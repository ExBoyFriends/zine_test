// chapter1/main.js

import "../utils/base.js";
import "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";


/* =====================
   DOM
===================== */
const loader       = document.getElementById("loader");
const chapter      = document.querySelector(".chapter");
const dots         = document.querySelector(".dots");
const pages = document.querySelectorAll(".carousel-page");

const wrapper      = document.querySelector(".carousel-wrapper");
const lastWrapper  = document.getElementById("last-page");

/* =====================
   Carousel
===================== */
const carousel = initCarousel(wrapper, pages);

/* =====================
   Last Page
===================== */
initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);

/* =====================
   Loader 完了
===================== */
initLoader(loader, () => {
  // 初期状態でstate.indexをリセット（0にする）
  state.index = 0;

  startChapter({
    chapter,
    dots,
    onStart() {
      updateDotsState(); // 初期状態でドットを更新
      showPage(state.index); // showPageは一度だけ
    }
  });
});

function updateDotsState() {
  // ドットの状態を初期化
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === state.index);
  });
}
