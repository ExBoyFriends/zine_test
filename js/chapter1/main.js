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


// ローダー表示 → フェードイン → チャプター開始
initLoader(loader, () => {
  state.index = 0; // 初期化
//////////////////////////////////////////////////////////////////
// startChapter の前に実行して、準備ができたら幕を開ける
  fadeInStart(1800); // 1.8秒かけてじわ〜っと表示
}, 200);

  startChapter({
    chapter,
    dots,
    onStart() {
      const carousel = initCarousel(wrapper, pages);
      initLastPage(last, () => carousel.getCurrentPage(), pages.length);

      fadeInStart(2000);
    }
  });
});


// bfcache 復帰対応
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  // 再表示時も現在ページを復元
  state.index = state.index ?? 0;
});
