// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage, getPages, showText, hideText } from "./view.js";
import { initTapInteraction } from "./interaction.js";
import { createTransitionManager } from "../utils/transitionManager.js";
import { initAutoSlide } from "../utils/autoSlide.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

initLoader(loader, () => {
  state.index = 0;

  const pages = getPages();

  startChapter({
    chapter,
    dots,
    onStart() {

      // 🔥 chapter3へ
      const transition = createTransitionManager({
        nextUrl: "chapter3.html"
      });

      showPage(state.index);

      // interactionに goNext を渡す
      initTapInteraction({
        goNext: nextPage,
        goPrev: prevPage
      });

      function nextPage() {
        if (state.index >= pages.length - 1) {
          transition.goNext();
          return;
        }
        state.index++;
        state.showingText = false;
        showPage(state.index);
      }

      function prevPage() {
        if (state.index <= 0) return;
        state.index--;
        state.showingText = false;
        showPage(state.index);
      }

      // 🔥 完全オート
      initAutoSlide({
        delay: 5000,
        lastTransitionDelay: 3000,
        getIndex: () => state.index,
        total: pages.length,
        goNext: nextPage,
        onLastTransition: () => transition.goNext()
      });

    }
  });
});

/* bfcache */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});

