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

// chapter2_5/main.js

initLoader(loader, () => {
  state.index = 0;
  state.showingText = false;

  // ★修正：fadeInStart(3400) を削除
  // ★修正：chapter?.classList.add("active") も削除（loader.jsに任せる）

  startChapter({
    chapter,
    dots,
    onStart() {
     
        requestAnimationFrame(() => {
          chapter?.classList.add("visible");
          dots?.classList.add("visible");
          showPage(state.index);
        });

      const pages = getPages();
      const transition = createTransitionManager({ nextUrl: "chapter3.html" });

      // showPage(state.index); // ← ここで呼ぶと幕が開く前に一瞬見えちゃうので、上のsetTimeout内だけでOK
      
      // ...以下、オートスライド等の初期化

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

// bfcache (戻るボタン) 対策
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // 戻ってきたときにローディング幕が残っていたら強制消去
  if (loader) {
    loader.style.display = "none";
    loader.style.opacity = "0";
  }

  // 状態を復元
  showPage(state.index);
});
