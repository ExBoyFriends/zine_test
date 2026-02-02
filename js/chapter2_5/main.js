import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader = document.getElementById("loader");
const chapter = document.querySelector(".chapter");

initLoader(loader, () => {
  // ===== 初回フェードイン =====
  chapter.classList.add("visible");

  // 初期ページ表示
  showPage(state.index);
  initTapInteraction();

  // dots だけ少し遅らせる
  setTimeout(() => {
    document.querySelector(".dots")?.classList.add("visible");
  }, 700);
});
