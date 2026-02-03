// chapter2_5/view.js
import { state } from "../utils/state.js";

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* ===================== Dots update（chapter1準拠） ===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===================== Page control ===================== */
export function showPage(index) {
  if (!pages.length) return;

  pages.forEach(p => {
    p.classList.remove("active", "show-text", "flipped");
  });

  const page = pages[index];
  if (!page) return;

  // dualページの場合、反転処理
  if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    page.classList.toggle("flipped", dualFlipped);
  }

  // activeクラスを追加して表示
  page.classList.add("active");

  // ドットの更新
  updateDots(index);

  // 状態を更新
  state.prevIndex = index;
  state.index = index;
  state.showingText = false;
}

/* ===================== Text control ===================== */
export function showText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.add("show-text");
  state.showingText = true;
}

export function hideText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.remove("show-text");
  state.showingText = false;
}
