import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  initLoader(loader, () => {
    // ローダー完全終了後
    document.body.classList.add("ready");

    setTimeout(() => {
      showPage(state.index);
      initTapInteraction();
    }, 1800);
  });
});
