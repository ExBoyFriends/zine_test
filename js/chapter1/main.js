// chapter1/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { startChapter } from "../chapterStart.js";

import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";

/* =====================
   DOM
===================== */
const loader       = document.getElementById("loader");
const chapter      = document.querySelector(".chapter");
const dots         = document.querySelector(".dots");
const pages        = document.querySelectorAll(".page");

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
  startChapter({
    chapter,
    dots,
    onStart() {
      pages[0]?.classList.add("active");
      document.querySelectorAll(".dot")[0]?.classList.add("active");

      showPage(state.index);
      initTapInteraction();
    }
  });
});
