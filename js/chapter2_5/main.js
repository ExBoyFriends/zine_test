// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage, getPages, showText, hideText } from "./view.js";
import { initTapInteraction } from "./interaction.js";
import { initAutoPoemSlide } from "../utils/autoPoemSlide.js";
import { createTransitionManager } from "../utils/transitionManager.js";
import { fadeInStart } from "../utils/fade.js"; // インポート確認

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

initLoader(loader, () => {
  state.index = 0;
  state.showingText = false;

  // 1. ローディング画面をフェードアウトさせる（ここを追加！）
  fadeInStart(3400);

  // 2. chapterコンテナを出現させる準備
  chapter?.classList.add("active");

  startChapter({
    chapter,
    dots,
    onStart() {
      // 3. 少し遅らせてから中身を可視化
      setTimeout(() => {
        requestAnimationFrame(() => {
          chapter?.classList.add("visible");
          dots?.classList.add("visible");
        });
        showPage(state.index);
      }, 500);

      const pages = getPages();
      const transition = createTransitionManager({ nextUrl: "chapter3.html" });

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
