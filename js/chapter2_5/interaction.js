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

    // --- スワイプ判定 ---
    if (moved && Math.abs(dx) > 40 && dt < 500) {
      dx < 0 ? goNext() : goPrev();
      return;
    }

    // --- タップ判定 ---
    if (!moved && dt < 300) handleTap();
  });
}

/* ===================== タップ処理 ===================== */
function handleTap() {
  const page = pages[state.index];
  if (!page) return;

  if (!state.showingText) {
    // テキスト表示
    showText(state.index);
    state.showingText = true;
    return;
  }

  // テキスト非表示
  hideText(state.index);
  state.showingText = false;

  // テキスト消えたら次ページへ
  goNext();
}

/* ===================== ページ遷移 ===================== */
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

