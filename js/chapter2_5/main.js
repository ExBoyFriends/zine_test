// chapter2_5/main.js

import "../utils/base.js";
import { state } from "../utils/state.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

/* ===================== DOM ===================== */
const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* ===================== Loader 完了 ===================== */
initLoader(loader, () => {
  state.index = 0;  // 初期化

  startChapter({
    chapter,
    dots,
    onStart() {
      // 初回表示は showPage のみ
      showPage(state.index);

      // インタラクション初期化
      initTapInteraction();
    }
  });
});

/* ===================== pageshow（bfcache復帰） ===================== */
window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  // 再表示時に現在のページ状態を復元
  showPage(state.index);
});
