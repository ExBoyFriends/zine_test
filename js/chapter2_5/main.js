import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  initLoader(loader, () => {

    // loaderが完全に消え、描画が1フレーム確定してから
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // 初期ページ表示（chapter1と同タイミング）
        showPage(state.index);
        initTapInteraction();

        // dots は少し遅れて
        setTimeout(() => {
          document.querySelector(".dots")?.classList.add("visible");
        }, 300);

      });
    });

  });
});
