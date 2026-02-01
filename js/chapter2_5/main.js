// js/chapter2_5/main.js

import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

// 初期表示
showPage(state.index);

// 操作開始
initTapInteraction();
// フェードイン開始
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("ready");
  });
});
