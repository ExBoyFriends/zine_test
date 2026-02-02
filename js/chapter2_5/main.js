import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  initLoader(loader, () => {
    // 初期ページを即表示（chapter1と同じ）
    showPage(state.index);
    initTapInteraction();

    // dots を少し遅らせて表示
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelector(".dots")?.classList.add("visible");
      }, 300);
    });
  });
});
