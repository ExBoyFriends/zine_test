// chapter2_5/view.js

import { state, resetTextState } from "../utils/state.js";

let dualFlipped = false;
let isFading = false;

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
  if (!pages.length || isFading) return;

  const prevPage = pages[state.index];
  const nextPage = pages[index];
  if (!nextPage) return;

  isFading = true;

  // --- 前ページフェードアウト ---
  if (prevPage) {
    prevPage.style.transition = "opacity 0.4s ease";
    prevPage.style.opacity = 0;
    prevPage.style.pointerEvents = "none";

    prevPage.addEventListener(
      "transitionend",
      function onFadeOut() {
        prevPage.removeEventListener("transitionend", onFadeOut);
        prevPage.classList.remove("active", "show-text", "flipped");
        prevPage.style.transition = "";
        prevPage.style.opacity = "";
      }
    );
  }

  // --- dualページの flipped 設定 ---
  if (nextPage.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    nextPage.classList.toggle("flipped", dualFlipped);
  }

  // --- 次ページフェードイン ---
  nextPage.classList.add("active");
  nextPage.style.opacity = 0;
  nextPage.style.pointerEvents = "auto";
  nextPage.style.transition = "opacity 0.5s ease";

  requestAnimationFrame(() => {
    nextPage.style.opacity = 1;
  });

  nextPage.addEventListener(
    "transitionend",
    function onFadeIn() {
      nextPage.removeEventListener("transitionend", onFadeIn);
      nextPage.style.transition = "";
      nextPage.style.opacity = "";
      updateDots(index);
      isFading = false;
    }
  );

  // 状態更新
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
