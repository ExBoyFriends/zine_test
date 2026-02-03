// chapter2_5/view.js
import { state } from "./state.js";

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));
const dots  = Array.from(document.querySelectorAll(".dot"));

export function getPages() {
  return pages;
}

/* =====================
   Dots update（chapter1準拠）
===================== */
function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* =====================
   Page control
===================== */
export function showPage(index) {
  if (!pages.length) return;

  pages.forEach(p => {
    p.classList.remove("active", "show-text");
  });

  const page = pages[index];
  if (!page) return;

  /* ---- dual（joker）反転 ----
     ・同じ index の再表示では反転しない
     ・bfcache 復帰時も破綻しない
  -------------------------------- */
  if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
  }

  // dual 以外では flipped を残さない
  pages.forEach(p => {
    if (!p.classList.contains("dual")) {
      p.classList.remove("flipped");
    }
  });

  if (page.classList.contains("dual")) {
    page.classList.toggle("flipped", dualFlipped);
  }

  /* ---- dots ---- */
  updateDots(index);

  /* ---- active ---- */
  page.classList.add("active");

  /* ---- state ---- */
  state.prevIndex   = index;
  state.index       = index;
  state.showingText = false;
}

/* =====================
   Text control
===================== */
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
