// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage, getPages, showText, hideText } from "./view.js";
import { initTapInteraction } from "./interaction.js";
import { initAutoPoemSlide } from "../utils/autoPoemSlide.js";
import { createTransitionManager } from "../utils/transitionManager.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

initLoader(loader, () => {
  state.index = 0;
  state.showingText = false;

  // chapterコンテナ自体を出現させる
  chapter?.classList.add("active", "visible");

  startChapter({
    chapter,
    dots,
    onStart() {
      const pages = getPages();
      const transition = createTransitionManager({ nextUrl: "chapter3.html" });

      // showPage 内で .active を操作するように view.js を組んでいる前提
      showPage(state.index);

      /* ==========================
          制御関数
      ========================== */
      let auto;

      const nextPage = () => {
        auto?.pause();
        if (state.index >= pages.length - 1) return;
        state.index++;
        state.showingText = false;
        showPage(state.index);
      };

      const prevPage = () => {
        auto?.pause();
        if (state.index <= 0) return;
        state.index--;
        state.showingText = false;
        showPage(state.index);
      };

      const openText = () => {
        showText(state.index);
        state.showingText = true;
      };

      const closeText = () => {
        hideText(state.index);
        state.showingText = false;
      };

      /* ==========================
          インタラクション開始
      ========================== */
      initTapInteraction({
        goNext: nextPage,
        goPrev: prevPage
      });

      auto = initAutoPoemSlide({
        openDelay: 3000,
        showDelay: 3000,
        resumeDelay: 5000,
        getIndex: () => state.index,
        total: pages.length,
        openText,
        closeText,
        goNext: nextPage,
        goLast: () => transition.goNext()
      });
      
      auto.start?.();
    }
  });
});

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});
