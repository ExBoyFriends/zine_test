// chapter2_5/view.js
import { state } from "../utils/state.js";

let dualFlipped = false;
let isFading = false; // フェード中フラグ

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* ===================== Dots update ===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===================== Page control ===================== */
export function showPage(index) {
  if (!pages.length || isFading) return;  // フェード中は無視

  const prevPage = pages[state.index];
  const nextPage = pages[index];
  if (!nextPage) return;

  isFading = true;  // フェード開始

  // dualページの場合は反転処理
  if (nextPage.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    nextPage.classList.toggle("flipped", dualFlipped);
  }

  // 前ページは非アクティブ化（即時）
  prevPage?.classList.remove("active");

  // フェードイン
  nextPage.classList.add("active");
  nextPage.style.opacity = 0;
  nextPage.style.transition = "opacity 0.5s ease"; // フェード時間
  requestAnimationFrame(() => {
    nextPage.style.opacity = 1;
  });

  // transitionend でフラグ解除 & ドット更新
  nextPage.addEventListener(
    "transitionend",
    function onEnd() {
      nextPage.removeEventListener("transitionend", onEnd);
      nextPage.style.transition = "";
      nextPage.style.opacity = "";
      updateDots(index);
      isFading = false;
    }
  );

  // 状態を更新
  state.prevIndex = index;
  state.index = index;
  state.showingText = false;
};

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

