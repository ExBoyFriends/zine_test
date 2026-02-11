
// chapter1/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";
import { fadeInStart } from "../utils/fade.js";
import { createTransitionManager } from "../utils/transitionManager.js";
import { initAutoSlide } from "../utils/autoSlide.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

const wrapper = document.querySelector(".carousel-wrapper");
const pages   = document.querySelectorAll(".carousel-page");
const last    = document.getElementById("last-page");

initLoader(loader, () => {
  state.index = 0;

  startChapter({
    chapter,
    dots,
    onStart() {

      const transition = createTransitionManager({
        nextUrl: "chapter2.html"
      });

      const carousel = initCarousel(wrapper, pages);

      const lastController = initLastPage(
        last,
        () => carousel.getCurrentPage(),
        pages.length,
        transition
      );

      // ⭐ 完全オート制御
      initAutoSlide({
        delay: 5000,
        lastOpenDelay: 5000,
        lastTransitionDelay: 3000,
        getIndex: () => carousel.getCurrentPage(),
        total: pages.length,
        goNext: () => carousel.goNext(),
        onLastOpen: () => lastController.open(),
        onLastTransition: () => transition.goNext()
      });

     
    }
  });
});

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  state.index = state.index ?? 0;
});

// bfcache 復帰対応
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  state.index = state.index ?? 0;
});
