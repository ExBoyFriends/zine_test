// js/chapter2_5/main.js
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("ready");

    // フェードイン完了後に最初のページを出す
    setTimeout(() => {
      showPage(state.index);
      initTapInteraction();
    }, 1800); // bodyのtransition時間と合わせる
  });
});
