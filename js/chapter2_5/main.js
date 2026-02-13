// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { showPage, getPages, showText, hideText } from "./view.js";
import { initTapInteraction } from "./interaction.js";
import { initAutoPoemSlide } from "../utils/autoPoemSlide.js";
import { createTransitionManager } from "../utils/transitionManager.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

initLoader(loader, () => {
  // 1. 状態リセット
  state.index = 0;
  state.showingText = false;

  // 2. 表示開始
  requestAnimationFrame(() => {
    chapter?.classList.add("visible");
    dots?.classList.add("visible");
    showPage(state.index); // 最初のページだけ先に描画

    // 3. インタラクションやオートスライドは、少し遅らせて「裏」で構築
    // ローダーの「鼓動」と「夜明け」を止めないための余白です
    setTimeout(() => {
      const pages = getPages();
      const transition = createTransitionManager({ nextUrl: "chapter3.html" });

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
    }, 150);
  });
});

// ...bfcache 対策は変更なし（元のまま）...
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
