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

  // 2. 第1フレーム：レイアウトの準備
  requestAnimationFrame(() => {
    chapter?.classList.add("active");

    // 3. 第2フレーム：可視化と最初のページ描画
    requestAnimationFrame(() => {
      // 影の動きを最優先するため、ごくわずかに待機してから visible
      setTimeout(() => {
        chapter?.classList.add("visible");
        dots?.classList.add("visible");
        showPage(state.index);
      }, 50);

      // 4. 大量の画像やテキスト処理を伴う重いロジックを後ろへ
      // Chapter 2.5 はここが一番のフリーズ原因なので、長めに待機
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
      }, 400); 
    });
  });
});

// bfcache対策
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  if (loader) {
    loader.style.display = "none";
    loader.style.opacity = "0";
  }
  showPage(state.index);
  chapter?.classList.add("active", "visible");
});
