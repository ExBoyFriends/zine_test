import { initLoader } from "../loader.js";
import { state } from "./state.js";
import { showPage } from "./view.js";
import { initTapInteraction } from "./interaction.js";

const loader = document.getElementById("loader");
const chapter = document.querySelector(".chapter");

const DOT_DELAY = 3800; // ★ chapter1 と完全統一

initLoader(loader, () => {
  // ===== 初回フェードイン =====
  chapter.classList.add("visible");

  // 初期ページ表示
  showPage(state.index);
  initTapInteraction();

  // dots はフェード完了後に表示
  setTimeout(() => {
    document.querySelector(".dots")?.classList.add("visible");
  }, DOT_DELAY);
});
