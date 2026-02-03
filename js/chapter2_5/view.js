// chapter2_5/view.js
import { state } from "./state.js";

let dualFlipped = false;

export function getPages() {
  return Array.from(document.querySelectorAll(".page"));
}

function updateDots(index) {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

export function showPage(index) {
  const pages = getPages();
  if (!pages.length) return;

  pages.forEach(p => {
    p.classList.remove("active", "show-text", "flipped");
  });

  const page = pages[index];
  if (!page) return;

  if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    page.classList.toggle("flipped", dualFlipped);
  }

  page.classList.add("active");

  updateDots(index);

  state.prevIndex = index;
  state.index = index;
  state.showingText = false;
}

export function showText(index) {
  const page = getPages()[index];
  if (!page) return;

  page.classList.add("show-text");
  state.showingText = true;
}

export function hideText(index) {
  const page = getPages()[index];
  if (!page) return;

  page.classList.remove("show-text");
  state.showingText = false;
}
