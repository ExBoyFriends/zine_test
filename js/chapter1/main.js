// main.js

import { initLoader } from "../loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

const pages   = document.querySelectorAll(".carousel-page");
const wrapper = document.querySelector(".carousel-wrapper");
const loader  = document.getElementById("loader");
const dots    = document.querySelector(".dots");

let carousel = null;

/* =====================
   Start Chapter1
===================== */

function startChapter1() {
  // ① フェード開始（CSSに任せる）
  pages[0]?.classList.add("active");
  dots?.classList.add("visible");

  // ② フェード完了後に normalize
  setTimeout(() => {
    carousel?.normalize();
  }, 1400); // ← CSSの opacity transition と完全一致
}

/* =====================
   Init
===================== */


carousel = initCarousel(wrapper, pages, dots);

initLoader(loader, () => {
  // loader 完全終了 → 次フレームで active
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startChapter1();
    });
  });
});



