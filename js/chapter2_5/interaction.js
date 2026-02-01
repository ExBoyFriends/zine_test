// js/chapter2_5/interaction.js

import { state, resetTextState } from "./state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

const pages = getPages();

export function initTapInteraction() {
  document.addEventListener("pointerdown", () => {
    const page = pages[state.index];
    if (!page) return;

    // テキスト表示中 → 閉じる
    if (state.showingText) {
      hideText(state.index);
      state.showingText = false;
      return;
    }

    // まだテキストを見ていない → 表示
    if (!page.dataset.textShown) {
      showText(state.index);
      state.showingText = true;
      return;
    }

    // 次のページへ
    goNext();
  });
}

export function goNext() {
  if (state.index >= pages.length - 1) return;
  state.index++;
  resetTextState();
  showPage(state.index);
}

export function goPrev() {
  if (state.index <= 0) return;
  state.index--;
  resetTextState();
  showPage(state.index);
}


let startX = 0;
let dragging = false;

document.addEventListener("pointerdown", e => {
  startX = e.clientX;
  dragging = true;
});

document.addEventListener("pointerup", e => {
  if (!dragging) return;
  dragging = false;

  const dx = e.clientX - startX;

  // 横スワイプ判定
  if (Math.abs(dx) < 40) return;

  if (dx < 0) {
    goNext();
  } else {
    goPrev();
  }
});

