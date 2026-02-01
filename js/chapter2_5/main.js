import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  initLoader(loader, () => {
    // chapter をフェードイン
    document.body.classList.add("ready");

    // 初期ページ
    showPage(state.index);
    initTapInteraction();

    // dots は少し遅れて出す（chapter1と同じ間）
    requestAnimationFrame(() => {
      setTimeout(() => {
        const dots = document.querySelector(".dots");
        dots?.classList.add("visible");
      }, 300);
    });
  });
});
