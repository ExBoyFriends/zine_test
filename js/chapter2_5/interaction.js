// js/chapter2_5/interaction.js
import { state, resetTextState } from "./state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

let startX = 0;
let startTime = 0;
let moved = false;

export function initTapInteraction() {
  document.addEventListener("pointerdown", e => {
    startX = e.clientX;
    startTime = performance.now();
    moved = false;
  });

  document.addEventListener("pointermove", e => {
    if (Math.abs(e.clientX - startX) > 15) moved = true;
  });

  document.addEventListener("pointerup", e => {
    const dx = e.clientX - startX;
    const dt = performance.now() - startTime;

    if (moved && Math.abs(dx) > 40 && dt < 500) {
      dx < 0 ? goNext() : goPrev();
      return;
    }

    if (!moved && dt < 300) handleTap();
  });
}

function handleTap() {
  if (!state.showingText) {
    showText(state.index);
    return;
  }

  hideText(state.index);
  goNext();
}

function goNext() {
  const pages = getPages();
  if (state.index >= pages.length - 1) return;

  state.index++;
  resetTextState();
  showPage(state.index);
}

function goPrev() {
  if (state.index <= 0) return;

  state.index--;
  resetTextState();
  showPage(state.index);
}

