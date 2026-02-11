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

  startChapter({
    chapter,
    dots,
    onStart() {

      const pages = getPages();

      const transition = createTransitionManager({
        nextUrl: "chapter3.html"
      });

      showPage(state.index);

      /* ==========================
         ページ送り
      ========================== */

      let auto; // ← 後で代入

      function nextPage() {
        auto?.pause();

        if (state.index >= pages.length - 1) return;

        state.index++;
        state.showingText = false;
        showPage(state.index);
      }

      function prevPage() {
        auto?.pause();

        if (state.index <= 0) return;

        state.index--;
        state.showingText = false;
        showPage(state.index);
      }

      function openText() {
        showText(state.index);
        state.showingText = true;
      }

      function closeText() {
        hideText(state.index);
        state.showingText = false;
      }

      /* ==========================
         タップ / スワイプ
      ========================== */

      initTapInteraction({
        goNext: nextPage,
        goPrev: prevPage
      });

      /* ==========================
         自動詩スライド
      ========================== */

      auto = initAutoPoemSlide({
        openDelay: 3000,
        showDelay: 3000,
        resumeDelay: 5000, // 手動後5秒で復帰
        getIndex: () => state.index,
        total: pages.length,
        openText,
        closeText,
        goNext: nextPage,
        goLast: () => transition.goNext()
      });

    }
  });
});

/* ==========================
   bfcache対策
========================== */

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});

