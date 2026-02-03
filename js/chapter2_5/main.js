// chapter2_5/main.js

import "../base.js";
import { initLoader } from "../loader.js";
import { startChapter } from "../chapterStart.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader  = document.getElementById("loader");
const chapter = document.querySelector(".chapter");
const dots    = document.querySelector(".dots");

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

window.addEventListener("pageshow", e => {
  if (!e.persisted) return;
  showPage(state.index);
});

