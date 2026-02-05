// chapter1/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";
import { fadeInStart, fadeOutAndGo } from "../utils/fade.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

const wrapper = document.querySelector(".carousel-wrapper");
const pages   = document.querySelectorAll(".carousel-page");
const last    = document.getElementById("last-page");

initLoader(loader, () => {
  state.index = 0;

  fadeInStart();

  startChapter({
    chapter,
    dots,
    onStart() {
      const carousel = initCarousel(wrapper, pages);

      initLastPage(
        last,
        () => carousel.getCurrentPage(),
        pages.length
      );
    }
  });
});

