import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  initLoader(loader, () => {
    document.body.classList.add("ready");

    // 初期ページ表示
    showPage(state.index);
    initTapInteraction();
  });
});

