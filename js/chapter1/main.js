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
  // 1. 暗闇の中で状態のみ確定（負荷ゼロ）
  state.index = 0;

  // 2. 第1フレーム：chapter を active にして描画準備（まだ透明）
  requestAnimationFrame(() => {
    chapter?.classList.add("active");

    // 3. 第2フレーム：ここから visible を付けてフェードイン開始
    // これにより、ローダーの「鼓動」と「フェードアウト」の初動が守られる
    requestAnimationFrame(() => {
      chapter?.classList.add("visible");
      dots?.classList.add("visible");

      // 4. 重い初期化（カルーセル構築など）を 300ms 遅延させて実行
      // ローダーが消えゆく「一番重い瞬間」を避けて JS を走らせる
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
      }, 300);
    });
  });
});

// bfcache対応（戻るボタン対策）
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  const loaderEl = document.getElementById("loader");
  if (loaderEl) {
    loaderEl.style.display = "none";
    loaderEl.style.opacity = "0";
  }
  state.index = state.index ?? 0;
  chapter?.classList.add("active", "visible");
  dots?.classList.add("visible");
});
