// chapter2_5/view.js

import { state } from "../utils/state.js";

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

  // dual ページの反転処理
  if (nextPage.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    nextPage.classList.toggle("flipped", dualFlipped);
  }

  // ===================== 前ページのリセット =====================
  if (prevPage && prevPage !== nextPage) {
    prevPage.classList.remove("active", "show-text");
    
    // dual 内の画像も初期状態に戻す
    const prevDualImgs = prevPage.querySelectorAll(".dual img");
    prevDualImgs.forEach((img, i) => {
      img.style.opacity = "";
      img.style.transform = ""; // CSS初期状態に戻す
    });

    // 通常ページの画像も opacity をリセット
    prevPage.querySelectorAll("> img").forEach(img => {
      img.style.opacity = "";
    });
  }

  // ===================== 次ページのフェードイン =====================
  nextPage.classList.add("active");

  // dual ページなら画像を透明にしてフェードさせる
  const nextImgs = nextPage.querySelectorAll("img");
  nextImgs.forEach(img => img.style.opacity = 0);

  nextPage.style.opacity = 0;
  nextPage.style.transition = "opacity 0.5s ease"; // ページ全体のフェード
  requestAnimationFrame(() => {
    nextPage.style.opacity = 1;

    // dual 画像は順次フェード
    nextImgs.forEach(img => {
      img.style.transition = "opacity 0.5s ease";
      img.style.opacity = 1;
    });
  });

  // transitionend でフラグ解除 & ドット更新
  nextPage.addEventListener(
    "transitionend",
    function onEnd() {
      nextPage.removeEventListener("transitionend", onEnd);
      nextPage.style.transition = "";
      nextPage.style.opacity = "";
      nextImgs.forEach(img => img.style.transition = ""); // img の transition 解除
      updateDots(index);
      isFading = false;
    }
  );

  // 状態更新
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

