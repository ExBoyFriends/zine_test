//chapter2_5/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { startChapter } from "../chapterStart.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

/* =====================
   DOM
===================== */
const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

/* =====================
   Loader 完了
===================== */
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
