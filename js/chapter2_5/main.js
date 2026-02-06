// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* ===================== Loader 完了 ===================== */
initLoader(loader, () => {
  state.index = 0; 

  // loader.js が闇を引かせている間に、本編の準備だけを行う
  startChapter({
    chapter,
    dots,
    onStart() {
      showPage(state.index);
      initTapInteraction(); // 操作の有効化
    }
  });
});

/* ===================== bfcache 対策 ===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});
