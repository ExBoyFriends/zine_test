// chapter1/main.js

import "../utils/base.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";
import { state } from "./state.js";

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
  state.index = 0;  // 必要であれば、stateの初期化もここで行う

  startChapter({
    chapter,
    dots,
    onStart() {
      showPage(state.index);
      initCarousel(document.querySelector(".carousel-wrapper"), document.querySelectorAll(".carousel-page"));
      initLastPage(document.querySelector(".carousel-wrapper"), state.getCurrentPage, document.querySelectorAll(".carousel-page").length);
      
      updateDotsState(); // 初期状態でドットを更新
    }
  });
});

function updateDotsState() {
  // 初期状態でドットを更新
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === state.index);
  });
}
