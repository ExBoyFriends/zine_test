　// chapter2_5/interaction.js
import { state, resetTextState } from "../utils/state.js";
import { showPage, showText, hideText, getPages } from "./view.js";

const pages = getPages();

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
      dx < 0 ? goNext() : goPrev();  // スワイプ検出
      return;
    }

    if (!moved && dt < 300) handleTap();  // タップ検出
  });
}

function handleTap() {
  const page = pages[state.index];
  if (!page) return;

  if (!state.showingText) {
    showText(state.index);
    state.showingText = true;
    return;
  }

  hideText(state.index);
  state.showingText = false;
  goNext();
}

function goNext() {
  if (state.index >= pages.length - 1) return;
  state.index++;
  resetTextState();
  showPage(state.index);  // 次のページを表示
}

function goPrev() {
  if (state.index <= 0) return;
  state.index--;
  resetTextState();
  showPage(state.index);  // 前のページを表示
}　　　

