// main.js

import { initLoader } from "../loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

const pages       = document.querySelectorAll(".carousel-page");
const wrapper     = document.querySelector(".carousel-wrapper");
const loader      = document.getElementById("loader");
const dots        = document.querySelector(".dots");
const lastWrapper = document.querySelector(".last-img-wrapper");

/* =====================
   Chapter1 Start Logic
===================== */

function startChapter1() {
  pages[0]?.classList.add("active");

  // 初期ドット（アクティブ状態だけ先に確定）
  document
    .querySelectorAll(".dot")[0]
    ?.classList.add("active");

  // 初回フェード完了に合わせて表示
  const DOT_DELAY = 3800;

  setTimeout(() => {
    dots?.classList.add("visible");
  }, DOT_DELAY);
}

/* =====================
   Init
===================== */

// loader 完了 → 初回フェード
initLoader(loader, startChapter1);

// carousel は「操作」だけ担当（初期表示を触らない）
const carousel = initCarousel(wrapper, pages);

// last page
initLastPage(
  lastWrapper,
  () => carousel.getCurrentPage(),
  pages.length
);
