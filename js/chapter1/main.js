// chapter1/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";
import { fadeInStart } from "../utils/fade.js";
import { createTransitionManager } from "../utils/transitionManager.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

const wrapper = document.querySelector(".carousel-wrapper");
const pages   = document.querySelectorAll(".carousel-page");
const last    = document.getElementById("last-page");

// ローダー表示 → 完了後に本編開始
initLoader(loader, () => {
  state.index = 0; // 初期化

  // startChapter を呼び、準備が整ってから幕を開ける
  startChapter({
    chapter,
    dots,
    onStart() {
　　  const transition = createTransitionManager({
        nextUrl: "chapter2.html",
       autoDelay: 5000   // ← ここで自動遷移秒数も入れられる
      });
      
      // 1. カルーセルとラストページの初期化
      const carousel = initCarousel(wrapper, pages);
  
      initLastPage(
        last,
        () => carousel.getCurrentPage(), 
        pages.length,
        transition 
      );

      // 2. 準備が整ったので、少しだけ待ってから「黒い幕」を開ける
      // これで画像がパッと出るのではなく、じわ〜っと浮き上がります
      setTimeout(() => {
        fadeInStart(2000); 
      }, 100);
    }
  });
});

// bfcache 復帰対応
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  state.index = state.index ?? 0;
});
