// chapter1/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { initCarousel } from "./carousel.js";
import { initLastPage } from "./lastPage.js";
import { createTransitionManager } from "../utils/transitionManager.js";
import { initAutoSlide } from "../utils/autoSlide.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

const wrapper = document.querySelector(".carousel-wrapper");
const pages   = document.querySelectorAll(".carousel-page");
const last    = document.getElementById("last-page");

initLoader(loader, () => {
  // 1. 暗闇の中で、最小限の状態リセット
  state.index = 0;

  // 2. ブラウザの描画準備を待って表示を開始（Chapter 2方式）
  requestAnimationFrame(() => {
    chapter?.classList.add("visible");
    dots?.classList.add("visible");

    // 3. 重い初期化処理は、さらに次のフレーム、またはわずかな遅延を入れる
    // これにより、ローダーのフェードアウト（夜明け）初動がカクつかなくなります
    setTimeout(() => {
      const transition = createTransitionManager({ nextUrl: "chapter2.html" });
      const carousel = initCarousel(wrapper, pages);
      const lastController = initLastPage(
        last,
        () => carousel.getCurrentPage(),
        pages.length,
        transition
      );

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
    }, 100); 
  });
});

// ...pageshow の記述は変更なし（元のまま）...

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  
  // 1. 真っ黒な幕(loader)を強制的に非表示にする
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
    loader.style.opacity = "0";
  }

  state.index = state.index ?? 0;
  chapter?.classList.add("active", "visible");
  dots?.classList.add("visible");
});
