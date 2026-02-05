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
  pages.forEach((p, i) => {
    p.classList.toggle("active", i === index);
    if (i !== index) {
      p.classList.remove("show-text");
      p.style.pointerEvents = "none";
    }
  });

  const page = pages[index];
  if (!page) return;

  if (page.classList.contains("dual")) {
    dualFlipped = !dualFlipped;
    page.classList.toggle("flipped", dualFlipped);
  }

  page.style.pointerEvents = "auto";
  updateDots(index);
}

  state.prevIndex = index;
  state.index = index;

  setTimeout(() => {
    isFading = false;
  }, 2600);
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
