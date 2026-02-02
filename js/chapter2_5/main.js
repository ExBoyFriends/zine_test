import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader = document.getElementById("loader");

initLoader(loader, () => {
  // ★ loader.js と完全同期
  showPage(state.index);
  initTapInteraction();

  // dots だけ少し遅らせる
  setTimeout(() => {
    document.querySelector(".dots")?.classList.add("visible");
  }, 300);
});
