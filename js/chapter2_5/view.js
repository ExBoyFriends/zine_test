// view.js
import { state } from "./state.js";

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* =====================
   Dots update (chapter1準拠)
===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    // 左右の三角は除外
    if (i === 0 || i === dots.length - 1) return;

    dot.classList.toggle("active", i === index + 1);
  });

  // 左矢印の表示制御（chapter1と同じ）
  if (dots[0]) {
    dots[0].style.opacity = index === 0 ? 0 : 1;
  }
}

/* =====================
   Page control
===================== */
export function showPage(index) {
  pages.forEach(p => {
    p.classList.remove("active", "show-text");
  });

  const page = pages[index];
  if (!page) return;

  // ---- joker（dual）反転は active になる前に確定 ----
  if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    page.classList.toggle("flipped", dualFlipped);
  }

  // ---- dots 更新（現在地）----
  updateDots(index);

  page.classList.add("active");

  state.prevIndex = index;
  state.showingText = false;
}

/* =====================
   Text control
===================== */
export function showText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.add("show-text");
}

export function hideText(index) {
  const page = pages[index];
  if (!page) return;

  page.classList.remove("show-text");
}


