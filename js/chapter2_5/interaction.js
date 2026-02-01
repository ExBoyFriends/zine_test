// js/chapter2_5/interaction.js
import { state, resetTextState } from "./state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

const pages = getPages();

let startX = 0;
let moved = false;

export function initTapInteraction() {

  document.addEventListener("pointerdown", e => {
    startX = e.clientX;
    moved = false;
  });

  document.addEventListener("pointermove", e => {
    if (Math.abs(e.clientX - startX) > 20) {
      moved = true;
    }
  });

  document.addEventListener("pointerup", e => {
    const dx = e.clientX - startX;

    // ===== スワイプ =====
    if (moved && Math.abs(dx) > 40) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
      return;
    }

    // ===== タップ =====
    const page = pages[state.index];
    if (!page) return;

    if (state.showingText) {
      hideText(state.index);
      state.showingText = false;
      return;
    }

    if (!page.dataset.textShown) {
      showText(state.index);
      state.showingText = true;
      return;
    }

    goNext();
  });
}

function goNext() {
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

