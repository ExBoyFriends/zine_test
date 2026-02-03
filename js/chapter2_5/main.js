// chapter2_5/main.js

import "../base.js";
import { initLoader } from "../utils/loader.js";
import { startChapter } from "../utils/chapterStart.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader    = document.getElementById("loader");
const fadeLayer = document.getElementById("fadeLayer");
const chapter   = document.querySelector(".chapter");
const dots      = document.querySelector(".dots");

/* ------------------------------
   初期状態の強制リセット
-------------------------------- */

if (fadeLayer) {
  fadeLayer.classList.remove("fadeout");
  fadeLayer.style.opacity = "1";
  fadeLayer.style.pointerEvents = "none";
}

if (loader) {
  loader.style.display = "block";
}

/* ------------------------------
   Loader → Chapter start
-------------------------------- */

initLoader(loader, () => {
  startChapter({
    chapter,
    dots,
    onStart() {
      showPage(state.index);
      initTapInteraction();
    }
  });
});

/* ------------------------------
   bfcache 対策（戻る対策）
-------------------------------- */

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;

  if (fadeLayer) {
    fadeLayer.classList.remove("fadeout");
    fadeLayer.style.opacity = "0";
  }

  if (loader) {
    loader.style.display = "none";
  }

  showPage(state.index);
});
