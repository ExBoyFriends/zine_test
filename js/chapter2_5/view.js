//view.js

import { state } from "./state.js";

let dualFlipped = false;

const pages = Array.from(document.querySelectorAll(".page"));

export function getPages() {
  return pages;
}

export function showPage(index) {
  pages.forEach(p => {
    p.classList.remove("active", "show-text");
  });

  const page = pages[index];
  if (!page) return;

   if (page.classList.contains("dual") && state.prevIndex !== index) {
    dualFlipped = !dualFlipped;
    page.classList.toggle("flipped", dualFlipped);
  }

  page.classList.add("active");

  state.prevIndex = index;
  
  state.showingText = false;
}

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
